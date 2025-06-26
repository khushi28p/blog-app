import React, {useEffect, useState} from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom"; 
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import EditProfileModal from '@/components/EditProfileModal';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('userToken');
  const config = {headers: {Authorization : `Bearer ${token}`}};

  const handleProfileUpdateSuccess = () => {
    fetchUserDetails(); 
    setIsModalOpen(false); 
  };
  
  const fetchUserDetails = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', config);
            setUser(response.data); 
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

  useEffect(() => {
    if (token) {
        fetchUserDetails();
    } else {
        console.log("No user token found. Redirecting or showing public profile.");
        navigate('/login');
    }
  }, [token]); 


  const handleEditProfileClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <Navbar/> 
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

            <Card className="w-full shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Reading list</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 rounded-md border border-dashed border-border text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.personal_info?.profile_img} alt="User Avatar" />
                    <AvatarFallback>{user.personal_info?.username ? user.personal_info.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <span>No stories</span>
                  <span className="ml-auto text-lg">...</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-muted-foreground text-center">
              <p>Your published stories will appear here.</p>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center md:justify-end">
            <Card className="w-full max-w-sm p-6 shadow-sm rounded-lg">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.personal_info?.profile_img} alt="User Avatar" />
                  <AvatarFallback className="text-4xl">{user.personal_info?.username ? user.personal_info.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground mb-2">{user.personal_info?.username}</h2>
                <a
                  href="#edit-profile"
                  onClick={handleEditProfileClick}
                  className="text-primary text-sm hover:underline mb-4 cursor-pointer"
                >
                  Edit profile
                </a>
              </div>
              
            </Card>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user.personal_info} 
        onUpdateSuccess={handleProfileUpdateSuccess}
      />
    </div>
  );
};

export default ProfilePage;
