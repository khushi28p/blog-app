import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

import { useDispatch, useSelector } from 'react-redux'; 
import { signupUser } from '@/redux/authSlice';

const signupSchema = z.object({
  fullname: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character.' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], 
});

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      toast.success('Signup successful! You are now logged in.');
      navigate('/'); 
    }
    if (error) {
      toast.error(error);
    }
  }, [isLoggedIn, error, navigate]);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(signupUser(data)).unwrap();
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex relative min-h-screen items-center justify-center bg-gradient-to-br from-background via-card to-background text-foreground">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-800 to-blue-900 opacity-90">
        {/* Optional: Add a subtle pattern or texture to the background */}
        <div className="absolute inset-0 bg-[url('https://placehold.co/100x100/000000/FFFFFF/png?text=')] opacity-10" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)' }}></div>

        <div className="absolute inset-0">
          <div className="absolute w-28 h-28 bg-white/35 rounded-lg left-1/5 transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute w-48 h-48 bg-gray-900/35 rounded-xl top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-64 h-64 bg-black/50 rounded-xl bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute w-48 h-32 bg-gray-400/50 rounded-lg top-1/2 left-3/4 transform -translate-x -translate-y-1/2"></div>
          <div className="absolute w-40 h-20 bg-white/10 rounded top-1/5 right-1/5 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center w-full">
      <Card className="w-[380px] bg-card p-6 shadow-lg rounded-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Join QuillJot</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to start sharing your stories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        className="py-2 px-3 rounded-md border border-input focus:ring-primary focus:border-primary transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@example.com"
                        {...field}
                        className="py-2 px-3 rounded-md border border-input focus:ring-primary focus:border-primary transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="py-2 px-3 rounded-md border border-input focus:ring-primary focus:border-primary transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="py-2 px-3 rounded-md border border-input focus:ring-primary focus:border-primary transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-2.5 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default SignupPage;