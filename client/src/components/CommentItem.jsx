import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, updateComment } from "../redux/commentSlice";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import CommentForm from "./CommentForm";
import { Pencil, Trash2, Reply } from 'lucide-react';

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
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none border rounded p-2 min-h-[50px]",
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
          ? "ml-8 bg-gray-100 rounded-md my-2"
          : "border-b last:border-b-0"
      }`}
    >
      <div className="flex items-center jusitfy-between mb-2">
        <img
          src={comment.commented_by.personal_info.profile_img}
          alt={comment.commented_by.personal_info.username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <p className="font-semibold text-blue-700 mr-2">
          {comment.commented_by.personal_info.username}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(comment.commentedAt).toLocaleString()}
        </p>
      </div>

      {isEditing ? (
        <div>
          <EditorContent editor={editor} />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="text-gray-800"
        />
      )}

      {user && !isEditing && (
        <div className="mt-2 flex items-center justify-end space-x-2"> 
          {user._id && comment.commented_by && user._id === comment.commented_by._id && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 inline-flex items-center space-x-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors duration-200 text-sm"
                title="Edit Comment"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 inline-flex items-center space-x-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 transition-colors duration-200 text-sm"
                title="Delete Comment"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="px-3 py-1 inline-flex items-center space-x-1 rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm"
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
        <div className="ml-4 mt-4 border-l-2 border-gray-200 pl-4">
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
