import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { ThumbsUp, ThumbsDown, MessageSquare, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Autoplay from 'embla-carousel-autoplay';

const BlogPosts = () => {
    const [otherPosts, setOtherPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const trendingResponse = await axios.get('http://localhost:5000/api/blog/trending');
                setTrendingPosts(trendingResponse.data);

                const response = await axios.get('http://localhost:5000/api/blog/posts');

                const trendingIds = new Set(trendingResponse.data.map(post => post._id));
                const filteredOtherPosts = response.data.filter(post => !trendingIds.has(post._id));

                setOtherPosts(filteredOtherPosts);
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

    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)] text-gray-400 font-serif text-2xl tracking-wider animate-pulse">
                <p>Curating stories from the void...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)] text-red-500 font-mono text-xl">
                <p>Glitch in the matrix: {error}</p>
            </div>
        );
    }

    if (trendingPosts.length === 0 && otherPosts.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] text-gray-500 font-sans text-lg">
                <p>The page is unusually quiet...</p>
                <p className="mt-2 text-sm italic">Perhaps new tales are yet to be written.</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden min-h-screen bg-white px-6 sm:px-10">
            
            {trendingPosts.length > 0 && (
                <section className="relative z-10 mb-12 md:mb-16 max-w-6xl mx-auto">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        opts={{
                            loop: true,
                            align: "start",
                            slidesToScroll: 1,
                        }}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="-ml-4">
                            {trendingPosts.map((post, index) => (
                                <CarouselItem key={post._id || post.blog_id} className="pl-4 basis-full">
                                    <div className="p-1">
                                        <Card
                                            className="relative flex flex-col justify-end overflow-hidden rounded-3xl h-[450px] md:h-[500px]
                                        shadow-xl border border-gray-200 transition-all duration-500 ease-out
                                        hover:scale-[1.005] hover:shadow-gray-300/40 hover:-translate-y-1
                                        group"
                                            style={{
                                                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.6) 30%, transparent 100%), url(${post.banner})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            <div className="relative z-10 p-8 pt-20 text-white">
                                                <CardTitle className="text-4xl font-extrabold line-clamp-3 mb-3 leading-tight drop-shadow-md font-serif">
                                                    {post.title}
                                                </CardTitle>
                                                {post.author && (
                                                    <div className="flex items-center gap-3 mb-4">
                                                        {post.author.personal_info?.profile_img ? (
                                                            <img
                                                                src={post.author.personal_info.profile_img}
                                                                alt={post.author.personal_info?.username || 'Author'}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 p-[2px]"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-lg font-bold border-2 border-300">
                                                                {post.author.personal_info?.username ? post.author.personal_info.username.charAt(0).toUpperCase() : 'A'}
                                                            </div>
                                                        )}
                                                        <CardDescription className="text-lg text-gray-200 font-medium font-sans">
                                                            By <span className="text-gray-300 font-semibold">{post.author.personal_info?.username || 'Unknown Author'}</span>
                                                            <span className="ml-3 text-gray-400 text-sm">
                                                                {post.publishedAt && `• ${format(new Date(post.publishedAt), 'MMM dd, yyyy')}`}
                                                            </span>
                                                        </CardDescription>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mt-6">
                                                    <div className="flex gap-6 text-gray-300 text-md">
                                                        <div className="flex items-center gap-2">
                                                            <ThumbsUp className="w-5 h-5 text-green-400" /> <span className="font-semibold">{post.likesCount || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="w-5 h-5 text-blue-400" /> <span className="font-semibold">{post.commentsCount || 0}</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/blog/${post.blog_id || post._id}`}>
                                                        <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                                                            Read Full Blog <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg group-hover:opacity-100 opacity-70 transition-all duration-300 z-20 hover:scale-110 border border-gray-200" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg group-hover:opacity-100 opacity-70 transition-all duration-300 z-20 hover:scale-110 border border-gray-200" />
                    </Carousel>
                </section>
            )}

            {trendingPosts.length > 0 && otherPosts.length > 0 && (
                <p className='px-1 py-2 text-2xl font-bold'>Explore</p>
            )}

            {otherPosts.length > 0 && (
                <section className={`relative z-10 ${trendingPosts.length > 0 ? "mt-0" : "mt-8"} max-w-6xl mx-auto`}>
                    <div className="grid grid-cols-1 gap-6 px-4 sm:px-0">
                        {otherPosts.map((post) => (
                            <Card key={post._id || post.blog_id || `post-${post.title}-${post.publishedAt}`}
                                className="flex flex-col sm:flex-row h-auto sm:h-56 bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100
                                transition-all duration-300 ease-out
                                hover:shadow-xl hover:translate-x-1 hover:border-gray-300"
                            >
                                {post.banner && (
                                    <div className="w-full sm:w-2/5 h-48 sm:h-full overflow-hidden flex-shrink-0">
                                        <img
                                            src={post.banner}
                                            alt={post.title || 'Blog Banner'}
                                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex-grow p-5 flex flex-col justify-between">
                                    <CardHeader className="p-0 pb-2">
                                        <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 font-sans">{post.title}</CardTitle>
                                        {post.author && (
                                            <div className="flex items-center gap-2 mt-1">
                                                {post.author.personal_info?.profile_img ? (
                                                    <img
                                                        src={post.author.personal_info.profile_img}
                                                        alt={post.author.personal_info?.username || 'Author'}
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-bold border-2 border-gray-300">
                                                        {post.author.personal_info?.username ? post.author.personal_info.username.charAt(0).toUpperCase() : 'A'}
                                                    </div>
                                                )}
                                                <CardDescription className="text-sm text-gray-700 font-medium font-sans">
                                                    By <span className="font-semibold">{post.author.personal_info?.username || 'Unknown Author'}</span>
                                                    <span className="ml-2 text-gray-500 text-xs">
                                                        {post.publishedAt && `• ${format(new Date(post.publishedAt), 'MMM dd, yyyy')}`}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                        )}
                                        <p className="text-gray-700 text-sm line-clamp-3 mt-2 font-sans">{post.des}</p>
                                    </CardHeader>
                                    <CardContent className="p-0 flex-grow-0 mb-3">
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag, i) => (
                                                    <span key={`${post._id}-tag-${i}`} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="p-0 pt-2 flex justify-between items-center">
                                        <div className="flex gap-4 text-gray-600 text-sm">
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4 text-green-500" /> {post.likesCount || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-4 h-4 text-blue-500" /> {post.commentsCount || 0}
                                            </div>
                                        </div>
                                        <Link to={`/blog/${post.blog_id || post._id}`} className="w-auto">
                                            <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 shadow">
                                                Read More
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPosts;