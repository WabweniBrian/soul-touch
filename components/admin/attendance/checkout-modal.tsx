"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { checkAttendanceCheckOut } from "@/lib/actions/admin/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";

const checkoutSchema = z.object({
  checkOut: z.string().min(1, "Check-out time is required"),
  notes: z.string().optional(),
});

type CheckoutType = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  attendanceId: string;
  staffName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutModal = ({
  open,
  attendanceId,
  staffName,
  onOpenChange,
}: CheckoutModalProps) => {
  const form = useForm<CheckoutType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      checkOut: new Date().toTimeString().slice(0, 5),
      notes: "",
    },
  });

  console.log("Open state", open);

  const onReset = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: CheckoutType) => {
    try {
      const today = new Date();
      const checkOutDateTime = new Date(
        `${today.toDateString()} ${values.checkOut}`,
      );

      const result = await checkAttendanceCheckOut({
        id: attendanceId,
        checkOut: checkOutDateTime,
      });

      if (result.success) {
        toast.success("Staff member checked out successfully!");
        onReset();
      } else {
        toast.error(result.message || "Failed to check out staff member");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        console.log("onOpenChange called with:", newOpen);
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <LogOut className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Check Out Staff
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Record check-out time for {staffName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Staff: {staffName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date().toDateString()}
              </p>
            </div>

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className="block bg-transparent"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes about the checkout..."
                      className="resize-none bg-transparent"
                      rows={3}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <ImSpinner2 className="animate-spin" />
                    Checking Out...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Check Out
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
