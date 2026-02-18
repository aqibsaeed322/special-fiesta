import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type TaskStatus = "active" | "pending" | "completed";

type TaskPriority = "high" | "medium" | "low";

interface TaskRow {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

interface AttendanceRow {
  id: string;
  employee: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  status: "complete" | "incomplete" | "overtime";
  location: string;
}

const tasks: TaskRow[] = [
  {
    id: "1",
    title: "Site inspection at Downtown Office",
    assignee: "Mike Johnson",
    status: "active",
    priority: "high",
    dueDate: "2024-02-02",
  },
  {
    id: "2",
    title: "Equipment maintenance check",
    assignee: "Sarah Williams",
    status: "pending",
    priority: "medium",
    dueDate: "2024-02-02",
  },
  {
    id: "3",
    title: "Client meeting preparation",
    assignee: "David Chen",
    status: "active",
    priority: "high",
    dueDate: "2024-02-03",
  },
  {
    id: "4",
    title: "Vehicle fleet review",
    assignee: "Emma Davis",
    status: "completed",
    priority: "low",
    dueDate: "2024-02-01",
  },
  {
    id: "5",
    title: "Safety training session",
    assignee: "Tom Wilson",
    status: "pending",
    priority: "medium",
    dueDate: "2024-02-05",
  },
  {
    id: "6",
    title: "Inventory audit",
    assignee: "Lisa Anderson",
    status: "active",
    priority: "medium",
    dueDate: "2024-02-04",
  },
];

const attendance: AttendanceRow[] = [
  {
    id: "1",
    employee: "Mike Johnson",
    date: "2024-02-02",
    clockIn: "08:00",
    clockOut: "17:15",
    totalHours: 8.25,
    status: "complete",
    location: "Downtown Office",
  },
  {
    id: "2",
    employee: "Sarah Williams",
    date: "2024-02-02",
    clockIn: "07:45",
    clockOut: "18:00",
    totalHours: 9.5,
    status: "overtime",
    location: "Warehouse A",
  },
  {
    id: "3",
    employee: "David Chen",
    date: "2024-02-02",
    clockIn: "09:15",
    clockOut: "16:30",
    totalHours: 6.25,
    status: "incomplete",
    location: "Main Office",
  },
  {
    id: "4",
    employee: "Emma Davis",
    date: "2024-02-02",
    clockIn: "07:30",
    clockOut: "16:30",
    totalHours: 8,
    status: "complete",
    location: "Garage",
  },
  {
    id: "5",
    employee: "Tom Wilson",
    date: "2024-02-02",
    clockIn: "08:30",
    clockOut: "17:00",
    totalHours: 8,
    status: "complete",
    location: "Training Room",
  },
  {
    id: "6",
    employee: "Lisa Anderson",
    date: "2024-02-02",
    clockIn: "08:00",
    clockOut: "17:30",
    totalHours: 8.5,
    status: "complete",
    location: "Warehouse A",
  },
];

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    const needsQuotes = /[\n\r",]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

export default function Reports() {
  const [taskQuery, setTaskQuery] = useState("");
  const [attendanceQuery, setAttendanceQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const q = taskQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q)
      );
    });
  }, [taskQuery]);

  const filteredAttendance = useMemo(() => {
    const q = attendanceQuery.trim().toLowerCase();
    if (!q) return attendance;
    return attendance.filter((a) => {
      return (
        a.employee.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
      );
    });
  }, [attendanceQuery]);

  const statusAnalytics = useMemo(() => {
    const base: Record<TaskStatus, number> = { active: 0, pending: 0, completed: 0 };
    tasks.forEach((t) => {
      base[t.status] += 1;
    });
    return [
      { status: "active", value: base.active },
      { status: "pending", value: base.pending },
      { status: "completed", value: base.completed },
    ];
  }, []);

  const priorityAnalytics = useMemo(() => {
    const base: Record<TaskPriority, number> = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      base[t.priority] += 1;
    });
    return [
      { priority: "high", value: base.high },
      { priority: "medium", value: base.medium },
      { priority: "low", value: base.low },
    ];
  }, []);

  const hoursByEmployee = useMemo(() => {
    const map = new Map<string, number>();
    attendance.forEach((a) => {
      map.set(a.employee, (map.get(a.employee) ?? 0) + a.totalHours);
    });
    return Array.from(map.entries())
      .map(([employee, hours]) => ({ employee, hours: Number(hours.toFixed(2)) }))
      .sort((a, b) => b.hours - a.hours);
  }, []);

  const weeklyTrend = useMemo(() => {
    return [
      { week: "W1", tasksCompleted: 6, hoursLogged: 126 },
      { week: "W2", tasksCompleted: 9, hoursLogged: 134 },
      { week: "W3", tasksCompleted: 7, hoursLogged: 129 },
      { week: "W4", tasksCompleted: 11, hoursLogged: 142 },
    ];
  }, []);

  const exportTasksCsv = () => {
    const csv = toCsv(
      filteredTasks.map((t) => ({
        id: t.id,
        title: t.title,
        assignee: t.assignee,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
      })),
    );
    downloadTextFile("tasks-report.csv", csv, "text/csv");
    toast({ title: "Exported", description: "Tasks report downloaded." });
  };

  const exportAttendanceCsv = () => {
    const csv = toCsv(
      filteredAttendance.map((a) => ({
        id: a.id,
        employee: a.employee,
        date: a.date,
        clockIn: a.clockIn,
        clockOut: a.clockOut,
        totalHours: a.totalHours,
        status: a.status,
        location: a.location,
      })),
    );
    downloadTextFile("attendance-report.csv", csv, "text/csv");
    toast({ title: "Exported", description: "Attendance report downloaded." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Review task, attendance, and performance insights</p>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="attendance">Time Clock Reports</TabsTrigger>
          <TabsTrigger value="performance">Employee Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Tasks by Status</h3>
              </div>
              <ChartContainer
                config={{
                  value: { label: "Tasks", color: "hsl(var(--primary))" },
                }}
                className="h-[260px]"
              >
                <BarChart data={statusAnalytics} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Tasks by Priority</h3>
              </div>
              <ChartContainer
                config={{
                  value: { label: "Tasks", color: "hsl(var(--info))" },
                }}
                className="h-[260px]"
              >
                <BarChart data={priorityAnalytics} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="priority" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10"
                  value={taskQuery}
                  onChange={(e) => setTaskQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2" onClick={exportTasksCsv}>
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t, index) => (
                    <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                      <td>
                        <span className="font-medium text-foreground">{t.title}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{t.assignee}</span>
                      </td>
                      <td>
                        <Badge variant="outline" className="capitalize">
                          {t.priority}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant="secondary" className="capitalize">
                          {t.status}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-muted-foreground">
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Weekly Summary</h3>
            </div>
            <ChartContainer
              config={{
                tasksCompleted: { label: "Tasks Completed", color: "hsl(var(--primary))" },
                hoursLogged: { label: "Hours Logged", color: "hsl(var(--success))" },
              }}
              className="h-[280px]"
            >
              <LineChart data={weeklyTrend} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="tasksCompleted" stroke="var(--color-tasksCompleted)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hoursLogged" stroke="var(--color-hoursLogged)" strokeWidth={2} dot={false} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search attendance..."
                  className="pl-10"
                  value={attendanceQuery}
                  onChange={(e) => setAttendanceQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2" onClick={exportAttendanceCsv}>
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((a, index) => (
                    <tr key={a.id} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                      <td>
                        <span className="font-medium text-foreground">{a.employee}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{new Date(a.date).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{a.clockIn}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{a.clockOut}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{a.totalHours}h</span>
                      </td>
                      <td>
                        <Badge variant="secondary" className="capitalize">
                          {a.status}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{a.location}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Hours by Employee</h3>
            </div>
            <ChartContainer
              config={{
                hours: { label: "Hours", color: "hsl(var(--primary))" },
              }}
              className="h-[320px]"
            >
              <BarChart data={hoursByEmployee} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="employee" tickLine={false} axisLine={false} hide />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" fill="var(--color-hours)" radius={8} />
              </BarChart>
            </ChartContainer>

            <div className="mt-6 overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {hoursByEmployee.map((row, index) => (
                    <tr key={row.employee} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                      <td>
                        <span className="font-medium text-foreground">{row.employee}</span>
                      </td>
                      <td>
                        <span className="text-muted-foreground">{row.hours}h</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
