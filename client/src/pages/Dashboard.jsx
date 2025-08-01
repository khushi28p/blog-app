import React from "react";
import BlogPosts from "@/components/BlogPosts";
import SuggestionsSidebar from "@/components/SuggestionsSidebar";

import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const userName = user?.fullname || user?.username || "Reader";

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if(hour < 12){
      return "Good Morning";
    }
    if(hour < 18){
      return "Good Afternoon";
    }
    return "Good Evening";
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground font-inter">
      <Navbar />
      <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex-grow">
        <div className="mb-6 px-8 md:px-14 md:py-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2 drop-shadow-md">
            {getTimeBasedGreeting()}, {userName}!
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="lg:w-3/4 flex-grow">
            <BlogPosts />
          </div>

          <div className="lg:w-1/4 mt-8 lg:mt-0 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-foreground hidden lg:block">
              Discover
            </h2>
            <SuggestionsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
