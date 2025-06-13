import React from 'react';
import { Button } from "@/components/ui/button"; 
import Navbar from '@/components/Navbar'; 
import { useSelector } from 'react-redux';

const HomePage = () => {
  const {isLoggedIn} = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground font-inter">
      
      <Navbar />
      {/* Hero Section */}
      {isLoggedIn ? (
        <div>
        <h1 className='text-5xl'>Dashboard</h1>
      </div>
      ) :(
        <div>
      <section className="relative w-full py-20 md:py-32 lg:py-48 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-end px-4 overflow-hidden rounded-b-lg shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src="/blog.jpg" 
            alt="Illustration depicting a desktop setup with a blog post, magnifying glass, and creative tools"
            className="absolute top-0 left-0 w-full h-full object-cover" 
          />
        </div>

        <div className="z-10 max-w-3xl ml-auto mr-0 md:mr-10 lg:mr-20 text-right">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Unleash Your Voice. Share Your Story.
          </h1>
          <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl ml-auto">
            QuillJot is your effortless platform for creating, sharing, and connecting through compelling blogs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
              Start Writing Now
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-colors duration-300">
              Explore Blogs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-24 container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Choose QuillJot?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 2 2L7 19l-4 1 1-4Z"/><path d="m15 5 4 4"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Effortless Creation</h3>
            <p className="text-muted-foreground">
              Write and publish your thoughts with an intuitive and powerful editor.
            </p>
          </div>  
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0 9.22 13.16L12 22 2.78 15.16A10 10 0 0 0 12 2Z"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect & Engage</h3>
            <p className="text-muted-foreground">
              Interact with readers, get feedback, and build your community.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Amplify Your Content</h3>
            <p className="text-muted-foreground">
              Reach a wider audience and make your voice heard across various topics.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary/5 py-16 md:py-24 px-4 text-center rounded-t-lg shadow-inner">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join the QuillJot community today and begin sharing your unique perspective with the world.
          </p>
          <Button size="lg" className="px-10 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-shadow duration-300">
            Sign Up for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground py-8 px-4 text-center border-t border-border">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} QuillJot. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4 text-xs">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-foreground transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
      </div>)}
    </div>
  );
};

export default HomePage;