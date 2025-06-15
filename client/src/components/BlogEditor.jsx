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

const BlogEditor = () => {
  const navigate = useNavigate();
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
    ],
    content: "<p>Start writing your amazing blog post...</p>",
    onUpdate: ({ editor }) => {
      setJsonContent(editor.getJSON());
      setHtmlContent(editor.getHTML());
    },
  });

  const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md mb-4 bg-secondary">
      {/* Basic Text Formatting */}
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""
        }
        variant="ghost"
        size="sm"
      >
        Bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""
        }
        variant="ghost"
        size="sm"
      >
        Italic
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline") ? "bg-accent text-accent-foreground" : ""
        }
        variant="ghost"
        size="sm"
      >
        Underline
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "bg-accent text-accent-foreground" : ""
        }
        variant="ghost"
        size="sm"
      >
        Strike
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        Blockquote
      </Button>

      {/* Lists */}
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        Bullet List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        Ordered List
      </Button>

      {/* Headings (Example - you can add a dropdown for this later) */}
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        H1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "bg-accent text-accent-foreground"
            : ""
        }
        variant="ghost"
        size="sm"
      >
        H3
      </Button>

      {/* Link Button */}
      <Button
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl); // Prompts for URL

          if (url === null) return; // User cancelled prompt

          if (url === "") {
            // If URL is empty, unset the link
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
          } else {
            // Set the link
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }
        }}
        className={
          editor.isActive("link") ? "bg-accent text-accent-foreground" : ""
        }
        variant="ghost"
        size="sm"
      >
        Link
      </Button>

      {/* Image Upload Button */}
      <Button
        onClick={handleImageUpload} // Calls your image upload handler
        variant="ghost"
        size="sm"
      >
        Image
      </Button>

      {/* Undo/Redo */}
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        size="sm"
      >
        Undo
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        size="sm"
      >
        Redo
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        variant="ghost"
        size="sm"
      >
        Clear Formatting
      </Button>
    </div>
  );
};

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("image", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
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

          if (editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }

          toast.success("Image uploaded successfully");
        } catch (error) {
          console.error(
            "Image upload failed:",
            error.response?.data?.message || error.message
          );
          toast.error("Image upload failed");
        }
      }
    };
  }, [editor]);

  const handlePublish = async () => {
    console.log("Publishing blog with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent));

    navigate("/");
  };

  const handleSaveDraft = async () => {
    console.log("Saving draft with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editor Navbar */}
      <nav className="bg-background border-b border-border py-4 px-20 shadow-sm flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <span className="text-xl font-bold text-foreground">QuillJot</span>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={handleSaveDraft}
          >
            Save as draft
          </Button>
          <Button className="rounded-full" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </nav>

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

        {/* Quill Editor */}
        <MenuBar editor={editor} />
        <EditorContent
          editor={editor}
          className="border border-border rounded-md p-4 min-h-[calc(100vh-400px)] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default BlogEditor;
