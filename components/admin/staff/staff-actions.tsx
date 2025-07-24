"use client";

import RowActions from "@/components/common/row-actions";
import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  getStaff,
  getStaffById,
  getStaffFormData,
} from "@/lib/actions/admin/staff";
import { Eye, UserRoundCog, ShieldCheck, ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import StaffDetailsModal from "./staff-details-modal";
import DeleteStaff from "./delete-staff-modal";
import EditStaff from "./edit-staff-modal";
import { Attendance, Staff, UserRole } from "@prisma/client";
import { getUser } from "@/lib/actions/admin/users";
import ToggleStaffStatusModal from "./toggle-staff-status";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

type StaffForm = {
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

type TStaff = Staff & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    isActive: boolean;
    role: UserRole;
  } | null;
  attendances: Attendance[];
};

const StaffActions = ({ id, isActive }: { id: string; isActive: boolean }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [toggleStatusModal, setToggleStatusModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [staff, setStaff] = useState<TStaff | null>(null);
  const [editStaff, setEditStaff] = useState<StaffForm | null>(null);

  const confirmDelete = async () => {
    setDeleteModal(true);
  };

  const onEdit = async () => {
    setEditStaff(await getStaffFormData(id));
    setEditModal(true);
  };

  const onViewStaff = async () => {
    setStaff(await getStaffById(id));
    setViewModal(true);
  };

  const onToggleStaffStatus = async () => {
    setToggleStatusModal(true);
  };

  return (
    <div>
      <RowActions
        actions={[
          {
            icon: <FiEdit />,
            text: "Edit",
            onclick: () => onEdit(),
          },
          {
            icon: <Eye className="h-4 w-4" />,
            text: "View Staff",
            onclick: () => onViewStaff(),
          },

          //   {
          //     icon: isActive ? (
          //       <ShieldX className="h-4 w-4" />
          //     ) : (
          //       <ShieldCheck className="h-4 w-4" />
          //     ),
          //     text: isActive ? "Deactivate Staff" : "Activate Staff",
          //     onclick: () => onToggleStaffStatus(),
          //   },
          {
            icon: <FiTrash />,
            text: "Delete",
            onclick: () => confirmDelete(),
          },
        ]}
      />
      <DeleteStaff
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        currentId={id}
      />
      {editModal && editStaff && (
        <EditStaff
          editModal={editModal}
          setEditModal={setEditModal}
          staff={editStaff}
        />
      )}
      {viewModal && staff && (
        <StaffDetailsModal
          staff={staff}
          onOpenChange={setViewModal}
          open={viewModal}
        />
      )}
      {toggleStatusModal && staff && (
        <ToggleStaffStatusModal
          toggleStatusModal={toggleStatusModal}
          setToggleStatusModal={setToggleStatusModal}
          staff={{
            id: staff.id,
            isActive: staff.user?.isActive || false,
          }}
        />
      )}
    </div>
  );
};

export default StaffActions;
