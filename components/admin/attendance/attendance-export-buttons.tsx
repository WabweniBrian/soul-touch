"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export function AttendanceExportButtons({
  onExportCSV,
  onExportPDF,
}: {
  onExportCSV: () => void;
  onExportPDF: () => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      <Button
        variant="outline"
        onClick={onExportCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" /> Export CSV
      </Button>
      <Button
        variant="outline"
        onClick={onExportPDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" /> Export PDF
      </Button>
    </div>
  );
}
