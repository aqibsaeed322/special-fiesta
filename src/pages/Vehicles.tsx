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
  Car,
  Fuel,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: "available" | "in-use" | "maintenance";
  assignedTo?: string;
  lastInspection: string;
  nextInspection: string;
  fuelLevel: number;
  mileage: number;
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Ford Transit Van #1",
    type: "Van",
    licensePlate: "ABC-1234",
    status: "in-use",
    assignedTo: "Mike Johnson",
    lastInspection: "2024-01-15",
    nextInspection: "2024-04-15",
    fuelLevel: 75,
    mileage: 45230,
  },
  {
    id: "2",
    name: "Chevrolet Silverado #2",
    type: "Truck",
    licensePlate: "XYZ-5678",
    status: "available",
    lastInspection: "2024-01-20",
    nextInspection: "2024-04-20",
    fuelLevel: 90,
    mileage: 32150,
  },
  {
    id: "3",
    name: "Toyota Camry #3",
    type: "Sedan",
    licensePlate: "DEF-9012",
    status: "maintenance",
    lastInspection: "2024-01-10",
    nextInspection: "2024-04-10",
    fuelLevel: 40,
    mileage: 67890,
  },
  {
    id: "4",
    name: "Ford F-150 #4",
    type: "Truck",
    licensePlate: "GHI-3456",
    status: "in-use",
    assignedTo: "Sarah Williams",
    lastInspection: "2024-01-25",
    nextInspection: "2024-04-25",
    fuelLevel: 60,
    mileage: 28500,
  },
  {
    id: "5",
    name: "Mercedes Sprinter #5",
    type: "Van",
    licensePlate: "JKL-7890",
    status: "available",
    lastInspection: "2024-02-01",
    nextInspection: "2024-05-01",
    fuelLevel: 85,
    mileage: 15200,
  },
];

const statusStyles = {
  available: "bg-success/10 text-success",
  "in-use": "bg-primary/10 text-primary",
  maintenance: "bg-warning/10 text-warning",
};

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Vehicles Management</h1>
          <p className="page-subtitle">Track and manage company vehicles</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-success">
                {vehicles.filter((v) => v.status === "available").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success/50" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Use</p>
              <p className="text-2xl font-bold text-primary">
                {vehicles.filter((v) => v.status === "in-use").length}
              </p>
            </div>
            <Car className="w-8 h-8 text-primary/50" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-warning">
                {vehicles.filter((v) => v.status === "maintenance").length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning/50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or license plate..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in-use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.licensePlate}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="secondary"
                  className={cn("capitalize", statusStyles[vehicle.status])}
                >
                  {vehicle.status.replace("-", " ")}
                </Badge>
                <Badge variant="outline">{vehicle.type}</Badge>
              </div>

              {vehicle.assignedTo && (
                <p className="text-sm text-muted-foreground mb-4">
                  Assigned to:{" "}
                  <span className="text-foreground font-medium">
                    {vehicle.assignedTo}
                  </span>
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fuel className="w-4 h-4" />
                    <span>Fuel Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          vehicle.fuelLevel > 50
                            ? "bg-success"
                            : vehicle.fuelLevel > 25
                            ? "bg-warning"
                            : "bg-destructive"
                        )}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-foreground font-medium">
                      {vehicle.fuelLevel}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mileage</span>
                  <span className="text-foreground font-medium">
                    {vehicle.mileage.toLocaleString()} mi
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Next Inspection</span>
                  </div>
                  <span className="text-foreground">
                    {new Date(vehicle.nextInspection).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
