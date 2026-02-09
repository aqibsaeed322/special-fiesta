import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Phone, Mail, MapPin, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "away" | "offline";
  location: string;
  joinDate: string;
  avatar: string;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 234 567 8901",
    role: "Field Technician",
    department: "Operations",
    status: "active",
    location: "Downtown Office",
    joinDate: "2022-03-15",
    avatar: "MJ",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    phone: "+1 234 567 8902",
    role: "Maintenance Lead",
    department: "Maintenance",
    status: "active",
    location: "Warehouse A",
    joinDate: "2021-08-20",
    avatar: "SW",
  },
  {
    id: "3",
    name: "David Chen",
    email: "david.chen@company.com",
    phone: "+1 234 567 8903",
    role: "Project Coordinator",
    department: "Management",
    status: "away",
    location: "Main Office",
    joinDate: "2023-01-10",
    avatar: "DC",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    phone: "+1 234 567 8904",
    role: "Fleet Manager",
    department: "Logistics",
    status: "active",
    location: "Garage",
    joinDate: "2020-11-05",
    avatar: "ED",
  },
  {
    id: "5",
    name: "Tom Wilson",
    email: "tom.wilson@company.com",
    phone: "+1 234 567 8905",
    role: "Safety Officer",
    department: "Safety",
    status: "offline",
    location: "Training Room",
    joinDate: "2022-06-12",
    avatar: "TW",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    phone: "+1 234 567 8906",
    role: "Inventory Specialist",
    department: "Operations",
    status: "active",
    location: "Warehouse A",
    joinDate: "2023-04-22",
    avatar: "LA",
  },
];

const statusColors = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

const statusLabels = {
  active: "Online",
  away: "Away",
  offline: "Offline",
};

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const departments = [...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Employee Directory</h1>
        <p className="page-subtitle">View and manage your team members</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Online</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee, index) => (
          <div
            key={employee.id}
            className="bg-card rounded-xl border border-border shadow-card p-6 hover:shadow-elevated transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {employee.avatar}
                  </div>
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
                      statusColors[employee.status]
                    )}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{employee.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <Badge variant="secondary" className="text-xs">
                {employee.department}
              </Badge>
              <span
                className={cn(
                  "text-xs font-medium flex items-center gap-1.5",
                  employee.status === "active"
                    ? "text-success"
                    : employee.status === "away"
                    ? "text-warning"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    statusColors[employee.status]
                  )}
                />
                {statusLabels[employee.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            {employees.filter((e) => e.status === "active").length} online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            {employees.filter((e) => e.status === "away").length} away
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            {employees.filter((e) => e.status === "offline").length} offline
          </span>
        </div>
      </div>
    </div>
  );
}
