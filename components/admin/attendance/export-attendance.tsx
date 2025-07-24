"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { getAttendance } from "@/lib/actions/admin/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceStatus } from "@prisma/client";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";

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

const exportSchema = z.object({
  format: z.enum(["csv", "excel"], {
    required_error: "Please select an export format",
  }),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
});

type ExportType = z.infer<typeof exportSchema>;

interface AttendanceRecord {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  status: AttendanceStatus;
  notes: string | null;
  createdAt: Date;
  staff: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    department: string;
  };
  markedBy: {
    id: string;
    name: string;
  } | null;
}

const ExportAttendance = () => {
  const [modal, setModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const form = useForm<ExportType>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: "csv",
      dateFrom: "",
      dateTo: "",
      department: "",
      status: "",
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = (data: AttendanceRecord[]) => {
    const headers = [
      "Date",
      "Staff Name",
      "Department",
      "Status",
      "Check In",
      "Check Out",
      "Duration (Hours)",
      "Notes",
      "Marked By",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((record) => {
        const staffName =
          `${record.staff.firstName} ${record.staff.middleName || ""} ${record.staff.lastName}`.trim();
        const checkInTime = formatTime(record.checkIn);
        const checkOutTime = formatTime(record.checkOut);

        // Calculate duration if both check-in and check-out exist
        let duration = "N/A";
        if (record.checkIn && record.checkOut) {
          const diffMs =
            new Date(record.checkOut).getTime() -
            new Date(record.checkIn).getTime();
          const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
          duration = diffHours.toString();
        }

        return [
          formatDate(record.checkIn),
          `"${staffName}"`,
          `"${record.staff.department}"`,
          record.status,
          checkInTime,
          checkOutTime,
          duration,
          `"${record.notes || ""}"`,
          `"${record.markedBy?.name || "System"}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: AttendanceRecord[]) => {
    // For Excel export, we'll create a more structured format
    const excelData = data.map((record) => {
      const staffName =
        `${record.staff.firstName} ${record.staff.middleName || ""} ${record.staff.lastName}`.trim();

      // Calculate duration if both check-in and check-out exist
      let duration = "N/A";
      if (record.checkIn && record.checkOut) {
        const diffMs =
          new Date(record.checkOut).getTime() -
          new Date(record.checkIn).getTime();
        const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
        duration = `${diffHours} hours`;
      }

      return {
        Date: formatDate(record.checkIn),
        "Staff Name": staffName,
        Department: record.staff.department,
        Status: record.status,
        "Check In": formatTime(record.checkIn),
        "Check Out": formatTime(record.checkOut),
        Duration: duration,
        Notes: record.notes || "",
        "Marked By": record.markedBy?.name || "System",
      };
    });

    // Convert to CSV format for Excel (Excel can read CSV files)
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(","),
      ...excelData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row]}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_export_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = async (values: ExportType) => {
    try {
      setExporting(true);

      // Fetch attendance data based on filters
      const result = await getAttendance({
        department: values.department || undefined,
        status: values.status || undefined,
        dateFrom: values.dateFrom || undefined,
        dateTo: values.dateTo || undefined,
        limit: 10000, // Large limit to get all records
        skip: 0,
      });

      if (!result.success) {
        toast.error("Failed to fetch attendance data");
        return;
      }

      if (result.attendance.length === 0) {
        toast.error("No attendance records found for the selected criteria");
        return;
      }

      // Export based on selected format
      if (values.format === "csv") {
        exportToCSV(result.attendance);
        toast.success(
          `Successfully exported ${result.attendance.length} records to CSV`,
        );
      } else {
        exportToExcel(result.attendance);
        toast.success(
          `Successfully exported ${result.attendance.length} records to Excel`,
        );
      }

      setModal(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to export attendance data");
    } finally {
      setExporting(false);
    }
  };

  const onReset = () => {
    setModal(false);
    form.reset();
  };

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Export Attendance Data
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure export settings and download attendance records
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={exporting}
                    >
                      <SelectTrigger className="bg-transparent">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="excel">Excel File</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="block bg-transparent"
                        disabled={exporting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="block bg-transparent"
                        disabled={exporting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={exporting}
                    >
                      <SelectTrigger className="bg-transparent">
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={exporting}
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
                disabled={exporting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={exporting} className="flex-1">
                {exporting ? (
                  <div className="flex items-center gap-2">
                    <ImSpinner2 className="animate-spin" />
                    Exporting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
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

export default ExportAttendance;
