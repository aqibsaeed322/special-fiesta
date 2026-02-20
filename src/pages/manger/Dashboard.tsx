import { StatCard } from "@/components/manger/dashboard/StatCard";
import { TaskList } from "@/components/manger/dashboard/TaskList";
import { EmployeeActivity } from "@/components/manger/dashboard/EmployeeActivity";
import { ScheduleOverview } from "@/components/manger/dashboard/ScheduleOverview";
import {
  ClipboardList,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/manger/api";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      return apiFetch<{
        activeTasks: number;
        dueToday: number;
        overdueTasks: number;
        employeesWorking: number;
        employeeTotal: number;
        hoursLoggedToday: number;
        avgHoursPerEmployee: number;
      }>("/api/dashboard/summary");
    },
  });

  const summary = summaryQuery.data;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-6 pb-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, John! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Active Tasks"
          value={summary ? summary.activeTasks : "—"}
          subtitle={summary ? `${summary.dueToday} due today` : "Loading..."}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Employees Working"
          value={summary ? summary.employeesWorking : "—"}
          subtitle={summary ? `Out of ${summary.employeeTotal} total` : "Loading..."}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Hours Logged Today"
          value={summary ? `${summary.hoursLoggedToday}h` : "—"}
          subtitle={summary ? `Average ${summary.avgHoursPerEmployee}h per employee` : "Loading..."}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Overdue Tasks"
          value={summary ? summary.overdueTasks : "—"}
          subtitle={summary ? "Needs attention" : "Loading..."}
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <TaskList />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <EmployeeActivity />
        </div>
      </div>

      {/* Schedule Overview */}
      <ScheduleOverview />
    </div>
  );
}
