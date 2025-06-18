import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import React from "react"; // Explicitly import React

const EditorNavbar = ({
    handleSaveDraft,
    handlePublish,
}) => {
    return (
        <nav className="bg-background border-b border-border py-4 px-20 shadow-sm flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
                <span className="text-xl font-bold text-foreground">QuillJot</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
                <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={handleSaveDraft} 
                >
                    Save as draft
                </Button>
                <Button className="rounded-full" onClick={handlePublish}>
                    Publish
                </Button>
            </div>
        </nav>
    );
};

export default EditorNavbar;