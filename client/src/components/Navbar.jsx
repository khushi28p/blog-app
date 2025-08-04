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

import { Bell, Search, PenLine } from "lucide-react";
import { useSelector } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border py-3 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-12 xl:px-20 gap-4">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-extrabold text-primary transition-colors group-hover:text-primary/90">
              QuillJot
            </span>
          </Link>
        </div>

        {isLoggedIn && (
          <div className="flex-grow flex justify-center mx-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-9 pr-3 py-2 bg-input/80 border border-border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 sm:space-x-5 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground transition-colors duration-200"
                onClick={() => navigate("/editor")}
              >
                <PenLine className="h-5 w-5" />
                <span className="sr-only">Write a new blog</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground transition-colors duration-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="sr-only">View notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={
                          user.personal_info?.profile_img ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${
                            user.personal_info?.username || "User"
                          }`
                        }
                        alt="User Avatar"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username
                          ? user.personal_info.username.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.personal_info?.username || "Guest"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.personal_info?.email || "N/A"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-accent/20"
                    onSelect={() => navigate("/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-accent/20"
                    onSelect={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link
                to="/about-us"
                className="text-muted-foreground text-sm font-medium hidden md:inline-block hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                to={isLoggedIn ? "/editor" : "/login"}
                className="text-muted-foreground text-sm font-medium hidden md:inline-block hover:text-foreground transition-colors"
              >
                Write
              </Link>
              <Link
                to="/membership"
                className="text-muted-foreground text-sm font-medium hidden md:inline-block hover:text-foreground transition-colors"
              >
                Membership
              </Link>

              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="hidden sm:inline-flex font-semibold text-primary hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="hidden sm:inline-flex px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
