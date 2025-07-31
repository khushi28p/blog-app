import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '@/components/Navbar';
import EditProfileForm from '@/components/EditProfileForm';
import axiosInstance from '@/api/axios';
import { Mail, MapPin, Globe, Youtube, Instagram, Facebook, Twitter, Github } from 'lucide-react';
import { BACKEND_URL } from '@/config';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await axiosInstance.get('/user/blogs'); 
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching user's blogs:", error);
      setBlogs([]); 
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    } else {
      console.log("No user token found. Redirecting or showing public profile.");
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (user) { 
      fetchUserBlogs(); 
    }
  }, [user]); 

  const handleProfileUpdateSuccess = () => {
    fetchUserDetails();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchUserDetails();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 px-4 md:px-20 min-h-screen bg-background">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow md:w-2/3">
            <h1 className="text-3xl font-bold text-foreground mb-2">{user.personal_info?.username}</h1>
            {user.personal_info?.fullname && user.personal_info.fullname !== user.personal_info.username && (
              <p className="text-lg text-muted-foreground mb-4">{user.personal_info.fullname}</p>
            )}
            {user.personal_info?.bio && (
              <p className="text-muted-foreground mb-6">{user.personal_info.bio}</p>
            )}

            <div className="flex space-x-6 text-lg border-b border-border mb-8">
              <span className="font-semibold text-foreground pb-2 border-b-2 border-primary">Home</span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2">About</span>
            </div>

            <div className="space-y-6"> 
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Card key={blog._id} className="w-full shadow-sm rounded-lg flex flex-col md:flex-row gap-4 p-4">
                    <div className="flex-grow">
                      <Link to={`/blog/${blog.blog_id}`} className="block">
                        <h3 className="text-xl font-bold text-foreground mb-2 hover:underline">
                          {blog.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {blog.content.content} 
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-48 h-32 md:h-24 bg-cover bg-center rounded-md overflow-hidden">
                       <img 
                           src={blog.coverImage} 
                           alt={blog.title} 
                           className="w-full h-full object-cover"
                       />
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex items-center justify-center p-8 rounded-md border border-dashed border-border text-muted-foreground text-center">
                  <span>No stories published yet. Start writing!</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center md:justify-end">
            <Card className="w-full max-w-sm p-6 shadow-sm rounded-lg">
              {!isEditing ? (
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.personal_info?.profile_img} alt="User Avatar" />
                    <AvatarFallback className="text-4xl">{user.personal_info?.username ? user.personal_info.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-foreground mb-2">{user.personal_info?.fullname || user.personal_info?.username}</h2>
                  <p className="text-sm text-muted-foreground mb-4">@{user.personal_info?.username}</p>

                  {user.personal_info?.bio && (
                    <p className="text-muted-foreground text-center mb-4">{user.personal_info.bio}</p>
                  )}

                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {user.personal_info?.email && (
                      <a href={`mailto:${user.personal_info.email}`} className="text-muted-foreground hover:text-primary">
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.website && (
                      <a href={user.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.youtube && (
                      <a href={user.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.instagram && (
                      <a href={user.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.facebook && (
                      <a href={user.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.twitter && (
                      <a href={user.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {user.social_links?.github && (
                      <a href={user.social_links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    Edit profile
                  </Button>
                </div>
              ) : (
                <EditProfileForm
                  user={user}
                  onUpdateSuccess={handleProfileUpdateSuccess}
                  onCancel={handleCancelEdit}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;