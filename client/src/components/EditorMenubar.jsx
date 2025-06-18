import React from "react";
import { Button } from "@/components/ui/button";

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

const EditorMenubar = ({ editor, handleImageUpload }) => {
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
          editor.isActive("bold") ? "bg-primary text-secondary" : ""
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
          editor.isActive("italic") ? "bg-primary text-secondary" : ""
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
          editor.isActive("underline") ? "bg-primary text-secondary" : ""
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
          editor.isActive("strike") ? "bg-primary text-secondary" : ""
        }
        variant="ghost"
        size="sm"
      >
        <LuStrikethrough className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuCode className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuHighlighter className="w-4 h-4" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-primary text-secondary"
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
            ? "bg-primary text-secondary"
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
            ? "bg-primary text-secondary"
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
            ? "bg-primary text-secondary"
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
            ? "bg-primary text-secondary"
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
            ? "bg-primary text-secondary"
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
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignCenter className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuAlignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-secondary' : ''}
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
          editor.isActive("link") ? "bg-primary text-secondary" : ""
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
        className={editor.isActive('codeBlock') ? 'bg-primary text-secondary' : ''}
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
        className={editor.isActive('subscript') ? 'bg-primary text-secondary' : ''}
        variant="ghost"
        size="sm"
      >
        <LuSubscript className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'bg-primary text-secondary' : ''}
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

export default EditorMenubar;