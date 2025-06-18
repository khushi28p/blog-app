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

import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuQuote,
  LuList,
  LuListOrdered,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuLink,
  LuImage,
  LuUndo,
  LuRedo,
  LuEraser,
  LuCode,
  LuHighlighter,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuMinus,
  LuTable,
  LuSquareCode, 
  LuSubscript,
  LuSuperscript,
} from "react-icons/lu";

const MenuBar = ({ editor, handleImageUpload }) => {
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
        <LuBold className="w-4 h-4" />
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
        <LuItalic className="w-4 h-4" />
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
        <LuUnderline className="h-4 w-4" />
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
        <LuStrikethrough className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuCode className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuHighlighter className="w-4 h-4" />
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
        <LuQuote className="h-4 w-4" />
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
        <LuList className="h-4 w-4" />
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
        <LuListOrdered className="h-4 w-4" />
      </Button>

      {/* Headings */}
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
        <LuHeading1 className="h-4 w-4" />
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
        <LuHeading2 className="h-4 w-4" />
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
        <LuHeading3 className="h-4 w-4" />
      </Button>

      {/* Text Alignment */}
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignCenter className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignJustify className="h-4 w-4" />
      </Button>
      {editor.isActive({ textAlign: 'left' }) || editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' }) || editor.isActive({ textAlign: 'justify' }) ? (
        <Button
          onClick={() => editor.chain().focus().unsetTextAlign().run()}
          variant="ghost"
          size="sm"
          title="Clear Align"
        >
          <LuEraser className="h-4 w-4" />
        </Button>
      ) : null}

      {/* Link Button */}
      <Button
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl); 

          if (url === null) return; 

          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
          } else {
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
        <LuLink className="h-4 w-4" />
      </Button>

      {/* Image Upload Button */}
      <Button
        onClick={handleImageUpload} 
        variant="ghost"
        size="sm"
      >
        <LuImage className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={!editor.can().chain().focus().setHorizontalRule().run()}
        variant="ghost"
        size="sm"
      >
        <LuMinus className="h-4 w-4" />
      </Button>

      {/* Code Block */}
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuSquareCode className="h-4 w-4" />
      </Button>

      {/* Table */}
      <Button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        disabled={!editor.can().chain().focus().insertTable().run()}
        variant="ghost"
        size="sm"
      >
        <LuTable className="h-4 w-4" />
      </Button>
      {editor.isActive('table') && (
        <>
          <Button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            variant="ghost"
            size="sm"
            title="Add Column Before"
          >
            +Col
          </Button>
          <Button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            variant="ghost"
            size="sm"
            title="Add Column After"
          >
            Col+
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            variant="ghost"
            size="sm"
            title="Delete Column"
          >
            -Col
          </Button>
          <Button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            variant="ghost"
            size="sm"
            title="Add Row Before"
          >
            +Row
          </Button>
          <Button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            variant="ghost"
            size="sm"
            title="Add Row After"
          >
            Row+
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteRow().run()}
            variant="ghost"
            size="sm"
            title="Delete Row"
          >
            -Row
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteTable().run()}
            variant="ghost"
            size="sm"
            title="Delete Table"
          >
            Del Table
          </Button>
          <Button
            onClick={() => editor.chain().focus().mergeCells().run()}
            disabled={!editor.can().chain().focus().mergeCells().run()}
            variant="ghost"
            size="sm"
            title="Merge Cells"
          >
            Merge
          </Button>
          <Button
            onClick={() => editor.chain().focus().splitCell().run()}
            disabled={!editor.can().chain().focus().splitCell().run()}
            variant="ghost"
            size="sm"
            title="Split Cell"
          >
            Split
          </Button>
        </>
      )}

      <Button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={!editor.can().chain().focus().toggleSubscript().run()}
        className={editor.isActive('subscript') ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuSubscript className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'bg-accent text-accent-foreground' : ''}
        variant="ghost"
        size="sm"
      >
        <LuSuperscript className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        size="sm"
      >
        <LuUndo className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        size="sm"
      >
        <LuRedo className="h-4 w-4" />
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        variant="ghost"
        size="sm"
      >
        <LuEraser className="h-4 w-4" />
      </Button>
    </div>
  );
};

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

  const handlePublish = async () => {
    console.log("Publishing blog with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent, null, 2));

    navigate("/");
  };

  const handleSaveDraft = async () => {
    console.log("Saving draft with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent, null, 2));

    toast.success("Draft saved!");
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

        {/* TipTap Editor */}
        <MenuBar editor={editor} handleImageUpload={handleImageUpload} />
        <EditorContent
          editor={editor}
          className="border border-border rounded-md p-4 min-h-[calc(100vh-400px)] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        />
      </div>
    </div>
  );
};

export default BlogEditor;