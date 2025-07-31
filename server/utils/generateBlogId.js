import Blog from "../models/blog.model.js";

export const generateUniqueBlogId = async() => {
    let uniqueId;
    let isUnique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    
    while(!isUnique && attempts < MAX_ATTEMPTS){
        uniqueId = 'blog_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

        const existingBlog = await Blog.findOne({blog_id: uniqueId});
        if(!existingBlog){
            isUnique = true;
        }

        attempts++;
    }

    if(!isUnique){
        throw new Error('Failed to generate a unique blog ID after multiple attempts.');
    }

    return uniqueId;
}