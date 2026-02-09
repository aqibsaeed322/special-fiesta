import { StatCard } from "@/components/dashboard/StatCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { EmployeeActivity } from "@/components/dashboard/EmployeeActivity";
import { ScheduleOverview } from "@/components/dashboard/ScheduleOverview";
import {
  ClipboardList,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, John! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Tasks"
          value={24}
          subtitle="8 due today"
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Employees Working"
          value={18}
          subtitle="Out of 25 total"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Hours Logged Today"
          value="142h"
          subtitle="Average 7.9h per employee"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Overdue Tasks"
          value={3}
          subtitle="Needs attention"
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TaskList />
        </div>
        <div className="space-y-6">
          <EmployeeActivity />
        </div>
      </div>

      {/* Schedule Overview */}
      <ScheduleOverview />
    </div>
  );
}
