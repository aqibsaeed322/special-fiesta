import { useMemo, useState } from "react";
import { Button } from "@/components/manger/ui/button";
import { Input } from "@/components/manger/ui/input";
import { Badge } from "@/components/manger/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/manger/ui/select";
import { Search, Download, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/manger/utils";
import { apiFetch } from "@/lib/manger/api";
import { useQuery } from "@tanstack/react-query";

interface TimeEntry {
  id: string;
  employee: string;
  avatar: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: string;
  totalHours: number;
  status: "complete" | "incomplete" | "overtime";
  location: string;
}

type TimeEntryApi = Omit<TimeEntry, "id"> & {
  _id: string;
};

function normalizeEntry(e: TimeEntryApi): TimeEntry {
  return {
    id: e._id,
    employee: e.employee,
    avatar: e.avatar,
    date: e.date,
    clockIn: e.clockIn,
    clockOut: e.clockOut,
    breakTime: e.breakTime,
    totalHours: e.totalHours,
    status: e.status,
    location: e.location,
  };
}

const statusStyles = {
  complete: "bg-success/10 text-success",
  incomplete: "bg-warning/10 text-warning",
  overtime: "bg-info/10 text-info",
};

export default function TimeTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const entriesQuery = useQuery({
    queryKey: ["time-entries"],
    queryFn: async () => {
      const res = await apiFetch<{ items: TimeEntryApi[] }>("/api/time-entries");
      return res.items.map(normalizeEntry);
    },
  });

  const timeEntries = entriesQuery.data ?? [];

  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      const matchesSearch = entry.employee
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [timeEntries, searchQuery, statusFilter]);

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.totalHours, 0);
  const avgHours = (totalHours / filteredEntries.length || 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Time Tracking</h1>
          <p className="page-subtitle">Monitor employee work hours and attendance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hours Today</p>
              <p className="text-2xl font-bold text-foreground">
                {totalHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Hours</p>
              <p className="text-2xl font-bold text-foreground">{avgHours}h</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incomplete</p>
              <p className="text-2xl font-bold text-foreground">
                {timeEntries.filter((e) => e.status === "incomplete").length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overtime</p>
              <p className="text-2xl font-bold text-foreground">
                {timeEntries.filter((e) => e.status === "overtime").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employee..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="overtime">Overtime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Time Entries Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {entriesQuery.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading time entries...</div>
        ) : entriesQuery.isError ? (
          <div className="p-6 text-sm text-destructive">
            {entriesQuery.error instanceof Error
              ? entriesQuery.error.message
              : "Failed to load time entries"}
          </div>
        ) : null}
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Break</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <tr
                key={entry.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {entry.avatar}
                    </div>
                    <span className="font-medium text-foreground">
                      {entry.employee}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <span className="font-medium text-foreground">
                    {entry.clockIn}
                  </span>
                </td>
                <td>
                  <span className="font-medium text-foreground">
                    {entry.clockOut}
                  </span>
                </td>
                <td>
                  <span className="text-muted-foreground">{entry.breakTime}</span>
                </td>
                <td>
                  <span
                    className={cn(
                      "font-semibold",
                      entry.totalHours >= 8 ? "text-success" : "text-warning"
                    )}
                  >
                    {entry.totalHours}h
                  </span>
                </td>
                <td>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs capitalize", statusStyles[entry.status])}
                  >
                    {entry.status}
                  </Badge>
                </td>
                <td>
                  <span className="text-muted-foreground">{entry.location}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
