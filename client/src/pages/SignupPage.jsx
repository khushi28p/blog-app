import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Sparkles, Pencil, Feather, BookOpen } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/redux/authSlice";

const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      toast.success("Signup successful! You are now logged in.");
      navigate("/");
    }
    if (error) {
      toast.error(error);
    }
  }, [isLoggedIn, error, navigate]);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(signupUser(data)).unwrap();
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex relative min-h-screen items-center justify-center bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div
          className="absolute inset-0 animate-[blob-pulse_20s_ease-in-out_infinite_alternate]"
          style={{
            background: `radial-gradient(circle at 15% 15%, var(--color-chart-1) 0%, transparent 50%),
                                     radial-gradient(circle at 85% 25%, var(--color-chart-2) 0%, transparent 50%),
                                     radial-gradient(circle at 30% 75%, var(--color-chart-3) 0%, transparent 50%),
                                     radial-gradient(circle at 70% 80%, var(--color-chart-4) 0%, transparent 50%)`,
            mixBlendMode: "screen",
            opacity: 0.3,
          }}
        ></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="absolute top-[10%] left-[15%] opacity-0 animate-fade-in-float"
          style={{ color: "var(--color-chart-1)" }}
        >
          <Pencil className="w-10 h-10 md:w-14 md:h-14 rotate-12" />
        </div>
        <div
          className="absolute top-[35%] right-[10%] opacity-0 animate-fade-in-float-delay1"
          style={{ color: "var(--color-chart-2)" }}
        >
          <Feather className="w-10 h-10 md:w-14 md:h-14 -rotate-6" />
        </div>
        <div
          className="absolute top-[60%] left-[10%] opacity-0 animate-fade-in-float-delay2"
          style={{ color: "var(--color-chart-3)" }}
        >
          <Sparkles className="w-10 h-10 md:w-14 md:h-14 rotate-45" />
        </div>
        <div
          className="absolute top-[80%] right-[20%] opacity-0 animate-fade-in-float-delay3"
          style={{ color: "var(--color-chart-4)" }}
        >
          <Sparkles className="w-10 h-10 md:w-14 md:h-14 -rotate-12" />
        </div>
        <div
          className="absolute top-[20%] right-[30%] opacity-0 animate-fade-in-float-delay4"
          style={{ color: "var(--color-chart-5)" }}
        >
          <Pencil className="w-8 h-8 md:w-12 md:h-12 rotate-24" />
        </div>
        <div
          className="absolute top-[70%] left-[30%] opacity-0 animate-fade-in-float-delay5"
          style={{ color: "var(--color-chart-1)" }}
        >
          <Feather className="w-8 h-8 md:w-12 md:h-12 -rotate-8" />
        </div>
        <div
          className="absolute top-[45%] left-[20%] opacity-0 animate-fade-in-float-delay6"
          style={{ color: "var(--color-chart-2)" }}
        >
          <BookOpen className="w-8 h-8 md:w-12 md:h-12 rotate-30" />
        </div>
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center w-full p-4">
        <Card
          className="w-full max-w-[420px] bg-card/90 backdrop-blur-sm p-8 shadow-2xl rounded-xl border border-border
                                 transition-all duration-300 hover:shadow-3xl
                                 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]
                                 dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.02),0_20px_25px_-5px_rgba(0,0,0,0.4),0_8px_10px_-6px_rgba(0,0,0,0.4)]"
        >
          <CardHeader className="space-y-3 text-center mb-8">
            <CardTitle
              className="text-5xl font-extrabold text-primary tracking-tighter leading-none
                                            text-shadow-md drop-shadow-lg"
            >
              Join QuillJot
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground font-medium">
              Create your account to ignite your writing journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                          className="py-2.5 px-4 rounded-md border-2 border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
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
                          className="py-2.5 px-4 rounded-md border-2 border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
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
                          className="py-2.5 px-4 rounded-md border-2 border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
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
                          className="py-2.5 px-4 rounded-md border-2 border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full py-3.5 text-xl font-bold shadow-lg hover:shadow-xl transition-shadow duration-300
                                bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
            <div className="mt-8 text-center text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-semibold"
              >
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
