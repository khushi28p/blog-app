import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ThumbsUp, MessageSquare } from 'lucide-react';

import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

const displayExtensions = [
    StarterKit,
    Image.configure({ inline: true, allowBase64: true }),
    Placeholder.configure({ 
        placeholder: ({ node }) => {
            if (node.type.name === 'heading') return 'What’s the title?';
            return 'Write something amazing…';
        },
    }),
    Underline,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Link.configure({
        openOnClick: false, 
        autolink: true,
        defaultProtocol: 'https',
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Subscript,
    Superscript,
    HorizontalRule,
];

const BlogPage = () => {
    const { blogId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [renderedHtml, setRenderedHtml] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`http://localhost:5000/api/blog/posts/${blogId}`);
                setPost(response.data);
                console.log("Fetched Post Data:", response.data);
            } catch (err) {
                console.error('Error fetching blog post:', err);
                setError(err.response?.data?.message || 'Failed to load blog post.');
                toast.error(err.response?.data?.message || 'Failed to load blog post.');
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchPost();
        }
    }, [blogId]);

    useEffect(() => {
        if (post?.content) {
            let tiptapJson = null;

            if (Array.isArray(post.content) && post.content.length > 0) {
                tiptapJson = post.content[0];
            } else if (typeof post.content === 'object' && post.content !== null && post.content.type === 'doc') {
                tiptapJson = post.content; 
            }

            if (tiptapJson) {
                try {
                    const html = generateHTML(tiptapJson, displayExtensions);
                    setRenderedHtml(html);
                } catch (htmlError) {
                    setRenderedHtml('<p>Error rendering content.</p>');
                }
            } else {
                setRenderedHtml('<p>No content to display.</p>');
            }
        }
    }, [post]); 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)] text-gray-400 font-serif text-2xl tracking-wider animate-pulse">
                <p>Retrieving ancient scrolls...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)] text-red-500 font-mono text-xl">
                <p>Failed to load blog: {error}</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)] text-gray-500 font-sans text-lg">
                <p>Blog post not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-8">
            {post.banner && (
                <img
                    src={post.banner}
                    alt={post.title}
                    className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
                />
            )}

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight font-serif">
                {post.title}
            </h1>

            {post.author && (
                <div className="flex items-center gap-4 mb-6 text-gray-700">
                    {post.author.personal_info?.profile_img ? (
                        <img
                            src={post.author.personal_info.profile_img}
                            alt={post.author.personal_info?.username || 'Author'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 p-px"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl font-bold border-2 border-gray-300">
                            {post.author.personal_info?.username ? post.author.personal_info.username.charAt(0).toUpperCase() : 'A'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-lg">{post.author.personal_info?.username || 'Unknown Author'}</p>
                        <p className="text-sm text-gray-500">
                            {post.publishedAt && `Published on ${format(new Date(post.publishedAt), 'MMM dd,yyyy')}`}
                        </p>
                    </div>
                </div>
            )}

            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, i) => (
                        <span key={i} className="px-4 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-semibold border border-blue-100">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans mb-8 focus:outline-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />

            <div className="flex items-center gap-6 text-gray-600 border-t pt-6 mt-6">
                <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{post.activity.total_likes || 0} Likes</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{post.activity.total_comments || 0} Comments</span>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;