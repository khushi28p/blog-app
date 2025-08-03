import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { ThumbsUp, MessageSquare } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import { Link } from "react-router-dom";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Link as TiptapLinkExtension } from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";

const displayExtensions = [
  StarterKit,
  Image.configure({ inline: true, allowBase64: true }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return "What’s the title?";
      return "Write something amazing…";
    },
  }),
  Underline,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TiptapLinkExtension.configure({
    openOnClick: false, 
    autolink: true,
    defaultProtocol: "https",
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Subscript,
  Superscript,
];

const BlogPage = () => {
  const { blogId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState("");
  const [isLiked, setIsLiked] = useState(false); 
  const [likesCount, setLikesCount] = useState(0); 

  const { isLoggedIn } = useSelector((state) => state.auth);

  const fetchPost = useCallback(async () => {
    if (!blogId) {
      console.error("Blog ID is missing from URL parameters.");
      setError("Cannot load blog: Invalid URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); 

      console.log("Frontend: Attempting to fetch blog with ID:", blogId);

      const response = await axiosInstance.get(`/blog/${blogId}`);
      setPost(response.data); 
      setLikesCount(response.data.activity?.total_likes || 0); 

      console.log("Fetched blog data:", response.data);

      if (typeof response.data.isLikedByCurrentUser === "boolean") {
        setIsLiked(response.data.isLikedByCurrentUser);
      } else {
        setIsLiked(false); 
        console.warn(
          "Backend did not provide 'isLikedByCurrentUser' status, defaulting to false."
        );
      }
    } catch (err) {
      console.error("Frontend: Error fetching blog post:", err);
      setError(err.response?.data?.message || "Failed to load blog post.");
      toast.error(err.response?.data?.message || "Failed to load blog post.");
    } finally {
      setLoading(false);
    }
  }, [blogId]); 

  useEffect(() => {
    fetchPost();
  }, [blogId, isLoggedIn, fetchPost]); 

  const handleLike = async () => {
    if (!isLoggedIn) { 
      toast.info("Please log in to like a blog.");
      return;
    }

    if (!blogId) {
      toast.error("Cannot like: Blog ID is missing from URL.");
      return;
    }

    console.log("Like Request sent to the backend");

    try {
      setIsLiked(prev => !prev);
      setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

      await axiosInstance.post(`/blog/${blogId}/like`);
      toast.success(isLiked ? "Blog unliked." : "Blog liked!");
    } catch (err) {
      console.error("Error toggling like:", err.response?.data || err.message);
      setIsLiked(prev => !prev);
      setLikesCount(prev => (isLiked ? prev + 1 : prev - 1));
      setError(err.response?.data?.message || "Failed to update like status.");
      toast.error(
        err.response?.data?.message || "Failed to update like status."
      );
    }
  };

  useEffect(() => {
    if (post?.content) {
      let tiptapJson = null;

      if (Array.isArray(post.content) && post.content.length > 0) {
        if (
          typeof post.content[0] === "object" &&
          post.content[0] !== null &&
          post.content[0].type === "doc"
        ) {
          tiptapJson = post.content[0]; 
        } else {
          console.warn(
            "Blog content is an array but its first element is not a Tiptap 'doc' object. Wrapping in 'doc'."
          );
          tiptapJson = { type: 'doc', content: post.content };
        }
      } else if (
        typeof post.content === "object" &&
        post.content !== null &&
        post.content.type === "doc"
      ) {
        tiptapJson = post.content; 
      }

      if (tiptapJson) {
        try {
          const html = generateHTML(tiptapJson, displayExtensions);
          setRenderedHtml(html);
        } catch (htmlError) {
          console.error("Error generating HTML:", htmlError);
          setRenderedHtml("<p>Error rendering content.</p>");
        }
      } else {
        setRenderedHtml("<p>No content to display.</p>"); 
      }
    } else {
        setRenderedHtml("<p>No content to display.</p>"); 
    }
  }, [post]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-background text-muted-foreground font-serif text-2xl tracking-wider animate-pulse">
        <p>Retrieving ancient scrolls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-background text-destructive font-mono text-xl">
        <p>Failed to load blog: {error}</p>
      </div>
    );
  }

  if (!post) { 
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-background text-muted-foreground font-sans text-lg">
        <p>Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen"> 
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-card shadow-lg rounded-lg my-8 border border-border"> 
        {post.banner && (
          <img
            src={post.banner}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
          />
        )}

        <h1 className="text-4xl font-extrabold text-foreground mb-4 leading-tight font-serif"> 
          {post.title}
        </h1>

        {post.author && (
          <Link to={`/profile/${post.author.personal_info?.username}`} className="flex items-center gap-4 mb-6 text-muted-foreground hover:text-primary transition-colors"> 
            {post.author.personal_info?.profile_img ? (
              <img
                src={post.author.personal_info.profile_img}
                alt={post.author.personal_info?.username || "Author"}
                className="w-12 h-12 rounded-full object-cover border-2 border-border p-px" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-bold border-2 border-border">
                {post.author.personal_info?.username
                  ? post.author.personal_info.username.charAt(0).toUpperCase()
                  : "A"}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg text-foreground"> 
                {post.author.personal_info?.username || "Unknown Author"}
              </p>
              <p className="text-sm text-muted-foreground"> 
                {post.publishedAt &&
                  `Published on ${format(
                    new Date(post.publishedAt),
                    "MMM dd,yyyy"
                  )}`}
              </p>
            </div>
          </Link>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1 bg-accent/20 text-accent-foreground text-sm rounded-full font-semibold border border-accent/30" 
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-foreground leading-relaxed font-sans mb-8 focus:outline-none" 
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />

        <div className="flex items-center gap-6 text-muted-foreground border-t border-border pt-6 mt-6"> 
          <button
            onClick={handleLike}
            disabled={!isLoggedIn} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200
                        ${
                            isLiked
                            ? "bg-primary/20 text-primary hover:bg-primary/30" 
                            : isLoggedIn
                            ? "bg-muted text-muted-foreground hover:bg-muted-foreground/10" 
                            : "bg-muted text-muted-foreground/50 cursor-not-allowed" 
                        }`}
          >
            <ThumbsUp
              className={`w-5 h-5 ${
                isLiked
                  ? "fill-primary text-primary" 
                  : "fill-none text-foreground/50"
              }`}
            />
            <span className="font-medium">
              {likesCount || 0} Likes 
            </span>
          </button>
          <div className="flex items-center gap-2 text-foreground"> 
            <MessageSquare className="w-5 h-5 text-accent" /> 
            <span className="font-medium">
              {post.activity.total_comments || 0} Comments
            </span>
          </div>
          <div className="flex items-center gap-2 text-foreground"> 
            <span className="font-medium">
              {post.activity.total_reads || 0} Reads
            </span>
          </div>
        </div>

        {blogId && <CommentSection blogId={post._id} />}
      </div>
    </div>
  );
};

export default BlogPage;