"use client";

import RowActions from "@/components/common/row-actions";
import { Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiLogOut, FiTrash } from "react-icons/fi";
import AttendanceHistoryModal from "./attendance-history-modal";
import { AttendanceRecord } from "./attendance-table";
import CheckoutModal from "./checkout-modal";
import DeleteAttendanceModal from "./delete-attendance-modal";
import EditAttendanceModal from "./edit-attendance-modal";
import { SessionUser } from "@/types";

interface AttendanceActionsProps {
  attendance: AttendanceRecord;
  user: SessionUser;
}

const AttendanceActions = ({ attendance, user }: AttendanceActionsProps) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  const canCheckOut = !attendance.checkOut && attendance.status !== "Absent";

  const onEdit = () => {
    if (attendance.checkOut) {
      toast.error("Cannot edit checked out attendance");
      return;
    }
    setEditModal(true);
  };

  const onDelete = () => {
    setDeleteModal(true);
  };

  const onCheckOut = () => {
    if (!canCheckOut) {
      toast.error("Staff member has already checked out or is marked absent");
      return;
    }
    setCheckOutModal(true);
  };

  // const onViewHistory = () => {
  //   setHistoryModal(true);
  // };

  const actions = [
    {
      icon: <FiEdit />,
      text: "Edit",
      onclick: onEdit,
    },
    // {
    //   icon: <Eye className="h-4 w-4" />,
    //   text: "View History",
    //   onclick: onViewHistory,
    // },
    ...(canCheckOut
      ? [
          {
            icon: <FiLogOut />,
            text: "Check Out",
            onclick: onCheckOut,
          },
        ]
      : []),
  ];
  if (user?.role === "Admin") {
    actions.push({
      icon: <FiTrash />,
      text: "Delete",
      onclick: onDelete,
    });
  }

  return (
    <div>
      <RowActions actions={actions} />

      {editModal && (
        <EditAttendanceModal
          attendance={attendance}
          onOpenChange={setEditModal}
          open={editModal}
        />
      )}

      {deleteModal && (
        <DeleteAttendanceModal
          attendanceId={attendance.id}
          staffName={`${attendance.staff.firstName} ${attendance.staff.lastName}`}
          onOpenChange={setDeleteModal}
          open={deleteModal}
        />
      )}

      {checkOutModal && (
        <CheckoutModal
          attendanceId={attendance.id}
          staffName={`${attendance.staff.firstName} ${attendance.staff.lastName}`}
          onOpenChange={setCheckOutModal}
          open={checkOutModal}
        />
      )}

      {historyModal && (
        <AttendanceHistoryModal
          staffId={attendance.staff.id}
          staffName={`${attendance.staff.firstName} ${attendance.staff.lastName}`}
          onOpenChange={setHistoryModal}
          open={historyModal}
        />
      )}
    </div>
  );
};

export default AttendanceActions;
