"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateStaff } from "@/lib/actions/admin/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staffUpdateSchema } from "@/validation/schemas";
import { StaffUpdateSchemaType } from "@/types";

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

type Staff = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: string;
  phone: string | null;
  user: {
    name: string;
    email: string;
  } | null;
};

interface EditStaffProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  staff: Staff;
}

const EditStaff = ({ editModal, setEditModal, staff }: EditStaffProps) => {
  const form = useForm<StaffUpdateSchemaType>({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      firstName: staff.firstName,
      middleName: staff.middleName || "",
      lastName: staff.lastName,
      department: staff.department,
      phone: staff.phone || "",
      name: staff.user?.name || "",
      email: staff.user?.email || "",
    },
  });

  const onReset = () => {
    setEditModal(false);
  };

  const onSubmit = async (values: StaffUpdateSchemaType) => {
    const results = await updateStaff(staff.id, {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      department: values.department,
      phone: values.phone,
      user: {
        name: values.name,
        email: values.email,
      },
    });
    if (results.success) {
      toast.success("Staff updated!");
      onReset();
    } else {
      toast.error("something went wrong, try again");
    }
  };

  return (
    <Dialog open={editModal} onOpenChange={() => setEditModal(!editModal)}>
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
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full rounded-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="gap-x-2 flex-center-center">
                    <ImSpinner2 className="animate-spin text-lg" />
                    <span>Saving...</span>
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

export default EditStaff;
