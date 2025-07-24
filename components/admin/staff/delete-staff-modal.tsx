"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useTransition } from "react";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { deleteStaff } from "@/lib/actions/admin/staff";

interface DeleteStaffProps {
  deleteModal: boolean;
  setDeleteModal: (open: boolean) => void;
  currentId: string;
}
const DeleteStaff = ({
  deleteModal,
  setDeleteModal,
  currentId,
}: DeleteStaffProps) => {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteStaff(currentId);
      if (result.success) {
        toast.success("Staff deleted!");
        setDeleteModal(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            Are you sure you want to delete this staff member? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel onClick={() => setDeleteModal(false)} autoFocus>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-x-2">
                <ImSpinner2 className="animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Confirm"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStaff;
