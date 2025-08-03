import React, { useState, useEffect, useRef } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axiosInstance from "@/api/axios";
import { toast } from 'sonner';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react"; 
import { setUserData } from "@/redux/authSlice";

const EditProfileForm = ({ user, onUpdateSuccess, onCancel }) => {
  const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth); 
    const [username, setUsername] = useState(user?.personal_info?.username || "");
    const [fullname, setFullname] = useState(user?.personal_info?.fullname || "");
    const [bio, setBio] = useState(user?.personal_info?.bio || "");

    const [website, setWebsite] = useState(user?.social_links?.website || "");
    const [youtube, setYoutube] = useState(user?.social_links?.youtube || "");
    const [instagram, setInstagram] = useState(user?.social_links?.instagram || "");
    const [facebook, setFacebook] = useState(user?.social_links?.facebook || "");
    const [twitter, setTwitter] = useState(user?.social_links?.twitter || "");
    const [github, setGithub] = useState(user?.social_links?.github || "");

    const [profileImg, setProfileImg] = useState(
        user?.personal_info?.profile_img ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${user?.personal_info?.username || 'User'}` 
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    
    useEffect(() => {
        setUsername(user?.personal_info?.username || "");
        setFullname(user?.personal_info?.fullname || "");
        setBio(user?.personal_info?.bio || "");
        setProfileImg(
            user?.personal_info?.profile_img ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${user?.personal_info?.username || 'User'}`
        );

        setWebsite(user?.social_links?.website || "");
        setYoutube(user?.social_links?.youtube || "");
        setInstagram(user?.social_links?.instagram || "");
        setFacebook(user?.social_links?.facebook || "");
        setTwitter(user?.social_links?.twitter || "");
        setGithub(user?.social_links?.github || "");

        setErrorMessage(""); 
    }, [user]); 
    
    const handleImageUploadClick = () => {
        fileInputRef.current?.click(); 
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage("");

        const formData = new FormData();
        formData.append('image', file); 

        try {
            const response = await axiosInstance.post('/upload-image', formData);
            setProfileImg(response.data.url); 
            toast.success("Profile image uploaded successfully!");
        } catch (error) {
            console.error("Profile image upload failed:", error);
            setErrorMessage(error.response?.data?.message || "Failed to upload image.");
            toast.error(error.response?.data?.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setProfileImg(`https://api.dicebear.com/7.x/initials/svg?seed=${user?.personal_info?.username || 'User'}`);
        toast.info("Profile image removed.");
    };

    const handleSave = async () => {
        setErrorMessage("");
        setIsSaving(true);

        if (!token) {
            setErrorMessage("Authentication token not found. Please log in again.");
            setIsSaving(false);
            return;
        }

        const updateData = {
            personal_info: {
                username,
                fullname,
                bio,
                profile_img: profileImg, 
            },
            social_links: {
                website,
                youtube,
                instagram,
                facebook,
                twitter,
                github,
            },
        };

        try {
            const response = await axiosInstance.put('/user/update-user', updateData); 

            if (response.data.status === "success") {
                toast.success(response.data.message || "Profile updated successfully!");
                 dispatch(setUserData(response.data.user));
                if (onUpdateSuccess) {
                    onUpdateSuccess(); 
                }
            } else {
                setErrorMessage(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                setErrorMessage(
                    error.response.data.message || "An error occurred while updating."
                );
            } else if (error.request) {
                setErrorMessage(
                    "No response from server. Please check your network connection."
                );
            } else {
                setErrorMessage("Error setting up the request: " + error.message);
            }
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-card p-6 rounded-lg shadow-md border border-border text-foreground"> 
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Photo</label>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20 border border-border"> 
                            <AvatarImage src={profileImg} alt="Profile Avatar" />
                            <AvatarFallback className="text-3xl bg-primary text-primary-foreground"> 
                                {fullname?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button
                                variant="outline" 
                                onClick={handleImageUploadClick}
                                disabled={isUploading}
                                className="text-primary hover:bg-primary/10 transition-colors" 
                            >
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Upload"}
                            </Button>
                            <Button
                                variant="outline" 
                                onClick={handleRemoveImage}
                                disabled={isUploading || profileImg === `https://api.dicebear.com/7.x/initials/svg?seed=${user?.personal_info?.username || 'User'}`} 
                                className="text-destructive hover:bg-destructive/10 transition-colors" 
                            >
                                Remove
                            </Button>
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
                        className="w-full bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                        maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                        {fullname.length}/50
                    </p>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">Username</label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                        maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                        {username.length}/50
                    </p>
                </div>

                <div>
                    <label htmlFor="short-bio" className="block text-sm font-medium text-foreground mb-1">Bio</label>
                    <Textarea
                        id="short-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full min-h-[80px] bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary resize-y" 
                        maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                        {bio.length}/200
                    </p>
                </div>

                <div className="pt-4 border-t border-border"> 
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                        Social accounts
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-muted-foreground mb-1">Website</label>
                            <Input
                                id="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://yourwebsite.com"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="youtube" className="block text-sm font-medium text-muted-foreground mb-1">YouTube</label>
                            <Input
                                id="youtube"
                                value={youtube}
                                onChange={(e) => setYoutube(e.target.value)}
                                placeholder="https://youtube.com/yourprofile"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-muted-foreground mb-1">Instagram</label>
                            <Input
                                id="instagram"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="https://instagram.com/yourprofile"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="facebook" className="block text-sm font-medium text-muted-foreground mb-1">Facebook</label>
                            <Input
                                id="facebook"
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                                placeholder="https://facebook.com/yourprofile"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="twitter" className="block text-sm font-medium text-muted-foreground mb-1">Twitter</label>
                            <Input
                                id="twitter"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                placeholder="https://twitter.com/yourprofile"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="github" className="block text-sm font-medium text-muted-foreground mb-1">GitHub</label>
                            <Input
                                id="github"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="https://github.com/yourprofile"
                                type="url"
                                className="bg-input text-foreground border border-input focus:ring-2 focus:ring-ring focus:border-primary" 
                            />
                        </div>
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-destructive text-sm mt-4">{errorMessage}</p> 
                )}
            </div>

            <div className="p-4 border-t border-border flex justify-end space-x-2 mt-6"> 
                <Button variant="outline" onClick={onCancel} disabled={isSaving || isUploading}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                >
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isUploading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default EditProfileForm;