import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from 'axios';
import { BACKEND_URL } from '@/config'; 

const EditProfileForm = ({ user, onUpdateSuccess, onCancel }) => {
  const [username, setUsername] = useState(user?.personal_info?.username || '');
  const [fullname, setFullname] = useState(user?.personal_info?.fullname || '');
  const [bio, setBio] = useState(user?.personal_info?.bio || '');

  const [website, setWebsite] = useState(user?.social_links?.website || '');
  const [youtube, setYoutube] = useState(user?.social_links?.youtube || '');
  const [instagram, setInstagram] = useState(user?.social_links?.instagram || '');
  const [facebook, setFacebook] = useState(user?.social_links?.facebook || '');
  const [twitter, setTwitter] = useState(user?.social_links?.twitter || '');
  const [github, setGithub] = useState(user?.social_links?.github || '');

  const [profileImg, setProfileImg] = useState(user?.personal_info?.profile_img || "https://placehold.co/100x100/ADD8E6/000000?text=U"); // Default placeholder
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUsername(user?.personal_info?.username || '')
    setFullname(user?.personal_info?.fullname || '');
    setBio(user?.personal_info?.bio || '');
    setProfileImg(user?.personal_info?.profile_img || "https://placehold.co/100x100/ADD8E6/000000?text=U");
    
    setWebsite(user?.social_links?.website || '');
    setYoutube(user?.social_links?.youtube || '');
    setInstagram(user?.social_links?.instagram || '');
    setFacebook(user?.social_links?.facebook || '');
    setTwitter(user?.social_links?.twitter || '');
    setGithub(user?.social_links?.github || '');

    setErrorMessage('');
  }, [user]);

  const handleSave = async () => {
    setErrorMessage('');
    setIsSaving(true);

    const token = localStorage.getItem('userToken');
    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      setIsSaving(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const updateData = {
      username,
      fullname,
      bio,
      profile_img: profileImg,
      social_links: {
        website,
        youtube,
        instagram,
        facebook,
        twitter,
        github
      }
    };

    try {
        const response = await axios.put(`${BACKEND_URL}/api/user/update-user`, {
            personal_info: {
              username: updateData.username,
                fullname: updateData.fullname,
                bio: updateData.bio,
                profile_img: updateData.profile_img,
            },
            social_links: updateData.social_links
        }, config);

      if (response.data.status === 'success') {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        setErrorMessage(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An error occurred while updating.');
      } else if (error.request) {
        setErrorMessage('No response from server. Please check your network connection.');
      } else {
        setErrorMessage('Error setting up the request: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full"> 
      <h2 className="text-xl font-semibold text-foreground mb-4">Edit Profile</h2> 
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileImg} alt="Profile Avatar" />
              <AvatarFallback className="text-3xl">{fullname?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="text-primary hover:bg-black-500/30 hover:underline">Update</Button>
              <Button variant="ghost" className="text-red-500 hover:bg-red-500/30 hover:underline">Remove</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
          </p>
        </div>

        
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-foreground mb-1">Name</label>
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
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">Username</label>
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
          <label htmlFor="short-bio" className="block text-sm font-medium text-foreground mb-1">Bio</label>
          <Textarea
            id="short-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full min-h-[80px]"
            maxLength={200} 
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{bio.length}/200</p>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-3">Social accounts</h3>
          <div className="space-y-4">
            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                type="url"
              />
            </div>
            {/* YouTube */}
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium text-muted-foreground mb-1">YouTube</label>
              <Input
                id="youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/yourchannel"
                type="url"
              />
            </div>
            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-muted-foreground mb-1">Instagram</label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                type="url"
              />
            </div>
            {/* Facebook */}
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-muted-foreground mb-1">Facebook</label>
              <Input
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/yourprofile"
                type="url"
              />
            </div>
            {/* Twitter */}
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-muted-foreground mb-1">Twitter</label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/yourprofile"
                type="url"
              />
            </div>
            {/* Github */}
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-muted-foreground mb-1">GitHub</label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/yourprofile"
                type="url"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

      </div>

      <div className="p-4 border-t border-border flex justify-end space-x-2 mt-6"> {/* Added mt-6 for spacing */}
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfileForm;