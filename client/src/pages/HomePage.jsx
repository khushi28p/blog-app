import React from 'react';
import { Button } from "@/components/ui/button"; 
import Navbar from '@/components/Navbar'; 
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Lightbulb, MessageSquare, CloudUpload, Bold, Italic, Underline, Strikethrough, List, Code, Type } from 'lucide-react'; 

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground font-inter">
      <Navbar />

      <div>
        <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center px-4 overflow-hidden rounded-b-lg shadow-lg text-center 
                            bg-background text-foreground">
          
          <div className="absolute inset-0 z-0 opacity-80 bg-grid-pattern">
              <div className="absolute inset-0 bg-background/50"></div>
          </div>

          <div className="absolute inset-0 z-10">
            <div className="absolute top-[10%] left-[10%] opacity-0 animate-fade-in-float" style={{ color: 'var(--color-chart-1)' }}><Bold className="w-12 h-12 md:w-16 md:h-16 rotate-12" /></div>
            <div className="absolute top-[30%] right-[5%] opacity-0 animate-fade-in-float-delay1" style={{ color: 'var(--color-chart-2)' }}><Italic className="w-12 h-12 md:w-16 md:h-16 -rotate-6" /></div>
            <div className="absolute top-[50%] left-[5%] opacity-0 animate-fade-in-float-delay2" style={{ color: 'var(--color-chart-3)' }}><Underline className="w-12 h-12 md:w-16 md:h-16 rotate-45" /></div>
            <div className="absolute top-[70%] right-[15%] opacity-0 animate-fade-in-float-delay3" style={{ color: 'var(--color-chart-4)' }}><Strikethrough className="w-12 h-12 md:w-16 md:h-16 -rotate-12" /></div>
            <div className="absolute top-[85%] left-[20%] opacity-0 animate-fade-in-float-delay4" style={{ color: 'var(--color-chart-5)' }}><List className="w-12 h-12 md:w-16 md:h-16 rotate-24" /></div>
            <div className="absolute top-[15%] right-[25%] opacity-0 animate-fade-in-float-delay5" style={{ color: 'var(--color-chart-1)' }}><Code className="w-12 h-12 md:w-16 md:h-16 -rotate-8" /></div>
            <div className="absolute top-[40%] left-[25%] opacity-0 animate-fade-in-float-delay6" style={{ color: 'var(--color-chart-2)' }}><Type className="w-12 h-12 md:w-16 md:h-16 rotate-30" /></div>
          </div>


          <div className="z-20 max-w-4xl text-foreground">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-lg">
              QuillJot: Where Your Ideas Take Flight.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 drop-shadow-md">
              Go beyond just writing. Craft compelling stories, engage with a vibrant community, and amplify your unique voice with an intuitive, powerful, and free platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="px-8 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-2 
                           bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="w-5 h-5"/>
                Start Writing Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="px-8 py-3 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary/10 transition-colors duration-300 flex items-center gap-2"
              >
                <Compass className="w-5 h-5"/>
                Explore Blogs
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">Why QuillJot Stands Out?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"> 
              <div className="p-3 bg-primary/10 rounded-full mb-4"> 
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Intuitive Editor Experience</h3>
              <p className="text-muted-foreground"> 
                Craft stunning content effortlessly with our rich-text editor, packed with all the tools you need without the clutter. Focus on your words, we handle the rest.
              </p>
            </div>  
            
            <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Connect, Comment, & Grow</h3>
              <p className="text-muted-foreground">
                Engage directly with your readers through dynamic comments and likes. Build a loyal community around your passions and receive valuable feedback.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <CloudUpload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Amplify Your Voice, Effortlessly</h3>
              <p className="text-muted-foreground">
                Publish your articles instantly and reach a wider audience. Our platform is designed to make your content discoverable and your impact significant.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Inspiring Reads, Diverse Perspectives</h3>
              <p className="text-muted-foreground">
                Dive into a curated collection of blogs from various authors and topics. Discover new ideas, learn from experts, and expand your horizons.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-16 md:py-24 px-4 text-center rounded-t-lg shadow-inner"> 
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Ready to Transform Your Writing Journey?</h2> 
            <p className="text-lg md:text-xl text-muted-foreground mb-8"> 
              Join thousands of creators who are already sharing their stories and connecting with readers worldwide on QuillJot.
            </p>
            <Button size="lg" onClick={() => navigate('/signup')} className="px-10 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-shadow duration-300">
              Join QuillJot for Free
            </Button>
          </div>
        </section>

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
      </div>
    </div>
  );
};

export default HomePage;