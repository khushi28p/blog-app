import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BlogEditor from "@/components/BlogEditor"; 

const Editor = () => {
  const navigate = useNavigate();

  const handlePublish = ({ title, htmlContent, jsonContent }) => {
    console.log("Publishing blog from EditorPage with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent, null, 2));
    toast.success("Blog published!");
    navigate("/");
  };

  const handleSaveDraft = ({ title, htmlContent, jsonContent }) => {
    console.log("Saving draft from EditorPage with title:", title);
    console.log("HTML Content:", htmlContent);
    console.log("JSON Content:", JSON.stringify(jsonContent, null, 2));
    toast.success("Draft saved!");
  };

  return (
    <BlogEditor onSaveDraft={handleSaveDraft} onPublish={handlePublish} />
  );
};

export default Editor;