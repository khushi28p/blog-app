import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import CodeBlock from '@tiptap/extension-code-block';

import EditorNavbar from "./EditorNavbar";
import EditorMenubar from "./EditorMenubar";

const BlogEditor = ({onSaveDraft, onPublish}) => {
  const [title, setTitle] = useState("");
  const [jsonContent, setJsonContent] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,      
        link: false,         
        underline: false,    
        blockquote: false,   
        code: false,         
        codeBlock: false,    
        hardBreak: false,    
      }),
      Image.configure({
        inline: false,
        allowBase64: false, 
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], 
      }),
      Underline,
      Blockquote,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Enter heading...';
          }
          return 'Start writing your amazing blog post...';
        },
        emptyNodeClass: 'is-empty',
        emptyEditorClass: 'is-editor-empty',
      }),
      Code, 
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'], 
      }),
      HorizontalRule,
      HardBreak,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      Typography,
      CodeBlock, 
    ],
    onUpdate: ({ editor }) => {
      const currentJson = editor.getJSON();
      const currentHtml = editor.getHTML();
      setJsonContent(currentJson);
      setHtmlContent(currentHtml);
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-400px)]',
      }
    }
  });

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*"); 
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          toast.loading("Uploading image...", { id: 'image-upload' });
          const response = await axios.post(
            "http://localhost:5000/api/upload-image", 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageUrl = response.data.url; 
          toast.dismiss('image-upload');
          toast.success("Image uploaded successfully!");

          if (editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }

        } catch (error) {
          toast.dismiss('image-upload');
          console.error(
            "Image upload failed:",
            error.response?.data?.message || error.message
          );
          toast.error(`Image upload failed: ${error.response?.data?.message || 'Network Error'}`);
        }
      }
    };
  }, [editor]);

  const handlePublishClick = () => {
    onPublish({title, htmlContent, jsonContent});
  };

  const handleSaveDraftClick = () => {
    onSaveDraft({title, htmlContent, jsonContent});
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editor Navbar */}
      <EditorNavbar  title={title} setTitle={setTitle} handleSaveDraft={handleSaveDraftClick} handlePublish={handlePublishClick} />

      {/* Main Editor Area */}
      <div className="flex-grow container mx-auto px-20 py-8">
        {/* Title Input */}
        <Input
          type="text"
          placeholder="New Blog Title"
          className="w-full text-3xl font-bold py-3 px-0 border-none focus-visible:ring-0 focus-visible:border-none mb-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* TipTap Editor */}
        <EditorMenubar editor={editor} handleImageUpload={handleImageUpload} />
        <EditorContent
          editor={editor}
          className="border border-border rounded-md p-4 min-h-[calc(100vh-400px)] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default BlogEditor;