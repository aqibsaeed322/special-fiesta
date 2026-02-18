import { useMemo, useState } from "react";
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

const initialAppliances: Appliance[] = [
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

const createApplianceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  status: z.enum(["operational", "needs-repair", "out-of-service"]),
  location: z.string().min(1, "Location is required"),
  warrantyExpiry: z.string().min(1, "Warranty expiry is required"),
  lastMaintenance: z.string().min(1, "Last maintenance date is required"),
  assignedTo: z.string().optional(),
});

type CreateApplianceValues = z.infer<typeof createApplianceSchema>;

export default function Appliances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(
    null,
  );
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);

  const form = useForm<CreateApplianceValues>({
    resolver: zodResolver(createApplianceSchema),
    defaultValues: {
      name: "",
      category: "",
      serialNumber: "",
      status: "operational",
      location: "",
      warrantyExpiry: "",
      lastMaintenance: "",
      assignedTo: "",
    },
  });

  const editForm = useForm<CreateApplianceValues>({
    resolver: zodResolver(createApplianceSchema),
    defaultValues: {
      name: "",
      category: "",
      serialNumber: "",
      status: "operational",
      location: "",
      warrantyExpiry: "",
      lastMaintenance: "",
      assignedTo: "",
    },
  });

  const onCreateAppliance = (values: CreateApplianceValues) => {
    const appliance: Appliance = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      name: values.name,
      category: values.category,
      serialNumber: values.serialNumber,
      status: values.status,
      location: values.location,
      warrantyExpiry: values.warrantyExpiry,
      lastMaintenance: values.lastMaintenance,
      assignedTo: values.assignedTo?.trim() ? values.assignedTo.trim() : undefined,
    };

    setAppliances((prev) => [appliance, ...prev]);
    setIsCreateOpen(false);
    form.reset();
    toast({
      title: "Appliance added",
      description: "New appliance has been added.",
    });
  };

  const openView = (appliance: Appliance) => {
    setSelectedAppliance(appliance);
    setIsViewOpen(true);
  };

  const openEdit = (appliance: Appliance) => {
    setSelectedAppliance(appliance);
    editForm.reset({
      name: appliance.name,
      category: appliance.category,
      serialNumber: appliance.serialNumber,
      status: appliance.status,
      location: appliance.location,
      warrantyExpiry: appliance.warrantyExpiry,
      lastMaintenance: appliance.lastMaintenance,
      assignedTo: appliance.assignedTo ?? "",
    });
    setIsEditOpen(true);
  };

  const openDelete = (appliance: Appliance) => {
    setSelectedAppliance(appliance);
    setIsDeleteOpen(true);
  };

  const onEditAppliance = (values: CreateApplianceValues) => {
    if (!selectedAppliance) return;

    const updated: Appliance = {
      ...selectedAppliance,
      name: values.name,
      category: values.category,
      serialNumber: values.serialNumber,
      status: values.status,
      location: values.location,
      warrantyExpiry: values.warrantyExpiry,
      lastMaintenance: values.lastMaintenance,
      assignedTo: values.assignedTo?.trim() ? values.assignedTo.trim() : undefined,
    };

    setAppliances((prev) =>
      prev.map((a) => (a.id === selectedAppliance.id ? updated : a)),
    );
    setIsEditOpen(false);
    toast({
      title: "Appliance updated",
      description: "Appliance record has been updated.",
    });
  };

  const confirmDelete = () => {
    if (!selectedAppliance) return;
    const toDelete = selectedAppliance;
    setAppliances((prev) => prev.filter((a) => a.id !== toDelete.id));
    setIsDeleteOpen(false);
    setSelectedAppliance(null);
    toast({
      title: "Appliance deleted",
      description: "Appliance has been removed.",
    });
  };

  const categories = useMemo(() => {
    return [...new Set(appliances.map((a) => a.category))];
  }, [appliances]);

  const filteredAppliances = useMemo(() => {
    return appliances.filter((appliance) => {
      const matchesSearch =
        appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appliance.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || appliance.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || appliance.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [appliances, categoryFilter, searchQuery, statusFilter]);

  const operationalCount = useMemo(
    () => appliances.filter((a) => a.status === "operational").length,
    [appliances],
  );
  const needsRepairCount = useMemo(
    () => appliances.filter((a) => a.status === "needs-repair").length,
    [appliances],
  );
  const outOfServiceCount = useMemo(
    () => appliances.filter((a) => a.status === "out-of-service").length,
    [appliances],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Appliances Management</h1>
          <p className="page-subtitle">Track equipment and appliance inventory</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Appliance
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Appliance</DialogTitle>
            <DialogDescription>
              Add a new appliance record.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateAppliance)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Commercial Refrigerator CR-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CR-2024-009" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Refrigeration" {...field} />
                      </FormControl>
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
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="needs-repair">Needs Repair</SelectItem>
                          <SelectItem value="out-of-service">Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Warehouse A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastMaintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrantyExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Expiry</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
          if (!open) setSelectedAppliance(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appliance Details</DialogTitle>
            <DialogDescription>View appliance record information.</DialogDescription>
          </DialogHeader>

          {selectedAppliance && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {selectedAppliance.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedAppliance.serialNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <p className="text-foreground capitalize">
                    {selectedAppliance.status.replace("-", " ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Category</p>
                  <p className="text-foreground">{selectedAppliance.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Location</p>
                  <p className="text-foreground">{selectedAppliance.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="text-foreground">{selectedAppliance.assignedTo ?? "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Last Maintenance</p>
                  <p className="text-foreground">{new Date(selectedAppliance.lastMaintenance).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Warranty Expiry</p>
                  <p className="text-foreground">{new Date(selectedAppliance.warrantyExpiry).toLocaleDateString()}</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (!selectedAppliance) return;
                    setIsViewOpen(false);
                    openEdit(selectedAppliance);
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
          if (!open) setSelectedAppliance(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appliance</DialogTitle>
            <DialogDescription>Update appliance record details.</DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditAppliance)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Commercial Refrigerator CR-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CR-2024-009" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Refrigeration" {...field} />
                      </FormControl>
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
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="needs-repair">Needs Repair</SelectItem>
                          <SelectItem value="out-of-service">Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Warehouse A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="lastMaintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="warrantyExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Expiry</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
            <AlertDialogTitle>Delete appliance?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the appliance record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          aria-label="Appliance actions"
                        >
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openView(appliance)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(appliance)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDelete(appliance)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            {operationalCount}{" "}
            operational
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            {needsRepairCount} needs
            repair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            {outOfServiceCount} out
            of service
          </span>
        </div>
      </div>
    </div>
  );
}
