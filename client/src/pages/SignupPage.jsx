import React from 'react';
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

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
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

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    console.log('Signup data:', data);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        personal_info: {fullname: data.fullName,
        email: data.email,
        password: data.password}
      })

      toast.success(response.data.message || 'Signup successful!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-card to-background text-foreground">
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
                name="fullName"
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
  );
};

export default SignupPage;