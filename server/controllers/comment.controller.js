import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

export const createComment = async (req, res) => {
  const { comment: commentContent, parent } = req.body;
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const isReply = !!parent;
    let newComment;

    if (isReply) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found." });
      }

      newComment = await Comment.create({
        blog_id: blogId,
        blog_author: blog.author,
        comment: commentContent,
        commented_by: userId,
        isReply: true,
        parent: parent,
      });

      await Comment.findbyIdAndUpdate(
        parent,
        { $push: { children: newComment._id } },
        { new: true, runValidators: true }
      );

      await Blog.findByIdAndUpdate(
        blog._id,
        { $inc: { "activity.total_comments": 1 } },
        { new: true, runValidators: true }
      );

      await newComment.populate(
        "commented_by",
        "personal_info.username personal_info.profile_img"
      );

      return res.status(201).json(newComment);
    } else {
      newComment = await Comment.create({
        blog_id: blogId,
        blog_author: blog.author,
        comment: commentContent,
        commented_by: userId,
        isReply: false,
        parent: null,
      });

      await Blog.findByIdAndUpdate(
        blog._id,
        {
          $push: { comments: newComment._id },
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": 1,
          },
        },
        { new: true, runValidators: true }
      );

      await newComment.populate(
        "commented_by",
        "personal_info.username personal_info.profile_img"
      );

      return res.status(201).json(newComment);
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getCommentByBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    let comments = await Comment.find({ blog_id: blogId, parent: null })
      .populate(
        "commented_by",
        "personal_info.username personal_info.profile_img"
      )
      .populate({
        path: "children",
        populate: [
          {
            path: "commented_by",
            select: "personal_info.username personal_info.profile_img",
          },
          {
            path: "children",
            populate: {
              path: "commented_by",
              select: "personal_info.username personal_info.profile_img",
            },
            options: { sort: { commentedAt: 1 } },
          },
        ],
        options: { sort: { commentedAt: 1 } },
      })
      .sort({ commentedAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { comment: commentContent } = req.body;
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.commented_by.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment." });
    }

    comment.comment = commentContent;
    const updatedComment = await comment.save();

    await updatedComment.populate(
      "commented_by",
      "personal_info.username personal_info.profile_img"
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.commented_by.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment." });
    }

    const blogUpdate = { $inc: {} };
    if (!comment.isReply) {
      blogUpdate.$inc["activity.total_parent_comments"] = -1;
      blogUpdate.$pull = { comments: commentId };
    }
    blogUpdate.$inc["activity.total_comments"] = -1;

    await Blog.findByIdAndUpdate(comment.blog_id, blogUpdate, { new: true });

    if (comment.children && comment.children.length > 0) {
      const numChildrenDeleted = comment.children.length;
      await Comment.deleteMany({ _id: { $in: comment.children } });

      await Blog.findByIdAndUpdate(comment.blog_id, {
        $inc: { "activity.total_comments": -numChildrenDeleted },
      });
    }

    if (comment.isReply && comment.parent) {
      await Comment.findByIdAndUpdate(
        comment.parent,
        { $pull: { children: commentId } },
        { new: true }
      );
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment removed successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
