import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, updateComment } from "../redux/commentSlice"; 
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import CommentForm from "./CommentForm"; 
import { Pencil, Trash2, Reply } from 'lucide-react';
import { toast } from 'sonner';

const CommentItem = ({ comment, blogId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); 
  const [isEditing, setIsEditing] = useState(false); 
  const [showReplyForm, setShowReplyForm] = useState(false);

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: comment.comment, 
      editable: isEditing, 
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none border border-input rounded p-2 min-h-[50px] bg-input text-foreground",
        },
      },
    },
    [isEditing, comment.comment] 
  );

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This will also delete any replies to it."
      )
    ) {
      dispatch(deleteComment(comment._id)); 
      toast.success("Comment deleted successfully!"); 
    }
  };

  const handleUpdate = async () => {
    if (
      !editor ||
      !editor.getHTML() ||
      editor.getHTML().trim() === "<p></p>" ||
      editor.getHTML().trim() === ""
    ) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const resultAction = await dispatch(
      updateComment({ commentId: comment._id, comment: editor.getHTML() })
    );

    if (updateComment.fulfilled.match(resultAction)) {
      setIsEditing(false);
      toast.success("Comment updated successfully!");
    } else {
      toast.error(resultAction.payload?.message || "Failed to update comment.");
    }
  };

  if (!editor) {
    return null;
  }

  const sanitizedContent = DOMPurify.sanitize(comment.comment);

  return (
    <div
      className={`comment-item p-4 ${
        comment.isReply
          ? "ml-8 bg-card rounded-md my-2 border border-border" 
          : "border-b border-border last:border-b-0" 
      }`}
    >
      <div className="flex items-center justify-between mb-2"> 
        <div className="flex items-center">
          {comment.commented_by?.personal_info?.profile_img ? (
          <img
            src={comment.commented_by.personal_info.profile_img}
            alt={comment.commented_by.personal_info.username}
            className="w-8 h-8 rounded-full object-cover mr-2 border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-bold mr-2 border border-border">
            {comment.commented_by.personal_info?.username ? comment.commented_by.personal_info.username.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <p className="font-semibold text-primary mr-2"> 
          {comment.commented_by.personal_info?.username}
        </p>
        </div>
        <p className="text-sm text-muted-foreground"> 
          {new Date(comment.commentedAt).toLocaleString()}
        </p>
      </div>

      {isEditing ? (
        <div>
          <EditorContent editor={editor} />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-muted text-muted-foreground rounded-md hover:bg-muted-foreground/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="text-foreground prose prose-sm max-w-none"
        />
      )}

      {user && !isEditing && (
        <div className="mt-2 flex items-center justify-end space-x-2">
          {user._id && comment.commented_by?._id && user._id === comment.commented_by._id && ( 
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 inline-flex items-center space-x-1 rounded-full text-muted-foreground hover:bg-accent/10 hover:text-primary transition-colors duration-200 text-sm" 
                title="Edit Comment"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 inline-flex items-center space-x-1 rounded-full text-muted-foreground hover:bg-accent/10 hover:text-destructive transition-colors duration-200 text-sm" 
                title="Delete Comment"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="px-3 py-1 inline-flex items-center space-x-1 rounded-md text-muted-foreground bg-primary/10 hover:bg-primary/20 transition-colors duration-200 text-sm" 
          >
            <Reply className="w-4 h-4" />
            <span>{showReplyForm ? "Cancel Reply" : "Reply"}</span>
          </button>
        </div>
      )}

      {showReplyForm && (
        <CommentForm
          blogId={blogId}
          parentCommentId={comment._id}
          onCommentSubmitted={() => setShowReplyForm(false)} 
        />
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="ml-4 mt-4 border-l-2 border-border pl-4"> 
          {comment.children.map((childComment) => (
            <CommentItem
              key={childComment._id}
              comment={childComment}
              blogId={blogId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  blogId: PropTypes.string.isRequired,
};

export default CommentItem;