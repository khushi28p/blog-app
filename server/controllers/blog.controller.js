import Blogs from "../models/blog.model.js";
import Users from "../models/user.model.js"
import { generateUniqueBlogId } from "../utils/generateBlogId.js";

export const publishBlog = async( req, res) => {
    const authorId = req.user._id;
    const {title, content, banner, des, tags} = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required.' });
    }

    const hasContent = content &&
                       Array.isArray(content.content) &&
                       content.content.length > 0 &&
                       !(content.content.length === 1 && content.content[0].type === 'paragraph' && content.content[0].content === undefined);

    if (!hasContent) {
        return res.status(400).json({ message: 'Blog content is required.' });
    }

    try{
        const newBlogPost = await Blogs.create({
            blog_id: generateUniqueBlogId(),
            title: title,
            banner: banner || null,
            des: des || null,
            content: content,
            tags: tags || [],
            author: authorId,
            draft: false,
        })

        const userBlog = await Users.findByIdAndUpdate(
            {_id: authorId},
            {$push: {blogs: newBlogPost._id}},
            {new: true}
        )

        res.status(201).json({
            status: 'success',
            message: 'Blog published successfully',
            blog: newBlogPost
        });
    }
    catch(error) {
        console.error('Error publishing blog post:', error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.blog_id) {
            return res.status(409).json({ message: 'A blog with this ID already exists. Please try again.' });
        }
        res.status(500).json({ message: 'Failed to publish blog post.', error: error.message });
    }
}

