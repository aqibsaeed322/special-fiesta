import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const initialLocations: Location[] = [
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

const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["office", "warehouse", "facility", "site"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(1, "Phone is required"),
  manager: z.string().min(1, "Manager is required"),
  employeeCount: z.coerce.number().min(0, "Must be 0 or greater"),
  status: z.enum(["active", "inactive"]),
  operatingHours: z.string().min(1, "Operating hours are required"),
});

type CreateLocationValues = z.infer<typeof createLocationSchema>;

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  const form = useForm<CreateLocationValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: "",
      type: "office",
      address: "",
      city: "",
      phone: "",
      manager: "",
      employeeCount: 0,
      status: "active",
      operatingHours: "",
    },
  });

  const editForm = useForm<CreateLocationValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: "",
      type: "office",
      address: "",
      city: "",
      phone: "",
      manager: "",
      employeeCount: 0,
      status: "active",
      operatingHours: "",
    },
  });

  const onCreateLocation = (values: CreateLocationValues) => {
    const location: Location = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      name: values.name,
      type: values.type,
      address: values.address,
      city: values.city,
      phone: values.phone,
      manager: values.manager,
      employeeCount: values.employeeCount,
      status: values.status,
      operatingHours: values.operatingHours,
    };

    setLocations((prev) => [location, ...prev]);
    setIsCreateOpen(false);
    form.reset();
    toast({
      title: "Location added",
      description: "New location has been added.",
    });
  };

  const openView = (location: Location) => {
    setSelectedLocation(location);
    setIsViewOpen(true);
  };

  const openEdit = (location: Location) => {
    setSelectedLocation(location);
    editForm.reset({
      name: location.name,
      type: location.type,
      address: location.address,
      city: location.city,
      phone: location.phone,
      manager: location.manager,
      employeeCount: location.employeeCount,
      status: location.status,
      operatingHours: location.operatingHours,
    });
    setIsEditOpen(true);
  };

  const openDelete = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteOpen(true);
  };

  const onEditLocation = (values: CreateLocationValues) => {
    if (!selectedLocation) return;

    const updated: Location = {
      ...selectedLocation,
      name: values.name,
      type: values.type,
      address: values.address,
      city: values.city,
      phone: values.phone,
      manager: values.manager,
      employeeCount: values.employeeCount,
      status: values.status,
      operatingHours: values.operatingHours,
    };

    setLocations((prev) =>
      prev.map((l) => (l.id === selectedLocation.id ? updated : l)),
    );
    setIsEditOpen(false);
    toast({
      title: "Location updated",
      description: "Location has been updated.",
    });
  };

  const confirmDelete = () => {
    if (!selectedLocation) return;
    const toDelete = selectedLocation;
    setLocations((prev) => prev.filter((l) => l.id !== toDelete.id));
    setIsDeleteOpen(false);
    setSelectedLocation(null);
    toast({
      title: "Location deleted",
      description: "Location has been removed.",
    });
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [locations, searchQuery]);

  const typeCounts = useMemo(() => {
    return {
      office: locations.filter((l) => l.type === "office").length,
      warehouse: locations.filter((l) => l.type === "warehouse").length,
      facility: locations.filter((l) => l.type === "facility").length,
      site: locations.filter((l) => l.type === "site").length,
    };
  }, [locations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Locations Management</h1>
          <p className="page-subtitle">Manage all business locations and sites</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Add a new business location.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateLocation)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Warehouse B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="facility">Facility</SelectItem>
                          <SelectItem value="site">Site</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY 10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operatingHours"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Operating Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 8:00 AM - 6:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open);
          if (!open) setSelectedLocation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription>View location information.</DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    typeStyles[selectedLocation.type],
                  )}
                >
                  {(() => {
                    const Icon = typeIcons[selectedLocation.type];
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {selectedLocation.name}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize truncate">
                    {selectedLocation.type}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <p className="text-foreground capitalize">{selectedLocation.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Employees</p>
                  <p className="text-foreground">{selectedLocation.employeeCount}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="text-foreground">{selectedLocation.address}</p>
                  <p className="text-foreground">{selectedLocation.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Phone</p>
                  <p className="text-foreground">{selectedLocation.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Manager</p>
                  <p className="text-foreground">{selectedLocation.manager}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-muted-foreground">Operating Hours</p>
                  <p className="text-foreground">{selectedLocation.operatingHours}</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (!selectedLocation) return;
                    setIsViewOpen(false);
                    openEdit(selectedLocation);
                  }}
                >
                  Edit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedLocation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location information.</DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditLocation)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Warehouse B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="facility">Facility</SelectItem>
                          <SelectItem value="site">Site</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY 10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="operatingHours"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Operating Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 8:00 AM - 6:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete location?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typeStyles).map(([type, style]) => {
          const count = typeCounts[type as keyof typeof typeCounts] ?? 0;
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Location actions"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(location)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(location)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openDelete(location)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
