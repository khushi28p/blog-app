import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import React from "react"; // Explicitly import React

const EditorNavbar = ({
    // Props are now actually passed and used
    title,          // Although title/setTitle are not used within EditorNavbar itself,
    setTitle,       // they are present in the prop signature from your previous version.
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
                    onClick={handleSaveDraft} // Now correctly wired
                >
                    Save as draft
                </Button>
                <Button className="rounded-full" onClick={handlePublish}> {/* Now correctly wired */}
                    Publish
                </Button>
            </div>
        </nav>
    );
};

export default EditorNavbar;