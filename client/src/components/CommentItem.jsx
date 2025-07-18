import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../redux/commentSlice';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import CommentForm from './CommentForm'; 

const CommentItem = ({ comment, blogId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: comment.comment,
        editable: isEditing,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none border rounded p-2 min-h-[50px]',
            },
        },
    }, [isEditing, comment.comment]); 

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this comment? This will also delete any replies to it.')) {
            dispatch(deleteComment(comment._id));
        }
    };

    const handleUpdate = async () => {
        if (!editor || !editor.getHTML() || editor.getHTML().trim() === '<p></p>' || editor.getHTML().trim() === '') {
            alert('Comment cannot be empty.');
            return;
        }
        
        await dispatch(updateComment({ commentId: comment._id, comment: editor.getHTML() }));
        setIsEditing(false);
    };

    if (!editor) {
        return null;
    }

    const sanitizedContent = DOMPurify.sanitize(comment.comment); 

    return (
        <div className={`comment-item p-4 ${comment.isReply ? 'ml-8 bg-gray-100 rounded-md my-2' : 'border-b last:border-b-0'}`}>
            <div className="flex items-center mb-2">
                <img
                    src={comment.commented_by.personal_info.profile_img}
                    alt={comment.commented_by.personal_info.username}
                    className="w-8 h-8 rounded-full mr-2"
                />
                <p className="font-semibold text-blue-700 mr-2">{comment.commented_by.personal_info.username}</p>
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
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className="text-gray-800" />
            )}

            {user && !isEditing && (
                <div className="mt-2 space-x-2">
                    {user._id === comment.commented_by._id && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        {showReplyForm ? 'Cancel Reply' : 'Reply'}
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
                        <CommentItem key={childComment._id} comment={childComment} blogId={blogId} />
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