import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, Users } from "lucide-react";
import { listResource } from "@/lib/apiClient";

interface TimeEntry {
  id: string;
  employee: string;
  initials: string;
  location: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: "clocked-in" | "clocked-out" | "on-break";
}

type EmployeeProfile = {
  name: string;
  role?: string;
};

const statusClasses = {
  "clocked-in": "bg-success/10 text-success",
  "clocked-out": "bg-muted text-muted-foreground",
  "on-break": "bg-warning/10 text-warning",
};

const statusLabels = {
  "clocked-in": "Active",
  "clocked-out": "Offline",
  "on-break": "On Break",
};

export function ActiveEmployees() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const [entries, emps] = await Promise.all([
          listResource<TimeEntry>("time-entries"),
          listResource<EmployeeProfile>("employees"),
        ]);
        if (!mounted) return;
        setTimeEntries(entries);
        setEmployees(emps);
      } catch (e) {
        if (!mounted) return;
        setApiError(e instanceof Error ? e.message : "Failed to load active employees");
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

  const activeEntries = useMemo(() => {
    return timeEntries
      .filter((e) => e.status === "clocked-in" || e.status === "on-break")
      .slice(0, 6);
  }, [timeEntries]);

  const roleByName = useMemo(() => {
    return new Map(employees.map((e) => [e.name, e.role || ""]));
  }, [employees]);

  return (
    <Card className="shadow-soft border-0 sm:border h-full">
      {/* Card Header - Responsive */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
          Active Employees
        </CardTitle>
        <a 
          href="/time-tracking" 
          className="text-xs sm:text-sm text-accent hover:underline inline-flex items-center"
        >
          View all
          <span className="ml-1 hidden sm:inline">→</span>
        </a>
      </CardHeader>

      {/* Card Content - Responsive */}
      <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6 pb-5 sm:pb-6">
        {loading ? (
          <div className="flex justify-center items-center py-6 sm:py-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-accent/30 animate-pulse" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Loading active employees...
              </p>
            </div>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive/50 mb-2" />
            <p className="text-xs sm:text-sm text-destructive">{apiError}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please try again later
            </p>
          </div>
        ) : activeEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <p className="text-sm sm:text-base font-medium text-muted-foreground">
              No active employees
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              All team members are currently offline
            </p>
            <a 
              href="/time-tracking" 
              className="mt-3 text-xs sm:text-sm text-accent hover:underline"
            >
              Go to Time Tracking →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {activeEntries.map((employee) => (
              <div
                key={employee.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 
                         rounded-lg hover:bg-muted/30 transition-colors border border-transparent"
              >
                {/* Left Section - Avatar and Employee Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">
                        {employee.employee}
                      </p>
                      {/* Status Badge - Mobile (inline) */}
                      <Badge 
                        className={`${statusClasses[employee.status]} text-xs sm:hidden`} 
                        variant="secondary"
                      >
                        {statusLabels[employee.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {roleByName.get(employee.employee) || "No role assigned"}
                    </p>
                    {/* Location - Mobile only */}
                    <p className="text-xs text-muted-foreground truncate sm:hidden">
                      {employee.location}
                    </p>
                  </div>
                </div>

                {/* Right Section - Status Badge (Desktop) and Clock In Time */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 pl-11 sm:pl-0">
                  {/* Status Badge - Desktop only */}
                  <Badge 
                    className={`${statusClasses[employee.status]} text-xs sm:inline-flex hidden`} 
                    variant="secondary"
                  >
                    {statusLabels[employee.status]}
                  </Badge>
                  
                  {/* Clock In Time - Always visible */}
                  {employee.clockIn && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      <span>{employee.clockIn}</span>
                      <span className="hidden sm:inline text-muted-foreground/50 ml-1">
                        clock-in
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Mobile View All Link - Only visible on mobile */}
            <div className="block sm:hidden pt-2">
              <a 
                href="/time-tracking" 
                className="text-xs text-accent hover:underline inline-flex items-center w-full justify-center py-2"
              >
                View all active employees
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}