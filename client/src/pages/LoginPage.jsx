import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { loginUser } from '@/redux/authSlice';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: z.boolean().default(false).optional(),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isLoggedIn){
      toast.success("Login successful!");
      navigate('/');
    }
    if(error){
      toast.error(error);
    }
  }, [isLoggedIn, error, navigate]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-card to-background text-foreground">
      <Card className="w-[380px] bg-card p-6 shadow-lg rounded-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                        className="h-4 w-4 rounded-sm border-primary text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-2.5 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
