"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAttendance } from "@/lib/actions/admin/attendance";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";

interface DeleteAttendanceModalProps {
  attendanceId: string;
  staffName: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const DeleteAttendanceModal = ({
  attendanceId,
  staffName,
  onOpenChange,
  open,
}: DeleteAttendanceModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteAttendance(attendanceId);

      if (result.success) {
        toast.success("Attendance record deleted successfully!");
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to delete attendance record");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Attendance Record
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the attendance record for{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {staffName}
          </span>
          ? This action cannot be undone.
        </DialogDescription>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <ImSpinner2 className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete Record"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAttendanceModal;
