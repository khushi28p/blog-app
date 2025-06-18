import React, { useEffect, useState } from "react";
import BlogPosts from "@/components/BlogPosts";
import SuggestionsSidebar from "@/components/SuggestionsSidebar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

const Dashboard = () => {
  const [randomTags, setRandomTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:5000/api/blog/trending-tags"
        );
        setRandomTags(response.data);
      } catch (err) {
        console.error("Error fetching random tags:", err);
        setError("Failed to load tags.");
        toast.error("Failed to load trending tags.");
      } finally {
        setLoading(false);
      }
    };
    fetchRandomTags();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Main Content Area (Blog Posts) */}
        <div className="lg:w-3/4">
          <div className="mb-6 text-center">
            {loading ? (
              <p className="text-lg text-gray-500">Loading popular topics...</p>
            ) : error ? (
              <p className="text-lg text-red-500">{error}</p>
            ) : randomTags.length > 0 ? (
              <div className="relative">
                {" "}
                <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  {randomTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-md px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors shrink-0 snap-center" 
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <p className="text-lg text-gray-500">
                No popular tags to display yet.
              </p>
            )}
          </div>

          <BlogPosts />
        </div>

        {/* Sidebar Area (Recommendations/Suggestions) */}
        <div className="lg:w-1/4 mt-8 lg:mt-0">
          <SuggestionsSidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
