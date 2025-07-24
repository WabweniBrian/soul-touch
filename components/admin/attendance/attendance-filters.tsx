"use client";

import SearchInput from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function AttendanceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Get current filter values from URL
  const department = searchParams.get("department") || "";
  const status = searchParams.get("status") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  // Filter options
  const departments = [
    "Science",
    "Mathematics",
    "English",
    "Social Studies",
    "Arts",
    "ICT",
    "Physical Education",
    "Other",
  ];

  const statuses = [
    { value: "Present", label: "Present", color: "text-green-600" },
    { value: "Late", label: "Late", color: "text-yellow-600" },
    { value: "Absent", label: "Absent", color: "text-red-600" },
  ];

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (params.has("page")) {
        params.set("page", "1");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Toggle a filter option
  const toggleFilter = useCallback(
    (key: string, value: string) => {
      const currentValue = searchParams.get(key);
      updateFilters({ [key]: currentValue === value ? null : value });
    },
    [searchParams, updateFilters],
  );

  // Reset all filters
  const clearFilters = useCallback(() => {
    router.push("");
  }, [router]);

  // Count active filters
  const activeFilterCount = [department, status, dateFrom, dateTo].filter(
    Boolean,
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <SearchInput
          placeholder="Search by staff name, department..."
          className="sm:w-full"
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
              {/* Department Filter */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Department
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-x-2">
                    <Checkbox
                      id="all-departments"
                      checked={!department}
                      onCheckedChange={() =>
                        updateFilters({ department: null })
                      }
                    />
                    <Label htmlFor="all-departments" className="text-sm">
                      All Departments
                    </Label>
                  </div>
                  {departments.map((d) => (
                    <div key={d} className="flex items-center gap-x-2">
                      <Checkbox
                        id={`department-${d}`}
                        checked={department === d}
                        onCheckedChange={() => toggleFilter("department", d)}
                      />
                      <Label htmlFor={`department-${d}`} className="text-sm">
                        {d}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-x-2">
                    <Checkbox
                      id="all-statuses"
                      checked={!status}
                      onCheckedChange={() => updateFilters({ status: null })}
                    />
                    <Label htmlFor="all-statuses" className="text-sm">
                      All Statuses
                    </Label>
                  </div>
                  {statuses.map((s) => (
                    <div key={s.value} className="flex items-center gap-x-2">
                      <Checkbox
                        id={`status-${s.value}`}
                        checked={status === s.value}
                        onCheckedChange={() => toggleFilter("status", s.value)}
                      />
                      <Label
                        htmlFor={`status-${s.value}`}
                        className={`text-sm ${s.color}`}
                      >
                        {s.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Date Range
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from" className="text-sm">
                      From
                    </Label>
                    <div className="relative">
                      <Input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) =>
                          updateFilters({
                            dateFrom: e.target.value || null,
                          })
                        }
                        className="block w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to" className="text-sm">
                      To
                    </Label>
                    <div className="relative">
                      <Input
                        id="date-to"
                        type="date"
                        value={dateTo}
                        onChange={(e) =>
                          updateFilters({ dateTo: e.target.value || null })
                        }
                        className="block w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsFiltersOpen(false)}
              >
                Close Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Active Filters:
          </span>
          {department && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-primary/10"
            >
              Department: {department}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => updateFilters({ department: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove department filter</span>
              </Button>
            </Badge>
          )}
          {status && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-primary/10"
            >
              Status: {status}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => updateFilters({ status: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove status filter</span>
              </Button>
            </Badge>
          )}
          {(dateFrom || dateTo) && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-primary/10"
            >
              Date: {dateFrom || "Any"} to {dateTo || "Any"}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => updateFilters({ dateFrom: null, dateTo: null })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove date filter</span>
              </Button>
            </Badge>
          )}
          {activeFilterCount > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-primary hover:text-primary/80"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
