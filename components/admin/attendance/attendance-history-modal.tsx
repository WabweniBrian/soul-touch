/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAttendance } from "@/lib/actions/admin/attendance";
import { AttendanceStatus } from "@prisma/client";
import { Calendar, Clock, FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";

interface AttendanceRecord {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  status: AttendanceStatus;
  notes: string | null;
  createdAt: Date;
}

interface AttendanceHistoryModalProps {
  staffId: string;
  staffName: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const AttendanceHistoryModal = ({
  staffId,
  staffName,
  onOpenChange,
  open,
}: AttendanceHistoryModalProps) => {
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true);
      const result = await getAttendance({
        search: staffName, // This will filter by staff name
        status: filters.status || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        limit: 50,
        skip: 0,
      });

      if (result.success) {
        // Filter by exact staff ID since search might return multiple results
        const filteredAttendance = result.attendance.filter(
          (record) => record.staff.id === staffId,
        );
        setAttendanceHistory(filteredAttendance);
      } else {
        toast.error("Failed to load attendance history");
      }
    } catch (error) {
      toast.error("Failed to load attendance history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceHistory();
  }, [staffId, filters]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Attendance History
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viewing attendance records for {staffName}
          </p>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="bg-transparent">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[150px] flex-1">
            <label className="mb-1 block text-sm font-medium">From Date</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="bg-transparent"
            />
          </div>

          <div className="min-w-[150px] flex-1">
            <label className="mb-1 block text-sm font-medium">To Date</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="bg-transparent"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-10"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <ImSpinner2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  Loading attendance history...
                </span>
              </div>
            </div>
          ) : attendanceHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                No attendance records found
              </h3>
              <p className="max-w-sm text-gray-500 dark:text-gray-400">
                No attendance records match your current filters. Try adjusting
                the date range or status filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceHistory.map((record) => (
                <div
                  key={record.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(record.checkIn)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(record.checkIn)} -{" "}
                          {formatTime(record.checkOut)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Check-in: {formatTime(record.checkIn)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Check-out: {formatTime(record.checkOut)}
                      </span>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                            Notes:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {record.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {attendanceHistory.length} record(s) found
          </p>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceHistoryModal;
