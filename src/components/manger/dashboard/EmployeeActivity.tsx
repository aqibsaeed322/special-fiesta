import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
  location: string;
  clockedIn: string;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Mike Johnson",
    role: "Field Technician",
    avatar: "MJ",
    status: "online",
    location: "Downtown Office",
    clockedIn: "8:00 AM",
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Maintenance Lead",
    avatar: "SW",
    status: "online",
    location: "Warehouse A",
    clockedIn: "7:45 AM",
  },
  {
    id: "3",
    name: "David Chen",
    role: "Project Coordinator",
    avatar: "DC",
    status: "away",
    location: "Main Office",
    clockedIn: "9:15 AM",
  },
  {
    id: "4",
    name: "Emma Davis",
    role: "Fleet Manager",
    avatar: "ED",
    status: "online",
    location: "Garage",
    clockedIn: "7:30 AM",
  },
];

const statusColors = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

export function EmployeeActivity() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-border flex items-start sm:items-center justify-between gap-3">
        <h3 className="font-semibold text-foreground text-base sm:text-lg">Active Employees</h3>
        <Badge variant="secondary" className="bg-success/10 text-success">
          {employees.filter((e) => e.status === "online").length} Online
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {employees.map((employee, index) => (
          <div
            key={employee.id}
            className="px-4 sm:px-6 py-4 hover:bg-muted/30 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm">
                  {employee.avatar}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    statusColors[employee.status]
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {employee.name}
                </p>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
              </div>
              <div className="w-full sm:w-auto sm:text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground sm:justify-end">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate sm:whitespace-nowrap">{employee.location}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                  Clocked in at {employee.clockedIn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
