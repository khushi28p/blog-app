import blogModel from "../models/blog.model.js";
import userModel from '../models/user.model.js'
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
        const newBlogPost = await blogModel.create({
            blog_id: generateUniqueBlogId(),
            title: title,
            banner: banner || null,
            des: des || null,
            content: content,
            tags: tags || [],
            author: authorId,
            draft: false,
        })

        console.log(newBlogPost)

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
            draftPost = await blogModel.findOneAndUpdate(
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
            draftPost = await blogModel.create({
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

export const getAllPosts = async (req, res) => {
    try {
        const allPosts = await blogModel.find({draft: false}).populate('author', '_id personal_info.username personal_info.email personal_info.profile_img').sort({createdAt: -1}); 
        const postsWithActivityCounts = allPosts.map(post => {
            const postObj = post.toObject();
            return {
                ...postObj,
                likesCount: postObj.activity?.total_likes || 0,
                commentsCount: postObj.activity?.total_comments || 0,
            };
        });

        console.log(postsWithActivityCounts)
        res.json(postsWithActivityCounts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts.', error: error.message });
    }
};

export const getTrendingTags = async(req, res) => {
    try{
        const trendingTags = await blogModel.aggregate([
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