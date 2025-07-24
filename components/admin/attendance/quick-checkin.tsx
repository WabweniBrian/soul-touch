"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getStaffMembers, quickCheckIn } from "@/lib/actions/admin/attendance";
import { Clock, Search, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";

type StaffMember = {
  isCheckedInToday: boolean;
  lastCheckIn: Date | null;
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: string;
};

export const QuickCheckIn = () => {
  const [modal, setModal] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load staff list when modal opens
  const loadStaffList = async () => {
    try {
      setLoading(true);
      const data = await getStaffMembers();
      setStaffList(data);
      setFilteredStaff(data);
    } catch (error) {
      toast.error("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredStaff(staffList);
    } else {
      const filtered = staffList.filter(
        (staff) =>
          `${staff.firstName} ${staff.middleName || ""} ${staff.lastName}`
            .toLowerCase()
            .includes(term.toLowerCase()) ||
          staff.department.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredStaff(filtered);
    }
  };

  const handleQuickCheckIn = async (staffId: string) => {
    try {
      setCheckingIn(staffId);
      const result = await quickCheckIn({ staffId });

      if (result.success) {
        toast.success("Check-in successful!");
        // Update the staff list to reflect the check-in
        setStaffList((prev) =>
          prev.map((staff) =>
            staff.id === staffId
              ? { ...staff, isCheckedInToday: true, lastCheckIn: new Date() }
              : staff,
          ),
        );
        setFilteredStaff((prev) =>
          prev.map((staff) =>
            staff.id === staffId
              ? { ...staff, isCheckedInToday: true, lastCheckIn: new Date() }
              : staff,
          ),
        );
      } else {
        toast.error(result.message || "Failed to check in");
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    } finally {
      setCheckingIn(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModal(open);
    if (open) {
      loadStaffList();
    } else {
      setSearchTerm("");
      setFilteredStaff([]);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const uncheckedStaff = filteredStaff.filter(
    (staff) => !staff.isCheckedInToday,
  );
  const checkedStaff = filteredStaff.filter((staff) => staff.isCheckedInToday);

  return (
    <Dialog open={modal} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Quick Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Check-in
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quickly check in staff members for today
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search staff by name or department..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <ImSpinner2 className="animate-spin text-2xl" />
          </div>
        ) : (
          <div className="max-h-[60vh] space-y-6 overflow-y-auto">
            {/* Not Checked In Today */}
            {uncheckedStaff.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Not Checked In Today ({uncheckedStaff.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {uncheckedStaff.map((staff) => (
                    <Card
                      key={staff.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {staff.firstName}{" "}
                              {staff.middleName ? staff.middleName + " " : ""}
                              {staff.lastName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {staff.department}
                            </p>
                            <p className="text-xs text-gray-400">
                              Last check-in: {formatTime(staff.lastCheckIn)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleQuickCheckIn(staff.id)}
                            disabled={checkingIn === staff.id}
                            className="ml-2"
                          >
                            {checkingIn === staff.id ? (
                              <ImSpinner2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserCheck className="mr-1 h-4 w-4" />
                                Check In
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Already Checked In Today */}
            {checkedStaff.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Already Checked In Today ({checkedStaff.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {checkedStaff.map((staff) => (
                    <Card
                      key={staff.id}
                      className="bg-green-50 dark:bg-green-900/20"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {staff.firstName}{" "}
                              {staff.middleName ? staff.middleName + " " : ""}
                              {staff.lastName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {staff.department}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Checked in: {formatTime(staff.lastCheckIn)}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-green-100 text-green-800"
                          >
                            Present
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredStaff.length === 0 && !loading && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No staff found matching your search."
                  : "No staff members found."}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
