// src/pages/PublishPage.jsx - No changes needed based on your description.
// (Content remains as provided previously)

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

import {
    updatePublishTags,
    updatePublishDescription,
    clearPublishData,
} from '@/redux/blogSlice.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const PublishPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { title, bannerImageUrl, htmlContent, jsonContent, description, tags } = useSelector(
        (state) => state.blog
    );

    const [tagsInput, setTagsInput] = useState(tags.join(', '));
    const [localDescription, setLocalDescription] = useState(description);

    useEffect(() => {
        if (!title && !htmlContent) {
            toast.error("No blog content to publish. Please start a new post.");
            navigate('/editor');
        }
    }, [title, htmlContent, navigate, toast]);

    const handleTagsInputChange = (e) => {
        setTagsInput(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setLocalDescription(e.target.value);
        dispatch(updatePublishDescription(e.target.value));
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Authentication required. Please log in.");
            navigate("/login");
            return {};
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleFinalPublish = async () => {

        const processedTags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        dispatch(updatePublishTags(processedTags));

        if (!title.trim() || !jsonContent || jsonContent.content.length === 0 || !localDescription.trim()) {
            toast.error("Title, content, and description cannot be empty.");
            return;
        }
        if (processedTags.length === 0) {
            toast.error("Please add at least one tag.");
            return;
        }


        try {
            toast.loading("Publishing blog...", { id: 'final-publish' });
            const config = getAuthHeaders();
            if (!config.headers) return;

            const response = await axios.post("http://localhost:5000/api/blog/publish-blog", {
                title: title,
                banner: bannerImageUrl,
                des: localDescription,
                content: jsonContent,
                tags: processedTags,
            }, config);

            toast.dismiss('final-publish');
            toast.success(response.data.message || "Blog published successfully!");
            console.log("Final Published Data:", response.data.blog);
            navigate("/");
            dispatch(clearPublishData());
            
        } catch (error) {
            toast.dismiss('final-publish');
            console.error("Error publishing blog:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to publish blog.");
            if (error.response?.status === 401) {
                localStorage.removeItem('userToken');
                navigate("/login");
            }
        }
    };

    if (!title && !htmlContent) {
        return <div className="flex justify-center items-center h-screen">Loading preview...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">{title}</CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-2">
                        Preview your blog post before publishing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {bannerImageUrl && (
                        <div className="w-full h-80 overflow-hidden rounded-lg">
                            <img src={bannerImageUrl} alt="Blog Banner" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="description">Blog Description (180-200 characters)</Label>
                        <Textarea
                            id="description"
                            value={localDescription}
                            onChange={handleDescriptionChange}
                            maxLength={200}
                            rows={4}
                            className="mt-2 resize-none border rounded-md p-3 focus:outline-none focus:border-blue-500"
                            placeholder="A short description of your blog"
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            type="text"
                            placeholder="e.g., programming, web development, react"
                            value={tagsInput}
                            onChange={handleTagsInputChange}
                            className="mt-2 border rounded-md p-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Blog Content:</h3>
                        <div
                            className="prose max-w-none border rounded-lg p-6 bg-gray-50"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center mt-8">
                    <Button variant="outline" onClick={() => navigate('/editor')}>
                        Back to Editor
                    </Button>
                    <Button onClick={handleFinalPublish}>
                        Confirm & Publish
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PublishPage;