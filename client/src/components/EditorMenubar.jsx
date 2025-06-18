import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; 
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuQuote,
  LuList,
  LuListOrdered,
  LuHeading, 
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
  LuHeading1,
  LuHeading2,
  LuHeading3,
} from "react-icons/lu";

const EditorMenuBar = ({ editor}) => {
  if (!editor) {
    return null;
  }
  
  const handleImageUpload = async() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'accept/*';
    input.onchange = async(e) => {
        const file = e.target.files[0];
        if(!file) return;
        const formData = new FormData();
        formData.append('image', file);

        try{
            const response = await axios.post('http://localhost:5000/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            const imageUrl = response.data.url;

            if(imageUrl){
                editor.chain().focus().setImage({src: imageUrl}).run();
            }
        } catch(error){
            console.error("Image upload failed:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    }
    input.click();
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md mb-4 bg-secondary">
      {/* Basic Text Formatting */}
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Bold"
      >
        <LuBold className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Italic"
      >
        <LuItalic className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Underline"
      >
        <LuUnderline className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Strikethrough"
      >
        <LuStrikethrough className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Inline Code"
      >
        <LuCode className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={
          editor.isActive("highlight") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Highlight"
      >
        <LuHighlighter className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote") ? "bg-primary text-secondary" : "" 
        }
        variant="ghost"
        size="sm"
        title="Blockquote"
      >
        <LuQuote className="h-4 w-4" />
      </Button>

      {/* Lists */}
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Bullet List"
      >
        <LuList className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Ordered List"
      >
        <LuListOrdered className="h-4 w-4" />
      </Button>

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" title="Headings">
            <LuHeading className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "bg-primary text-secondary" : ""}
          >
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <DropdownMenuItem
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={
                editor.isActive("heading", { level }) ? "bg-primary text-secondary" : ""
              }
            >
              <LuHeading1 className="inline-block mr-2" /> H{level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text Alignment */}
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
        title="Align Left"
      >
        <LuAlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
        title="Align Center"
      >
        <LuAlignCenter className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
        title="Align Right"
      >
        <LuAlignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
        title="Align Justify"
      >
        <LuAlignJustify className="h-4 w-4" />
      </Button>
      {editor.isActive({ textAlign: 'left' }) || editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' }) || editor.isActive({ textAlign: 'justify' }) ? (
        <Button
          onClick={() => editor.chain().focus().unsetTextAlign().run()}
          variant="ghost"
          size="sm"
          title="Clear Alignment"
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
        className={editor.isActive("link") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Add/Edit Link"
      >
        <LuLink className="h-4 w-4" />
      </Button>

      {/* Image Upload Button */}
      <Button
        onClick={handleImageUpload}
        variant="ghost"
        size="sm"
        title="Insert Image"
      >
        <LuImage className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={!editor.can().chain().focus().setHorizontalRule().run()}
        variant="ghost"
        size="sm"
        title="Horizontal Rule"
      >
        <LuMinus className="h-4 w-4" />
      </Button>

      {/* Code Block */}
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
        title="Code Block"
      >
        <LuSquareCode className="h-4 w-4" />
      </Button>

      {/* Table Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            title="Table Actions"
            disabled={
              !editor.can().chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() && !editor.isActive('table')
            }
          >
            <LuTable className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            disabled={editor.isActive('table')} // Disable if table already exists (or maybe allow a new table after current one)
          >
            Insert Table (3x3)
          </DropdownMenuItem>
          {editor.isActive('table') && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>Add Column Before</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>Add Column After</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>Delete Column</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>Add Row Before</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>Add Row After</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>Delete Row</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().chain().focus().mergeCells().run()}>Merge Cells</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().chain().focus().splitCell().run()}>Split Cell</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={!editor.can().chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Subscript"
      >
        <LuSubscript className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "bg-primary text-secondary" : ""}
        variant="ghost"
        size="sm"
        title="Superscript"
      >
        <LuSuperscript className="h-4 w-4" />
      </Button>

      {/* Undo / Redo / Clear */}
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        size="sm"
        title="Undo"
      >
        <LuUndo className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        size="sm"
        title="Redo"
      >
        <LuRedo className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        variant="ghost"
        size="sm"
        title="Clear Formatting"
      >
        <LuEraser className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorMenuBar;