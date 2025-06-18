import blogModel from "../models/blog.model.js";
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
    const { blog_id, title, content, bannerImageUrl, des, tags } = req.body;

    if (!title && (!content || content.content.length === 0)) {
        return res.status(400).json({ message: 'At least a title or some content is required to save a draft.' });
    }

    try {
        let draftPost;
        const authorId = getAuthUserId();
        if (blog_id) {
            draftPost = await Blog.findOneAndUpdate(
                { blog_id: blog_id, author: authorId, draft: true }, // Ensure it's the author's draft
                {
                    title,
                    banner: banner || null,
                    des: des || '',
                    content: content,
                    tags: tags || [],
                    draft: true, // Keep it as a draft
                },
                { new: true, runValidators: true } // Return the updated document, run schema validators
            );

            if (!draftPost) {
                return res.status(404).json({ message: 'Draft not found or unauthorized to update.' });
            }
        } else {
            // Create a new draft
            draftPost = new Blog({
                blog_id: generateUniqueBlogId(),
                title,
                banner: banner || null,
                des: des || '',
                content: content,
                tags: tags || [],
                author: authorId,
                draft: true,
            });
            await draftPost.save();
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
        const allPosts = await Blog.find({}); // You might want to filter by draft: false for published posts
        res.json(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts.', error: error.message });
    }
};