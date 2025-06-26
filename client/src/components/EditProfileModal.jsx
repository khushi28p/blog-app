import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ExternalLink } from "lucide-react"; 
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, onUpdateSuccess }) => {
  const [fullname, setFullname] = useState(user?.fullname);
  const [username, setUsername] = useState(user?.username);
  const [shortBio, setShortBio] = useState(user?.bio);
  const [profileImg, setProfileImg] = useState(user?.profile_img);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFullname(user?.fullname || '');
    setUsername(user?.username || '')
    setShortBio(user?.bio || '');
    setProfileImg(user?.profile_img || "https://placehold.co/100x100/ADD8E6/000000?text=K");
    setErrorMessage('');
  }, [user]);


  if (!isOpen) return null;

  const handleSave = async () => {
    setErrorMessage(''); // Clear previous errors
    setIsSaving(true); // Set saving state

    const token = localStorage.getItem('userToken');
    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      setIsSaving(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // Important for sending JSON body
      }
    };

    // Prepare the data to be sent, aligning with your backend's updateUserDetails
    const updateData = {
      fullname,
      username,
      bio: shortBio,
      profile_img: profileImg, // Assuming profileImg can be updated via a direct URL
    };

    try {
      const response = await axios.put('http://localhost:5000/api/user/update-user', updateData, config); // Use PUT for updates

      if (response.data.status === 'success') {
        // Call the success callback to notify parent (ProfilePage) to re-fetch user data
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        onClose(); // Close modal on success
      } else {
        setErrorMessage(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        setErrorMessage(error.response.data.message || 'An error occurred while updating.');
      } else if (error.request) {
        // Request was made but no response was received
        setErrorMessage('No response from server. Please check your network connection.');
      } else {
        // Something else happened in setting up the request
        setErrorMessage('Error setting up the request: ' + error.message);
      }
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Profile information</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImg} alt="Profile Avatar" />
                <AvatarFallback className="text-3xl">{fullname?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="text-primary hover:bg-primary-foreground hover:underline">Update</Button>
                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 hover:underline">Remove</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name*</label>
            <Input
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full"
              maxLength={50} 
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{fullname.length}/50</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Username*</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              maxLength={50} 
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{username.length}/50</p>
          </div>


          <div>
            <label htmlFor="short-bio" className="block text-sm font-medium text-foreground mb-1">Short bio</label>
            <Textarea
              id="short-bio"
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              className="w-full min-h-[80px]"
              maxLength={160} 
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{shortBio.length}/160</p>
          </div>

          
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground font-medium">About Page</span>
            <a href="#" className="flex items-center text-primary hover:underline">
              Personalize images and more to paint a vivid portrait of yourself than your 'Short bio.'
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
