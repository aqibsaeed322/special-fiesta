import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Wrench,
  MapPin,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Appliance {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: "operational" | "needs-repair" | "out-of-service";
  location: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  assignedTo?: string;
}

const appliances: Appliance[] = [
  {
    id: "1",
    name: "Industrial HVAC Unit A1",
    category: "HVAC",
    serialNumber: "HVAC-2024-001",
    status: "operational",
    location: "Downtown Office",
    warrantyExpiry: "2026-03-15",
    lastMaintenance: "2024-01-20",
    assignedTo: "Main Building",
  },
  {
    id: "2",
    name: "Forklift FL-200",
    category: "Equipment",
    serialNumber: "FL-2023-102",
    status: "operational",
    location: "Warehouse A",
    warrantyExpiry: "2025-08-10",
    lastMaintenance: "2024-01-15",
  },
  {
    id: "3",
    name: "Power Generator PG-500",
    category: "Power",
    serialNumber: "PG-2022-045",
    status: "needs-repair",
    location: "Main Office",
    warrantyExpiry: "2024-12-01",
    lastMaintenance: "2023-11-30",
  },
  {
    id: "4",
    name: "Commercial Refrigerator CR-1",
    category: "Refrigeration",
    serialNumber: "CR-2024-008",
    status: "operational",
    location: "Warehouse A",
    warrantyExpiry: "2027-02-20",
    lastMaintenance: "2024-02-01",
  },
  {
    id: "5",
    name: "Air Compressor AC-300",
    category: "Equipment",
    serialNumber: "AC-2023-067",
    status: "out-of-service",
    location: "Garage",
    warrantyExpiry: "2025-05-15",
    lastMaintenance: "2024-01-10",
  },
  {
    id: "6",
    name: "Electric Pallet Jack EPJ-1",
    category: "Equipment",
    serialNumber: "EPJ-2024-015",
    status: "operational",
    location: "Warehouse A",
    warrantyExpiry: "2027-01-05",
    lastMaintenance: "2024-01-28",
  },
];

const statusStyles = {
  operational: "bg-success/10 text-success",
  "needs-repair": "bg-warning/10 text-warning",
  "out-of-service": "bg-destructive/10 text-destructive",
};

const statusIcons = {
  operational: CheckCircle2,
  "needs-repair": AlertCircle,
  "out-of-service": AlertCircle,
};

export default function Appliances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [...new Set(appliances.map((a) => a.category))];

  const filteredAppliances = appliances.filter((appliance) => {
    const matchesSearch =
      appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appliance.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appliance.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || appliance.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Appliances Management</h1>
          <p className="page-subtitle">Track equipment and appliance inventory</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Appliance
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or serial number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="needs-repair">Needs Repair</SelectItem>
              <SelectItem value="out-of-service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appliances Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Appliance</th>
              <th>Category</th>
              <th>Status</th>
              <th>Location</th>
              <th>Last Maintenance</th>
              <th>Warranty Expiry</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAppliances.map((appliance, index) => {
              const StatusIcon = statusIcons[appliance.status];
              const warrantyDate = new Date(appliance.warrantyExpiry);
              const isWarrantyExpiringSoon =
                warrantyDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

              return (
                <tr
                  key={appliance.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {appliance.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appliance.serialNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="outline">{appliance.category}</Badge>
                  </td>
                  <td>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "capitalize gap-1",
                        statusStyles[appliance.status]
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {appliance.status.replace("-", " ")}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{appliance.location}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(appliance.lastMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "text-sm",
                        isWarrantyExpiringSoon
                          ? "text-warning font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {warrantyDate.toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredAppliances.length} of {appliances.length} appliances
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            {appliances.filter((a) => a.status === "operational").length}{" "}
            operational
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            {appliances.filter((a) => a.status === "needs-repair").length} needs
            repair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            {appliances.filter((a) => a.status === "out-of-service").length} out
            of service
          </span>
        </div>
      </div>
    </div>
  );
}
