import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../redux/commentSlice';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';

const CommentForm = ({ blogId, parentCommentId = null, onCommentSubmitted }) => { 
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const commentsStatus = useSelector((state) => state.comments.status);
    const commentsError = useSelector((state) => state.comments.error);

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none border rounded p-2 min-h-[100px]',
            },
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in to comment.');
            return;
        }

        const commentText = editor.getHTML(); 

        if (!commentText || commentText.trim() === '<p></p>' || commentText.trim() === '') {
            alert('Comment cannot be empty.');
            return;
        }

        const resultAction = await dispatch(createComment({ blogId, comment: commentText, parent: parentCommentId }));
        if (createComment.fulfilled.match(resultAction)) {
            editor.commands.clearContent();
            if (onCommentSubmitted) {
                onCommentSubmitted();
            }
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="comment-form mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">{parentCommentId ? 'Reply to Comment' : 'Leave a Comment'}</h4>
            {!user && <p className="text-red-500 mb-2">Please log in to comment.</p>}
            <form onSubmit={handleSubmit}>
                <EditorContent editor={editor} />
                <div className="mt-2">
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-md text-white ${user ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!user || commentsStatus === 'loading'}
                    >
                        {commentsStatus === 'loading' ? 'Posting...' : 'Post Comment'}
                    </button>
                    {commentsError && <p className="text-red-500 mt-2">Error: {commentsError.message || 'Failed to post comment'}</p>}
                </div>
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    blogId: PropTypes.string.isRequired,
    parentCommentId: PropTypes.string,
    onCommentSubmitted: PropTypes.func,
};

export default CommentForm;