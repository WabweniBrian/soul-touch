"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchemaType } from "@/types";
import { forgotPasswordSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: values.email,
      });
      setSuccessMessage(response.data);
      setError(null);
    } catch (error: any) {
      setError(error.response.data);
    }
  };

  if (successMessage) {
    return (
      <Alert className="border-brand-indigo-200 bg-brand-indigo-50 dark:border-brand-indigo-900 dark:bg-brand-indigo-900/20">
        <Mail className="text-brand-indigo-600 dark:text-brand-indigo-400 h-4 w-4" />
        <AlertTitle className="text-brand-indigo-800 dark:text-brand-indigo-300">
          Check your email
        </AlertTitle>
        <AlertDescription className="text-brand-indigo-700 dark:text-brand-indigo-200">
          We&apos;ve sent a password reset link to your{" "}
          {form.getValues("email") || ""}. Please check your inbox and follow
          the instructions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>
      <p className="mb-4">
        Enter your registered email address and we send you a link which you can
        use to reset your password.
      </p>
      {error && (
        <div className="my-2">
          <span className="text-red-500">{error}</span>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

          <Button
            type="submit"
            className="!mt-5 w-full rounded-lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="gap-x-2 flex-center-center">
                <ImSpinner2 className="animate-spin text-lg" />
                <span>Processing...</span>
              </div>
            ) : (
              "Send Link"
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-brand hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
