import React from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../redux/commentSlice"; 
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";
import { toast } from "sonner";

const CommentForm = ({
  blogId,
  parentCommentId = null,
  onCommentSubmitted,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); 
  const commentsStatus = useSelector((state) => state.comments.status); 
  const commentsError = useSelector((state) => state.comments.error); 

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none border border-input rounded p-3 min-h-[100px] bg-input text-foreground",
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!user) {
      toast.info("You must be logged in to comment.");
      return;
    }

    const commentText = editor.getHTML(); 

    if (
      !commentText ||
      commentText.trim() === "<p></p>" || 
      commentText.trim() === ""
    ) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const resultAction = await dispatch(
      createComment({ blogId, comment: commentText, parent: parentCommentId })
    );

    if (createComment.fulfilled.match(resultAction)) {
      editor.commands.clearContent();
      toast.success("Comment posted successfully!");
      if (onCommentSubmitted) {
        onCommentSubmitted(); 
      }
    } else {
      toast.error(resultAction.payload?.message || "Failed to post comment.");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="comment-form mt-4 p-4 border border-border rounded-lg bg-card text-foreground">
      <h4 className="text-lg font-semibold mb-2">
        {parentCommentId ? "Reply to Comment" : "Leave a Comment"}
      </h4>
      {!user && <p className="text-destructive mb-2">Please log in to comment.</p>}
      <form onSubmit={handleSubmit}>
        <EditorContent editor={editor} />
        <div className="mt-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-primary-foreground transition-colors duration-200
                       ${
                         user && commentsStatus !== "loading"
                           ? "bg-primary hover:bg-primary/90" 
                           : "bg-muted text-muted-foreground cursor-not-allowed" 
                       }`}
            disabled={!user || commentsStatus === "loading"}
          >
            {commentsStatus === "loading" ? "Posting..." : "Post Comment"}
          </button>
          {commentsError && (
            <p className="text-destructive mt-2">
              Error: {commentsError.message || "Failed to post comment"}
            </p>
          )}
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