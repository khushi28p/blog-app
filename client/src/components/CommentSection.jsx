import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../redux/commentSlice';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import PropTypes from 'prop-types';

const CommentSection = ({ blogId }) => { 
    const dispatch = useDispatch();
    const { comments, status, error } = useSelector((state) => state.comments);

    useEffect(() => {
        if (blogId) {
            dispatch(fetchComments(blogId));
        }
    }, [dispatch, blogId]);

    const handleCommentSubmitted = () => {
        dispatch(fetchComments(blogId)); 
    };

    return (
        <div className="comment-section mt-8">
            <h3 className="text-xl font-bold mb-4">Comments</h3>

            <CommentForm blogId={blogId} onCommentSubmitted={handleCommentSubmitted} /> 

            {status === 'loading' && <p>Loading comments...</p>}
            {status === 'failed' && <p className="text-red-500">Error: {error?.message || 'Failed to load comments'}</p>}

            <div className="mt-6 border rounded-lg overflow-hidden">
                {comments.length === 0 && status === 'succeeded' && (
                    <p className="p-4 text-gray-600">No comments yet. Be the first to comment!</p>
                )}
                {comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} blogId={blogId} /> 
                ))}
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    blogId: PropTypes.string.isRequired, 
};

export default CommentSection;