import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MapPin,
  Users,
  Building2,
  Phone,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  type: "office" | "warehouse" | "facility" | "site";
  address: string;
  city: string;
  phone: string;
  manager: string;
  employeeCount: number;
  status: "active" | "inactive";
  operatingHours: string;
}

const locations: Location[] = [
  {
    id: "1",
    name: "Downtown Office",
    type: "office",
    address: "123 Business Ave, Suite 500",
    city: "New York, NY 10001",
    phone: "+1 (555) 123-4567",
    manager: "John Smith",
    employeeCount: 45,
    status: "active",
    operatingHours: "8:00 AM - 6:00 PM",
  },
  {
    id: "2",
    name: "Warehouse A",
    type: "warehouse",
    address: "456 Industrial Blvd",
    city: "Brooklyn, NY 11201",
    phone: "+1 (555) 234-5678",
    manager: "Sarah Williams",
    employeeCount: 28,
    status: "active",
    operatingHours: "7:00 AM - 7:00 PM",
  },
  {
    id: "3",
    name: "Main Office",
    type: "office",
    address: "789 Corporate Dr, Floor 12",
    city: "Manhattan, NY 10022",
    phone: "+1 (555) 345-6789",
    manager: "David Chen",
    employeeCount: 62,
    status: "active",
    operatingHours: "9:00 AM - 5:00 PM",
  },
  {
    id: "4",
    name: "Garage",
    type: "facility",
    address: "321 Vehicle Way",
    city: "Queens, NY 11101",
    phone: "+1 (555) 456-7890",
    manager: "Emma Davis",
    employeeCount: 15,
    status: "active",
    operatingHours: "7:30 AM - 5:30 PM",
  },
  {
    id: "5",
    name: "Training Room",
    type: "facility",
    address: "123 Business Ave, Suite 100",
    city: "New York, NY 10001",
    phone: "+1 (555) 567-8901",
    manager: "Tom Wilson",
    employeeCount: 5,
    status: "active",
    operatingHours: "8:00 AM - 6:00 PM",
  },
  {
    id: "6",
    name: "Construction Site B",
    type: "site",
    address: "555 Development Rd",
    city: "Jersey City, NJ 07302",
    phone: "+1 (555) 678-9012",
    manager: "Mike Johnson",
    employeeCount: 20,
    status: "inactive",
    operatingHours: "6:00 AM - 4:00 PM",
  },
];

const typeStyles = {
  office: "bg-primary/10 text-primary",
  warehouse: "bg-warning/10 text-warning",
  facility: "bg-info/10 text-info",
  site: "bg-success/10 text-success",
};

const typeIcons = {
  office: Building2,
  warehouse: Building2,
  facility: Building2,
  site: MapPin,
};

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Locations Management</h1>
          <p className="page-subtitle">Manage all business locations and sites</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typeStyles).map(([type, style]) => {
          const count = locations.filter((l) => l.type === type).length;
          const Icon = typeIcons[type as keyof typeof typeIcons];
          return (
            <div key={type} className="stat-card">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", style)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {type}s
                  </p>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location, index) => {
          const TypeIcon = typeIcons[location.type];
          return (
            <div
              key={location.id}
              className={cn(
                "bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in",
                location.status === "inactive" && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        typeStyles[location.type]
                      )}
                    >
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {location.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={cn("capitalize mt-1", typeStyles[location.type])}
                      >
                        {location.type}
                      </Badge>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{location.address}</p>
                      <p>{location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{location.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{location.employeeCount} employees</span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium capitalize flex items-center gap-1.5",
                      location.status === "active"
                        ? "text-success"
                        : "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        location.status === "active"
                          ? "bg-success"
                          : "bg-muted-foreground"
                      )}
                    />
                    {location.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
