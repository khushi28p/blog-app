import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, resetCommentStatus } from "../redux/commentSlice";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import PropTypes from "prop-types";

const CommentSection = ({ blogId }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector((state) => state.comments);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchComments(blogId));
    }
    return () => {
      dispatch(resetCommentStatus());
    };
  }, [dispatch, blogId]);

  const handleCommentSubmitted = () => {
    dispatch(fetchComments(blogId));
  };

  return (
    <div className="comment-section mt-8 bg-background text-foreground">
      <CommentForm
        blogId={blogId}
        onCommentSubmitted={handleCommentSubmitted}
      />

      <h3 className="text-xl font-bold my-4 text-foreground">Comments</h3> 

      <div className="mt-6 border border-border rounded-lg overflow-hidden bg-card"> 
        {status === "loading" && (
          <p className="p-4 text-muted-foreground">Loading comments...</p>
        )}
        {status === "failed" && (
          <p className="p-4 text-destructive"> 
            Error: {error?.message || "Failed to load comments"}
          </p>
        )}
        {comments.length === 0 && status === "succeeded" && (
          <p className="p-4 text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
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