export const saveDraft = async(req, res) => {
    const { blog_id, title, content, banner, des, tags } = req.body;

    if (!title && (!content || content.content.length === 0)) {
        return res.status(400).json({ message: 'At least a title or some content is required to save a draft.' });
    }

    try {
        let draftPost;
        const authorId = req.user._id;
        if (blog_id) {
            draftPost = await Blogs.findOneAndUpdate(
                { blog_id: blog_id, author: authorId, draft: true }, 
                {
                    title,
                    banner: banner || null,
                    des: des || '',
                    content: content,
                    tags: tags || [],
                    draft: true, 
                },
                { new: true, runValidators: true } 
            );

            if (!draftPost) {
                return res.status(404).json({ message: 'Draft not found or unauthorized to update.' });
            }
        } else {
            draftPost = await Blogs.create({
                blog_id: generateUniqueBlogId(),
                title,
                banner: banner || null,
                des: des || '',
                content: content,
                tags: tags || [],
                author: authorId,
                draft: true,
            });
        }

        res.status(201).json({ message: 'Draft saved successfully!', draft: draftPost });
    } catch (error) {
        console.error('Error saving draft:', error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.blog_id) {
            return res.status(409).json({ message: 'A draft with this ID already exists. Please try again.' });
        }
        res.status(500).json({ message: 'Failed to save draft.', error: error.message });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const allPosts = await Blogs.find({draft: false}).populate('author', '_id personal_info.username personal_info.email personal_info.profile_img').sort({createdAt: -1}); 
        const postsWithActivityCounts = allPosts.map(post => {
            const postObj = post.toObject();
            return {
                ...postObj,
                likesCount: postObj.activity?.total_likes || 0,
                commentsCount: postObj.activity?.total_comments || 0,
            };
        });

        res.json(postsWithActivityCounts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts.', error: error.message });
    }
};

export const getTrendingBlogs = async(req, res) => {
    try {
        const trendingPosts = await Blogs.aggregate([
            {$match: {draft: false}},
            {
                $addFields: {
                    trendingScore: {
                        $add: [
                            {$multiply: ["$activity.total_reads", 0.5]},
                            {$multiply: ["$activity.total_likes", 0.3]},
                            {$multiply: ["$activity.total_comments", 0.2]}
                        ]
                    }
                }
            },
            {$sort: {trendingScore: -1, publishedAt: -1}},
            {$limit: 10},
            {
                $lookup:{
                    from: 'users',
                    localField: 'author._id',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            {
                $unwind: '$authorInfo'
            },
            {
                $project: {
                    blog_id: 1,
                    title: 1,
                    banner: 1,
                    des: 1,
                    content: 1,
                    tags: 1,
                    'author._id': '$authorInfo._id',
                    'author.personal_info.username' : '$authorInfo.personal_info.username',
                    'author.personal_info.email': '$authorInfo.personal_info.email',
                    'author.personal_info.profile_img': '$authorInfo.personal_info.profile_img',
                    activity: 1,
                    likesCount: '$activity.total_likes',
                    commentsCount: '$activity.total_comments',
                    publishedAt: 1,
                }
            }
        ]);

        res.json(trendingPosts);
    } catch(error){
        console.error('Error fetchign trending posts', error);
        res.status(500).json({message: 'Failed to fetch trending posts', error: error.message});
    }
}

export const getTrendingTags = async(req, res) => {
    try{
        const trendingTags = await Blogs.aggregate([
            {$match: {draft: false}},
            {$unwind: '$tags'},
            {$group:{
                _id: '$tags',
                count: {$sum: 1}
            }},
            {$sort: {count: -1}},
            {$limit: 10},
            {$project: {_id: 0, tag: "$_id"}}
        ]);

        const tags = trendingTags.map(item => item.tag);

        res.json(tags);
    }
    catch (error) {
        console.error('Error fetching trending tags:', error);
        res.status(500).json({ message: 'Failed to fetch trending tags.', error: error.message });
    }
}

export const getBlog = async(req, res) => {
    try{
        const blogId = req.params.id;
        const blog = await Blogs.findOne({blog_id: blogId}).populate('author', 'personal_info.username personal_info.profile_img').lean();

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        await Blogs.findOneAndUpdate(
            {blog_id: blogId},
            {$inc: {'activity.total_reads': 1}},
            {new: true}
        )

        if (req.user && blog.activity && blog.activity.likedBy) {
            blog.isLikedByCurrentUser = blog.activity.likedBy.includes(req.user._id);
        } else {
            blog.isLikedByCurrentUser = false;
        }

        res.json(blog);
    }catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}

export const likeBlog = async (req, res) => {
    const blog_id = req.params.id;
    const userId = req.user._id; // This should be a Mongoose ObjectId

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required to like a blog.' });
    }

    try {
        const blog = await Blogs.findOne({ blog_id: blog_id });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Initialize activity and liked_by array if they don't exist or aren't arrays
        // IMPORTANT: Changed 'likedBy' to 'liked_by' here to match schema
        if (!blog.activity) {
            blog.activity = {};
        }
        if (!Array.isArray(blog.activity.liked_by)) { // Corrected: liked_by
            blog.activity.liked_by = []; // Corrected: liked_by
        }

        // Use .some() with .equals() for reliable ObjectId comparison
        // IMPORTANT: Changed 'likedBy' to 'liked_by' here to match schema
        const alreadyLiked = blog.activity.liked_by.some(likedId => // Corrected: liked_by
            likedId.equals(userId)
        );

        let updateOperation;
        let message;

        if (alreadyLiked) {
            updateOperation = {
                $inc: { 'activity.total_likes': -1 },
                $pull: { 'activity.liked_by': userId } // Corrected: liked_by (for MongoDB update)
            };
            message = "Blog unliked successfully";
        } else {
            updateOperation = {
                $inc: { 'activity.total_likes': 1 },
                $push: { 'activity.liked_by': userId } // Corrected: liked_by (for MongoDB update)
            };
            message = "Blog liked successfully";
        }

        const updatedBlog = await Blogs.findOneAndUpdate(
            { blog_id: blog_id },
            updateOperation,
            { new: true, runValidators: true }
        );

        // Update user's liked_blogs array
        await Users.findByIdAndUpdate(
            userId, // userId is already the ObjectId
            alreadyLiked ? { $pull: { liked_blogs: blog._id } } : { $push: { liked_blogs: blog._id } },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            message: message,   
            blog: updatedBlog
        });

    } catch (error) {
        console.error('Error toggling like status:', error);
        // Added specific error handling for CastError on _id, which might happen
        // if req.user._id isn't a valid ObjectId format
        if (error.name === 'CastError' && error.path === '_id') {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }
        res.status(500).json({
            message: 'Server error while toggling like status.',
            error: error.message
        });
    }
};