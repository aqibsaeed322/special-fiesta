import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentTasksList } from "@/components/admin/dashboard/RecentTasksList";
import { ActiveEmployees } from "@/components/admin/dashboard/ActiveEmployees";
import { TaskCharts } from "@/components/admin/dashboard/TaskCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Users, CheckSquare, AlertTriangle, Clock } from "lucide-react";
import { listResource } from "@/lib/admin/apiClient";

type Employee = {
  id: string;
};

type Task = {
  id: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
};

type TimeEntry = {
  id: string;
  status: "clocked-in" | "clocked-out" | "on-break";
};

type ScheduleItem = {
  id: string;
  location: string;
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "canceled";
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const [emps, tks, entries, sch] = await Promise.all([
          listResource<Employee>("employees"),
          listResource<Task>("tasks"),
          listResource<TimeEntry>("time-entries"),
          listResource<ScheduleItem>("schedules"),
        ]);
        if (!mounted) return;
        setEmployees(emps);
        setTasks(tks);
        setTimeEntries(entries);
        setSchedules(sch);
      } catch (e) {
        if (!mounted) return;
        setApiError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeTasks = tasks.filter((t) => t.status === "pending" || t.status === "in-progress").length;
    const overdueTasks = tasks.filter((t) => t.status === "overdue").length;
    const clockedInEmployees = timeEntries.filter((e) => e.status === "clocked-in" || e.status === "on-break").length;

    const upcomingSchedules = schedules
      .filter((s) => s.status === "scheduled")
      .slice()
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        const aStart = a.startTime || "00:00";
        const bStart = b.startTime || "00:00";
        if (aStart !== bStart) return aStart < bStart ? -1 : 1;
        return a.id < b.id ? -1 : 1;
      })
      .slice(0, 5);

    return {
      totalEmployees,
      activeTasks,
      overdueTasks,
      clockedInEmployees,
      upcomingSchedules,
    };
  }, [employees.length, schedules, tasks, timeEntries]);

  return (
    <AdminLayout>
      {/* Mobile-first padding and spacing */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-0">
        
        {/* Page Header - Responsive */}
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl">
            Welcome back! Here's an overview of your system.
          </p>
        </div>

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          <StatCard
            title="Total Employees"
            value={metrics.totalEmployees}
            changeType="positive"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Active Tasks"
            value={metrics.activeTasks}
            changeType="neutral"
            icon={CheckSquare}
            variant="success"
          />
          <StatCard
            title="Overdue Tasks"
            value={metrics.overdueTasks}
            changeType="positive"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Clocked In"
            value={metrics.clockedInEmployees}
            changeType="neutral"
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Charts Section - Responsive container */}
        <div className="w-full overflow-x-auto pb-1">
          <div className="min-w-[300px] sm:min-w-0">
            <TaskCharts />
          </div>
        </div>

        {/* Bottom Section - Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-2">
          <div className="w-full overflow-hidden">
            <RecentTasksList />
          </div>
          <div className="w-full overflow-hidden">
            <ActiveEmployees />
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="rounded-md bg-destructive/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-destructive break-words">
              {apiError}
            </p>
          </div>
        )}

        {/* Upcoming Schedules Card - Responsive */}
        <Card className="shadow-soft border-0 sm:border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5">
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
              Upcoming Schedules
            </CardTitle>
            <a 
              href="/scheduling" 
              className="text-xs sm:text-sm text-accent hover:underline inline-flex items-center"
            >
              View all
              <span className="ml-1 hidden sm:inline">→</span>
            </a>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-6">
            {loading ? (
              <div className="flex justify-center items-center py-6 sm:py-8">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Loading schedules...
                </div>
              </div>
            ) : metrics.upcomingSchedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No upcoming schedules found.
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {metrics.upcomingSchedules.map((s) => (
                  <div 
                    key={s.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 
                             rounded-md border p-3 sm:p-3.5 hover:bg-muted/30 transition-colors"
                  >
                    {/* Left side - Location and details */}
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-0.5">
                      <p className="font-medium text-sm sm:text-base truncate max-w-full">
                        {s.location}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                          {s.employee}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">{s.date}</span>
                        {s.startTime && s.endTime && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="whitespace-nowrap text-xs">
                              {s.startTime} - {s.endTime}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side - Status Badge */}
                    <div className="flex items-center justify-start sm:justify-end">
                      <Badge 
                        variant="secondary" 
                        className={`
                          text-xs font-medium px-2.5 py-0.5
                          ${s.status === 'scheduled' ? 'bg-accent/10 text-accent' : ''}
                          ${s.status === 'completed' ? 'bg-success/10 text-success' : ''}
                          ${s.status === 'canceled' ? 'bg-destructive/10 text-destructive' : ''}
                        `}
                      >
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Mobile View All Link - Only visible on mobile */}
                <div className="block sm:hidden pt-2">
                  <a 
                    href="/scheduling" 
                    className="text-xs text-accent hover:underline inline-flex items-center w-full justify-center py-2"
                  >
                    View all schedules
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;