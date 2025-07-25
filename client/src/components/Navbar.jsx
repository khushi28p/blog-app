import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { SquarePen, Bell, CircleUser, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {isLoggedIn, user} = useSelector((state) => state.auth);

  const handleLogout = () => {
    try{
    dispatch(logout());
    navigate("/");
    toast("Logged out successfully");
    } catch(error){
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="bg-background border-b border-border py-4 px-20 shadow-sm">
      <div className="container mx-auto flex justify-between items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4 flex-grow">
          {/* Logo/Brand Name */}
          <a href="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-xl font-bold text-foreground">
              QuillJot
            </span>
          </a>

          {isLoggedIn && (
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-9 pr-3 py-2 rounded-md"
              />
            </div>
          )}
        </div>

      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {isLoggedIn ? (
            <>
              {/* Write Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/editor")}
              >
                <SquarePen className="h-6 w-6" />
                <span className="sr-only">Write a new blog</span>
              </Button>

              {/* Notification Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="sr-only">View notifications</span>
              </Button>

              {/* User Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage
                        src={user?.profile_img}
                        alt="User Avatar"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link to={'/profile'}>Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-6"> 
            <a href="/about-us" className="text-foreground text-sm font-medium hidden md:inline-block">About Us</a>
                          <a onClick={() => {
              isLoggedIn ? navigate("/editor") : navigate("/login");
            }} className="text-foreground text-sm font-medium hidden md:inline-block">Write</a>
              <a href="/membership" className="text-foreground text-sm font-medium hidden md:inline-block">Membership</a>

              <Button onClick={() => navigate("/login")} variant="ghost" className="hidden sm:inline-flex font-semibold">
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")} className="hidden sm:inline-flex">Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
