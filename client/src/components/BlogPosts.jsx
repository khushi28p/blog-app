// src/components/BlogPosts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

// Assuming you have Lucide React icons installed for like/dislike
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'; 

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Changed initial to true
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                // Ensure this endpoint matches your backend route for getAllPosts
                const response = await axios.get('http://localhost:5000/api/blog/posts'); 
                setPosts(response.data);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError(err.response?.data?.message || 'Failed to load blog posts.');
                toast.error(err.response?.data?.message || 'Failed to load blog posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px] text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px] text-gray-500">
                <p>No blog posts published yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <Card key={post._id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
    
                    {post.banner && (
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                            <img
                                src={post.banner}
                                alt={post.title || 'Blog Banner'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold line-clamp-2">{post.title}</CardTitle>
                        {/* Display Author Details */}
                        {post.author && (
                            <div className="flex items-center gap-2 mt-1">
                                {post.author.personal_info.profile_img ? (
                                    <img 
                                        src={`${post.author.personal_info.profile_img}`}
                                        alt={post.author.personal_info.username || 'Author'} 
                                        className="w-8 h-8 rounded-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                                        {post.author.personal_info.username ? post.author.personal_info.username.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                )}
                                <CardDescription className="text-sm text-gray-700 font-medium">
                                    By {post.author.personal_info.username || 'Unknown Author'}
                                </CardDescription>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-gray-700 text-sm line-clamp-3">{post.des}</p>
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-between items-center">
                        <div className="flex gap-4 text-gray-600">
                            {/* Display Likes Count */}
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" /> {post.likesCount || 0}
                            </div>
                            {/* Display Dislikes Count */}
                            <div className="flex items-center gap-1">
                                <ThumbsDown className="w-4 h-4" /> {post.dislikesCount || 0}
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" /> {post.commentsCount || 0}
                            </div>
                        </div>
                        <Link to={`/blog/${post.blog_id || post._id}`} className="w-auto">
                            <Button size="sm">Read More</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default BlogPosts;