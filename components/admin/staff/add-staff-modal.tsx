"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addStaff } from "@/lib/actions/admin/staff";
import { staffSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { EyeIcon, EyeOff } from "lucide-react";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffSchemaType } from "@/types";

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

const AddStaff = () => {
  const [addModal, setAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<StaffSchemaType>({
    resolver: zodResolver(staffSchema),
  });

  const onReset = () => {
    setAddModal(false);
    form.reset({
      firstName: "",
      middleName: "",
      lastName: "",
      department: "",
      phone: "",
      password: "",
      email: "",
      name: "",
    });
  };

  const onSubmit = async (values: StaffSchemaType) => {
    const results = await addStaff({
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      department: values.department,
      phone: values.phone,
      user: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    });
    if (results.success) {
      toast.success("Staff added!");
      onReset();
    } else {
      toast.error("something went wrong, try again");
    }
  };

  return (
    <Dialog open={addModal} onOpenChange={setAddModal}>
      <DialogTrigger asChild>
        <Button>+ Add Staff</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full rounded-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="gap-x-2 flex-center-center">
                    <ImSpinner2 className="animate-spin text-lg" />
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaff;
