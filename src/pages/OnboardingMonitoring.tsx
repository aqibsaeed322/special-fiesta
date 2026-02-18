import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Search, FileText, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingItem {
  id: string;
  employeeName: string;
  role: string;
  startDate: string;
  progress: number;
  documentsUploaded: number;
  documentsRequired: number;
  approvalStatus: "pending" | "approved" | "rejected";
}

const initial: OnboardingItem[] = [
  {
    id: "1",
    employeeName: "Ayesha Khan",
    role: "Field Technician",
    startDate: "2024-02-10",
    progress: 70,
    documentsUploaded: 5,
    documentsRequired: 7,
    approvalStatus: "pending",
  },
  {
    id: "2",
    employeeName: "Bilal Ahmed",
    role: "Inventory Specialist",
    startDate: "2024-02-01",
    progress: 100,
    documentsUploaded: 6,
    documentsRequired: 6,
    approvalStatus: "approved",
  },
  {
    id: "3",
    employeeName: "Hina Malik",
    role: "Maintenance Lead",
    startDate: "2024-02-12",
    progress: 40,
    documentsUploaded: 2,
    documentsRequired: 6,
    approvalStatus: "pending",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function OnboardingMonitoring() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return initial.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.employeeName.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || item.approvalStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const approvedCount = initial.filter((i) => i.approvalStatus === "approved").length;
  const pendingCount = initial.filter((i) => i.approvalStatus === "pending").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Onboarding Monitoring</h1>
        <p className="page-subtitle">Track employee onboarding progress and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-warning/50" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success/50" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{initial.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary/50" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employee or role..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Approval status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Progress</th>
              <th>Documents</th>
              <th>Approval</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td>
                  <div>
                    <p className="font-medium text-foreground">{item.employeeName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.role}</p>
                  </div>
                </td>
                <td>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.progress}%</span>
                      <span className={cn(item.progress === 100 ? "text-success" : "text-muted-foreground")}>
                        {item.progress === 100 ? "Complete" : "In progress"}
                      </span>
                    </div>
                    <Progress value={item.progress} />
                  </div>
                </td>
                <td>
                  <span className="text-sm text-muted-foreground">
                    {item.documentsUploaded}/{item.documentsRequired}
                  </span>
                </td>
                <td>
                  <Badge variant="secondary" className={cn("capitalize", statusStyles[item.approvalStatus])}>
                    {item.approvalStatus}
                  </Badge>
                </td>
                <td>
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.startDate).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
