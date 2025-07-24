"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useState } from "react";
import { toggleStaffStatus } from "@/lib/actions/admin/staff";

interface ToggleStaffStatusModalProps {
  toggleStatusModal: boolean;
  setToggleStatusModal: (open: boolean) => void;
  staff: {
    id: string;
    isActive: boolean;
  };
}

const ToggleStaffStatusModal = ({
  toggleStatusModal,
  setToggleStatusModal,
  staff,
}: ToggleStaffStatusModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStaffStatus = async () => {
    setIsLoading(true);
    const results = await toggleStaffStatus(staff.id);
    setIsLoading(false);
    if (results.success) {
      toast.success(
        `The staff member has been ${staff.isActive ? "deactivated" : "activated"}.`,
      );
      setToggleStatusModal(false);
    } else {
      toast.error("Failed to update staff status.");
    }
  };

  return (
    <Dialog open={toggleStatusModal} onOpenChange={setToggleStatusModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {staff.isActive ? "Deactivate" : "Activate"} Staff
          </DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to {staff.isActive ? "deactivate" : "activate"}{" "}
          this staff member?
        </p>
        {staff.isActive && (
          <p className="text-red-500">
            Staff whose accounts are deactivated will not be able to log in or
            access their dashboard.
          </p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setToggleStatusModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={staff.isActive ? "destructive" : "default"}
            onClick={handleToggleStaffStatus}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : staff.isActive
                ? "Deactivate Staff"
                : "Activate Staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleStaffStatusModal;
