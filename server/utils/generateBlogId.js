export const generateUniqueBlogId = () => {
    return 'blog_' + Date.now() + Math.random.toString(36).substring(2, 8);
}