import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import { generateUniqueBlogId } from "../utils/generateBlogId.js";

export const publishBlog = async (req, res) => {
  const authorId = req.user._id;
  const { title, content, banner, des, tags } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required." });
  }

  const hasContent =
    content &&
    Array.isArray(content.content) &&
    content.content.length > 0 &&
    !(
      content.content.length === 1 &&
      content.content[0].type === "paragraph" &&
      content.content[0].content === undefined
    );

  if (!hasContent) {
    return res.status(400).json({ message: "Blog content is required." });
  }

  try {
    const blogId = await generateUniqueBlogId();
    const newBlogPost = await Blog.create({
      blog_id: blogId,
      title: title,
      banner: banner || null,
      des: des || null,
      content: content,
      tags: tags || [],
      author: authorId,
      draft: false,
    });

    await User.findByIdAndUpdate(
      { _id: authorId },
      { $push: { blogs: newBlogPost._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      message: "Blog published successfully",
      blog: newBlogPost,
    });
  } catch (error) {
    console.error("Error publishing blog post:", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.blog_id) {
      return res
        .status(409)
        .json({
          message: "A blog with this ID already exists. Please try again.",
        });
    }
    res
      .status(500)
      .json({ message: "Failed to publish blog post.", error: error.message });
  }
};

export const saveDraft = async (req, res) => {
  const { blog_id, title, content, banner, des, tags } = req.body;

  if (!title && (!content || content.content.length === 0)) {
    return res
      .status(400)
      .json({
        message:
          "At least a title or some content is required to save a draft.",
      });
  }

  try {
    let draftPost;
    const authorId = req.user._id;
    if (blog_id) {
      draftPost = await Blog.findOneAndUpdate(
        { blog_id: blog_id, author: authorId, draft: true },
        {
          title,
          banner: banner || null,
          des: des || "",
          content: content,
          tags: tags || [],
          draft: true,
        },
        { new: true, runValidators: true }
      );

      if (!draftPost) {
        return res
          .status(404)
          .json({ message: "Draft not found or unauthorized to update." });
      }
    } else {
      const blogId = await generateUniqueBlogId();
      draftPost = await Blog.create({
        blog_id: blogId,
        title,
        banner: banner || null,
        des: des || "",
        content: content,
        tags: tags || [],
        author: authorId,
        draft: true,
      });
    }

    res
      .status(201)
      .json({ message: "Draft saved successfully!", draft: draftPost });
  } catch (error) {
    console.error("Error saving draft:", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.blog_id) {
      return res
        .status(409)
        .json({
          message: "A draft with this ID already exists. Please try again.",
        });
    }
    res
      .status(500)
      .json({ message: "Failed to save draft.", error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const allPosts = await Blog.find({ draft: false })
      .populate(
        "author",
        "_id personal_info.username personal_info.email personal_info.profile_img"
      )
      .sort({ createdAt: -1 });
    const postsWithActivityCounts = allPosts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        likesCount: postObj.activity?.total_likes || 0,
        commentsCount: postObj.activity?.total_comments || 0,
      };
    });

    res.json(postsWithActivityCounts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch posts.", error: error.message });
  }
};

export const getTrendingBlogs = async (req, res) => {
  try {
    const trendingPosts = await Blog.aggregate([
      { $match: { draft: false } },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ["$activity.total_reads", 0.5] },
              { $multiply: ["$activity.total_likes", 0.3] },
              { $multiply: ["$activity.total_comments", 0.2] },
            ],
          },
        },
      },
      { $sort: { trendingScore: -1, publishedAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "author._id",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: "$authorInfo",
      },
      {
        $project: {
          blog_id: 1,
          title: 1,
          banner: 1,
          des: 1,
          content: 1,
          tags: 1,
          "author._id": "$authorInfo._id",
          "author.personal_info.username": "$authorInfo.personal_info.username",
          "author.personal_info.email": "$authorInfo.personal_info.email",
          "author.personal_info.profile_img":
            "$authorInfo.personal_info.profile_img",
          activity: 1,
          likesCount: "$activity.total_likes",
          commentsCount: "$activity.total_comments",
          publishedAt: 1,
        },
      },
    ]);

    res.json(trendingPosts);
  } catch (error) {
    console.error("Error fetchign trending posts", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch trending posts",
        error: error.message,
      });
  }
};

export const getTrendingTags = async (req, res) => {
  try {
    const trendingTags = await Blog.aggregate([
      { $match: { draft: false } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, tag: "$_id" } },
    ]);

    const tags = trendingTags.map((item) => item.tag);

    res.json(tags);
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch trending tags.",
        error: error.message,
      });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findOne({ blog_id: blogId })
      .populate("author", "personal_info.username personal_info.profile_img")
      .lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (!blog.draft) {
      await Blog.findOneAndUpdate(
        { blog_id: blogId },
        { $inc: { "activity.total_reads": 1 } },
        { new: true }
      );
    }

    if (req.user && blog.activity && Array.isArray(blog.activity.liked_by)) {
      blog.isLikedByCurrentUser = blog.activity.liked_by.some((likedId) =>
        likedId.equals(req.user._id)
      );
    } else {
      blog.isLikedByCurrentUser = false;
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const likeBlog = async (req, res) => {
  const blog_id = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Authentication required to like a blog." });
  }

  try {
    const blog = await Blog.findOne({ blog_id: blog_id });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.activity) {
      blog.activity = {};
    }
    if (!Array.isArray(blog.activity.liked_by)) {
      blog.activity.liked_by = [];
    }

    const alreadyLiked = blog.activity.liked_by.some((likedId) =>
      likedId.equals(userId)
    );

    let updateOperation;
    let message;

    if (alreadyLiked) {
      updateOperation = {
        $inc: { "activity.total_likes": -1 },
        $pull: { "activity.liked_by": userId },
      };
      message = "Blog unliked successfully";
    } else {
      updateOperation = {
        $inc: { "activity.total_likes": 1 },
        $push: { "activity.liked_by": userId },
      };
      message = "Blog liked successfully";
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { blog_id: blog_id },
      updateOperation,
      { new: true, runValidators: true }
    );

    await User.findByIdAndUpdate(
      userId,
      alreadyLiked
        ? { $pull: { liked_blogs: blog._id } }
        : { $push: { liked_blogs: blog._id } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: message,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error toggling like status:", error);
    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    res.status(500).json({
      message: "Server error while toggling like status.",
      error: error.message,
    });
  }
};
