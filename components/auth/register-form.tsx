"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRegistrationSchemaType } from "@/types";
import { userRegistrationSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";

const SignUpForm = () => {
  const departmentOptions = [
    "Science",
    "Mathematics",
    "English",
    "Social Studies",
    "Arts",
    "ICT",
    "Physical Education",
    "Other",
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const message = "You can now proceed to login";

  const form = useForm<UserRegistrationSchemaType>({
    resolver: zodResolver(userRegistrationSchema),
  });

  const router = useRouter();

  const onSubmit = async (values: UserRegistrationSchemaType) => {
    setError("");
    try {
      await axios.post("/api/auth/register", {
        ...values,
      });
      router.push(`/login?message=${message}`);
      toast.success("Registration successful! You can now log in.");
    } catch (error: any) {
      setError(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="my-3">
        <h1 className="text-xl font-bold md:text-2xl">Create an account</h1>
        <p>Fill in the details below to create your account.</p>
      </div>
      {error && (
        <div>
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Username"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name/Surname</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="First Name"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Middle Name (optional)"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name/Given Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Last Name"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <SelectTrigger className="w-full bg-transparent">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone (optional)"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
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
                    {...field}
                    placeholder="Email Address"
                    className="bg-transparent"
                    disabled={form.formState.isSubmitting}
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
                  <div className="relative">
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-slate-600 dark:text-slate-200" />
                      )}
                    </div>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="bg-transparent"
                      disabled={form.formState.isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="!mt-5 w-full rounded-lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="gap-x-2 flex-center-center">
                <ImSpinner2 className="animate-spin text-lg" />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <span className="text-sm">Already have an account? </span>
        <Link href="/login" className="text-sm text-brand hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
