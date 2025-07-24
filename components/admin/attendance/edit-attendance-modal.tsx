"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateAttendance } from "@/lib/actions/admin/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";

const editAttendanceSchema = z.object({
  status: z.enum(["Present", "Late", "Absent"]),
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
});

type EditAttendanceType = z.infer<typeof editAttendanceSchema>;

interface AttendanceRecord {
  id: string;
  status: AttendanceStatus;
  checkIn: Date;
  checkOut: Date | null;
  notes: string | null;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
  };
}

interface EditAttendanceModalProps {
  attendance: AttendanceRecord;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const EditAttendanceModal = ({
  attendance,
  onOpenChange,
  open,
}: EditAttendanceModalProps) => {
  console.log("Open state:", open);
  const form = useForm<EditAttendanceType>({
    resolver: zodResolver(editAttendanceSchema),
    defaultValues: {
      status: attendance.status,
      checkIn: new Date(attendance.checkIn).toTimeString().slice(0, 5),
      checkOut: attendance.checkOut
        ? new Date(attendance.checkOut).toTimeString().slice(0, 5)
        : "",
      notes: attendance.notes || "",
    },
  });

  const onReset = () => {
    onOpenChange(false);
    form.reset();
  };

  const onSubmit = async (values: EditAttendanceType) => {
    try {
      const attendanceDate = new Date(attendance.checkIn);
      const checkInDateTime = new Date(
        `${attendanceDate.toDateString()} ${values.checkIn}`,
      );
      let checkOutDateTime = null;

      if (values.checkOut) {
        checkOutDateTime = new Date(
          `${attendanceDate.toDateString()} ${values.checkOut}`,
        );
      }

      const result = await updateAttendance({
        id: attendance.id,
        status: values.status as AttendanceStatus,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
        notes: values.notes || null,
      });

      if (result.success) {
        toast.success("Attendance updated successfully!");
        onReset();
      } else {
        toast.error(result.message || "Failed to update attendance");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update attendance for {attendance.staff.firstName}{" "}
            {attendance.staff.lastName}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Staff: {attendance.staff.firstName} {attendance.staff.lastName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Department: {attendance.staff.department}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date: {new Date(attendance.checkIn).toDateString()}
              </p>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full bg-transparent">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Time</FormLabel>
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

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time (Optional)</FormLabel>
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes..."
                      className="resize-none bg-transparent"
                      rows={3}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={form.formState.isSubmitting}
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
                    Updating...
                  </div>
                ) : (
                  "Update Attendance"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendanceModal;
