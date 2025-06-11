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

import { SquarePen, Bell, CircleUser, Search } from "lucide-react";

const Navbar = () => {
  const isAuthenticated = false;
  const userName = "Jane Doe";
  const userEmail = "jane.doe@example.com";

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

          {isAuthenticated && (
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
          {isAuthenticated ? (
            <>
              {/* Write Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
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
                        src="https://github.com/shadcn.png"
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
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-6"> 
            <a href="/about-us" className="text-foreground text-sm font-medium hidden md:inline-block">About Us</a>
                          <a href="/write" className="text-foreground text-sm font-medium hidden md:inline-block">Write</a>
              <a href="/membership" className="text-foreground text-sm font-medium hidden md:inline-block">Membership</a>

              <Button variant="ghost" className="hidden sm:inline-flex font-semibold">
                Sign In
              </Button>
              <Button className="hidden sm:inline-flex">Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
