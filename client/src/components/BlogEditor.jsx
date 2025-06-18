// src/components/BlogEditor.jsx

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

// --- START: Tiptap Extensions required by EditorMenubar ---
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align'; // For LuAlignLeft, LuAlignCenter, LuAlignRight, LuAlignJustify
import Link from '@tiptap/extension-link';           // For LuLink
import Table from '@tiptap/extension-table';         // For LuTable and table actions
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript'; // For LuSubscript
import Superscript from '@tiptap/extension-superscript'; // For LuSuperscript
import HorizontalRule from '@tiptap/extension-horizontal-rule'; // For LuMinus (horizontal rule)
// --- END: Tiptap Extensions required by EditorMenubar ---

import EditorMenubar from "./EditorMenubar";
import EditorNavbar from "./EditorNavbar";

import { useDispatch } from 'react-redux';
import { setBlogForPublish } from '@/redux/blogSlice.js';
import { useNavigate } from 'react-router-dom';

import { extractPlainTextDescription } from '@/utils/textUtils.js';

const extensions = [
    StarterKit,
    Image.configure({ inline: true, allowBase64: true }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === 'heading') return 'What’s the title?';
            return 'Write something amazing…';
        },
    }),
    // --- ADD THESE EXTENSIONS ---
    Underline,
    Highlight.configure({ multicolor: true }), // Often configured to allow different highlight colors
    TextAlign.configure({
        types: ['heading', 'paragraph'], // Apply alignment to headings and paragraphs
    }),
    Link.configure({
        openOnClick: false, // Don't open link on click, allow editing
        autolink: true, // Automatically turn URLs into links
        defaultProtocol: 'https', // Default protocol for links
    }),
    Table.configure({
        resizable: true, // Allow resizing table columns
    }),
    TableRow,
    TableHeader,
    TableCell,
    Subscript,
    Superscript,
    HorizontalRule,
    // --- END ADDITIONS ---
];

const BlogEditor = () => {
    // ... (rest of your component code remains the same)
    const [title, setTitle] = useState('');
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerImageUrl, setBannerImageUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(false);
    const [showBannerInput, setShowBannerInput] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const bannerInputRef = useRef(null);

    const editor = useEditor({
        extensions,
        content: '<p></p>',
        onUpdate: ({ editor }) => {
            // Optional: You can dispatch updates to Redux here if you want to save content as user types
        },
    });

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const toggleBannerInput = () => {
        setShowBannerInput(prev => !prev);
        if (showBannerInput) {
            setBannerFile(null);
            setBannerImageUrl('');
        }
    };

    const handleBannerUploadClick = () => {
        bannerInputRef.current?.click();
    };

    const handleBannerFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            const formData = new FormData();
            formData.append('image', file);

            setLoadingBanner(true);
            try {
                const token = localStorage.getItem('userToken');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                const response = await axios.post('http://localhost:5000/api/upload-image', formData, config);
                const url = response.data.url;
                setBannerImageUrl(url);
                toast.success("Banner image uploaded successfully!");
            } catch (error) {
                console.error("Banner image upload failed:", error);
                toast.error("Failed to upload banner image.");
                setBannerFile(null);
                setBannerImageUrl('');
            } finally {
                setLoadingBanner(false);
            }
        }
    };

    const handlePublishClick = () => {
        if (!editor) return;

        if (!title.trim()) {
            toast.error("Blog title is required!");
            return;
        }
        const htmlContent = editor.getHTML();
        const jsonContent = editor.getJSON();
        if (!jsonContent || !jsonContent.content || jsonContent.content.length === 0 || editor.isEmpty) {
            toast.error("Blog content cannot be empty!");
            return;
        }

        const derivedDescription = extractPlainTextDescription(htmlContent, 180);

        dispatch(setBlogForPublish({
            title,
            bannerImageUrl: showBannerInput ? bannerImageUrl : '',
            htmlContent,
            jsonContent,
            description: derivedDescription,
        }));

        navigate('/publish');
    };

    const handleSaveDraftClick = async () => {
        if (!editor) return;

        if (!title.trim() && editor.isEmpty && !bannerImageUrl) {
            toast.info("Draft is empty. Add a title, content, or banner to save.");
            return;
        }

        try {
            toast.loading("Saving draft...", { id: 'save-draft' });
            const token = localStorage.getItem('userToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.post("http://localhost:5000/api/blog/save-draft", {
                title,
                jsonContent: editor.getJSON(),
                banner: showBannerInput ? bannerImageUrl : '',
                des: extractPlainTextDescription(editor.getHTML(), 180),
                tags: [],
            }, config);

            toast.dismiss('save-draft');
            toast.success(response.data.message || "Draft saved!");
            console.log("Draft Data:", response.data.draft);
        } catch (error) {
            toast.dismiss('save-draft');
            console.error("Error saving draft:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to save draft.");
            if (error.response?.status === 401) {
                localStorage.removeItem('userToken');
                navigate("/login");
            }
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div>
            <EditorNavbar
                handleSaveDraft={handleSaveDraftClick}
                handlePublish={handlePublishClick}
            />
            <div className="container mx-auto py-8">
                <Card className="max-w-4xl mx-auto p-6 shadow-lg">
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Blog Title"
                                value={title}
                                onChange={handleTitleChange}
                                className="text-3xl font-bold p-4 border-b-2 focus:outline-none focus:border-blue-500 flex-grow"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleBannerInput}
                                className="shrink-0"
                                title={showBannerInput ? "Hide Banner Input" : "Add Banner Image"}
                            >
                                {showBannerInput ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                )}
                            </Button>
                        </div>

                        {showBannerInput && (
                            <div className="relative w-full h-60 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                {bannerImageUrl ? (
                                    <img src={bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                                ) : loadingBanner ? (
                                    <p>Uploading banner...</p>
                                ) : (
                                    <p className="text-gray-500">No banner image selected</p>
                                )}
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    onChange={handleBannerFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    onClick={handleBannerUploadClick}
                                    className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white"
                                    disabled={loadingBanner}
                                >
                                    {loadingBanner ? 'Uploading...' : 'Upload Banner'}
                                </Button>
                            </div>
                        )}

                        <EditorMenubar editor={editor} />

                        <div className="border rounded-lg p-4 min-h-[300px] overflow-auto editor-content">
                            <EditorContent editor={editor} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BlogEditor;