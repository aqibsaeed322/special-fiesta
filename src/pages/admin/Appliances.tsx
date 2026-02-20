import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Badge } from "@/components/admin/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/admin/ui/dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Wrench,
} from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  type: "residential" | "commercial";
  location: string;
  purchaseDate: string;
  warrantyUntil: string;
  status: "active" | "inactive";
  tagPhotoFileName?: string;
}

const APPLIANCES_STORAGE_KEY = "appliances";

const seedAppliances: Appliance[] = [
  {
    id: "APP-001",
    name: "Dishwasher - Kitchen 1",
    type: "residential",
    location: "Residential Complex D",
    purchaseDate: "2023-02-10",
    warrantyUntil: "2025-02-10",
    status: "active",
    tagPhotoFileName: "tag_app_001.jpg",
  },
  {
    id: "APP-002",
    name: "HVAC Unit - Floor 3",
    type: "commercial",
    location: "Building A - Corporate Office",
    purchaseDate: "2022-05-01",
    warrantyUntil: "2026-05-01",
    status: "active",
    tagPhotoFileName: "hvac_tag.png",
  },
  {
    id: "APP-003",
    name: "Generator - Backup",
    type: "commercial",
    location: "Warehouse C",
    purchaseDate: "2020-09-15",
    warrantyUntil: "2023-09-15",
    status: "inactive",
    tagPhotoFileName: "",
  },
];

const statusClasses = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
};

const typeClasses = {
  residential: "bg-success/10 text-success",
  commercial: "bg-accent/10 text-accent",
} as const;

export default function Appliances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [selected, setSelected] = useState<Appliance | null>(null);

  const [appliancesList, setAppliancesList] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem(APPLIANCES_STORAGE_KEY);
    if (!saved) return seedAppliances.filter(Boolean);
    try {
      const parsed = JSON.parse(saved) as unknown;
      if (Array.isArray(parsed)) return parsed as Appliance[];
    } catch {
      // ignore
    }
    return seedAppliances.filter(Boolean);
  });

  const [formData, setFormData] = useState({
    name: "",
    type: "commercial" as Appliance["type"],
    location: "",
    purchaseDate: "",
    warrantyUntil: "",
    status: "active" as Appliance["status"],
    tagPhotoFileName: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "commercial" as Appliance["type"],
    location: "",
    purchaseDate: "",
    warrantyUntil: "",
    status: "active" as Appliance["status"],
    tagPhotoFileName: "",
  });

  useEffect(() => {
    localStorage.setItem(APPLIANCES_STORAGE_KEY, JSON.stringify(appliancesList));
  }, [appliancesList]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return appliancesList;
    return appliancesList.filter((a) => {
      return (
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    });
  }, [appliancesList, searchQuery]);

  const handleAdd = () => {
    if (!formData.name || !formData.location) return;
    const next: Appliance = {
      id: `APP-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      purchaseDate: formData.purchaseDate,
      warrantyUntil: formData.warrantyUntil,
      status: formData.status,
      tagPhotoFileName: formData.tagPhotoFileName || "",
    };
    setAppliancesList((prev) => [next, ...prev]);
    setAddOpen(false);
    setFormData({
      name: "",
      type: "commercial",
      location: "",
      purchaseDate: "",
      warrantyUntil: "",
      status: "active",
      tagPhotoFileName: "",
    });
  };

  const onView = (a: Appliance) => {
    setSelected(a);
    setViewOpen(true);
  };

  const onEdit = (a: Appliance) => {
    setSelected(a);
    setEditFormData({
      name: a.name,
      type: a.type,
      location: a.location,
      purchaseDate: a.purchaseDate,
      warrantyUntil: a.warrantyUntil,
      status: a.status,
      tagPhotoFileName: a.tagPhotoFileName || "",
    });
    setEditOpen(true);
  };

  const onSaveEdit = () => {
    if (!selected) return;
    if (!editFormData.name || !editFormData.location) return;
    setAppliancesList((prev) =>
      prev.map((a) =>
        a.id !== selected.id
          ? a
          : {
              ...a,
              name: editFormData.name,
              type: editFormData.type,
              location: editFormData.location,
              purchaseDate: editFormData.purchaseDate,
              warrantyUntil: editFormData.warrantyUntil,
              status: editFormData.status,
              tagPhotoFileName: editFormData.tagPhotoFileName || "",
            }
      )
    );
    setEditOpen(false);
    setSelected(null);
  };

  const onDeactivate = (a: Appliance) => {
    setSelected(a);
    setDeactivateOpen(true);
  };

  const confirmToggle = () => {
    if (!selected) return;
    setAppliancesList((prev) =>
      prev.map((a) =>
        a.id !== selected.id
          ? a
          : {
              ...a,
              status: a.status === "inactive" ? "active" : "inactive",
            }
      )
    );
    setDeactivateOpen(false);
    setSelected(null);
  };

  return (
    <AdminLayout>
      {/* Mobile-first padding and spacing */}
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Appliances Management
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl">
              Track appliances, warranties, and assignments by location.
            </p>
          </div>

          {/* Add Button Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto mt-2 sm:mt-0">
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Appliance</span>
              </Button>
            </DialogTrigger>
            
            {/* Add Dialog - Responsive */}
            <DialogContent className="w-[95vw] max-w-2xl mx-auto p-4 sm:p-6">
              <DialogHeader className="space-y-1.5 sm:space-y-2">
                <DialogTitle className="text-lg sm:text-xl">Add Appliance</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Create a new appliance record
                </DialogDescription>
              </DialogHeader>
              
              <form className="space-y-4 sm:space-y-5">
                {/* Name & Location - Stack on mobile, row on tablet+ */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Name *</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                      placeholder="HVAC Unit - Floor 2"
                      required
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Location *</label>
                    <input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                      placeholder="Building A - Corporate Office"
                      required
                    />
                  </div>
                </div>

                {/* Tag Photo */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">
                    Tag Photo (File Name)
                  </label>
                  <input
                    value={formData.tagPhotoFileName}
                    onChange={(e) => setFormData({ ...formData, tagPhotoFileName: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                    placeholder="e.g., tag_photo.jpg"
                  />
                </div>

                {/* Type, Purchase, Warranty - Stack on mobile, grid on tablet+ */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as Appliance["type"] })
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base bg-white"
                    >
                      <option value="commercial">Commercial</option>
                      <option value="residential">Residential</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Warranty Until</label>
                    <input
                      type="date"
                      value={formData.warrantyUntil}
                      onChange={(e) => setFormData({ ...formData, warrantyUntil: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-xs sm:text-sm font-medium mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as Appliance["status"] })
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm sm:text-base bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
              
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setAddOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdd} 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto order-1 sm:order-2"
                >
                  <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                  Add Appliance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Card */}
        <Card className="shadow-soft border-0 sm:border">
          <CardContent className="p-3 sm:p-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search appliances..."
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appliances Table Card */}
        <Card className="shadow-soft border-0 sm:border">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
              Appliances ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Mobile View - Cards */}
            <div className="block sm:hidden space-y-3 p-4">
              {filtered.map((a) => (
                <div key={a.id} className="bg-white rounded-lg border p-4 space-y-3">
                  {/* Header with Icon and Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Wrench className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.id}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(a)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(a)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeactivate(a)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {a.status === "inactive" ? "Activate" : "Deactivate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge className={`${typeClasses[a.type]} mt-1`} variant="secondary">
                        {a.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={`${statusClasses[a.status]} mt-1`} variant="secondary">
                        {a.status}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm mt-1 truncate">{a.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Warranty</p>
                      <p className="text-sm mt-1">{a.warrantyUntil || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No appliances found</p>
                </div>
              )}
            </div>

            {/* Tablet/Desktop View - Table */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Appliance</TableHead>
                    <TableHead className="text-xs md:text-sm">Type</TableHead>
                    <TableHead className="text-xs md:text-sm">Location</TableHead>
                    <TableHead className="text-xs md:text-sm">Warranty</TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                    <TableHead className="text-right text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm md:text-base truncate max-w-[200px] lg:max-w-none">
                              {a.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{a.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${typeClasses[a.type]} text-xs md:text-sm`} variant="secondary">
                          {a.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] lg:max-w-none">
                        <p className="text-sm md:text-base truncate">{a.location}</p>
                      </TableCell>
                      <TableCell className="text-sm md:text-base text-muted-foreground">
                        {a.warrantyUntil || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusClasses[a.status]} text-xs md:text-sm`} variant="secondary">
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(a)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(a)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeactivate(a)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {a.status === "inactive" ? "Activate" : "Deactivate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Details Dialog - Responsive */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto p-4 sm:p-6">
          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Appliance Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b pb-3 sm:pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{selected.id}</p>
                <p className="text-lg sm:text-xl font-semibold break-words">{selected.name}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Type</label>
                  <div>
                    <Badge className={`${typeClasses[selected.type]} text-xs sm:text-sm`} variant="secondary">
                      {selected.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Status</label>
                  <div>
                    <Badge className={`${statusClasses[selected.status]} text-xs sm:text-sm`} variant="secondary">
                      {selected.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Location</label>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">
                    {selected.location}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Purchase Date</label>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {selected.purchaseDate || "—"}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Warranty Until</label>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {selected.warrantyUntil || "—"}
                  </p>
                </div>
                
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">Tag Photo (File)</label>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">
                    {selected.tagPhotoFileName ? selected.tagPhotoFileName : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 sm:mt-6">
            <Button onClick={() => setViewOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Responsive */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto p-4 sm:p-6">
          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="text-lg sm:text-xl">Edit Appliance</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update appliance information and save changes
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <form className="space-y-4 sm:space-y-5">
              {/* Name & Location */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Name *</label>
                  <input
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Location *</label>
                  <input
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Tag Photo */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5">
                  Tag Photo (File Name)
                </label>
                <input
                  value={editFormData.tagPhotoFileName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, tagPhotoFileName: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                />
              </div>

              {/* Type, Purchase, Warranty */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, type: e.target.value as Appliance["type"] })
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base bg-white"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                  </select>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Purchase Date</label>
                  <input
                    type="date"
                    value={editFormData.purchaseDate}
                    onChange={(e) => setEditFormData({ ...editFormData, purchaseDate: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Warranty Until</label>
                  <input
                    type="date"
                    value={editFormData.warrantyUntil}
                    onChange={(e) => setEditFormData({ ...editFormData, warrantyUntil: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value as Appliance["status"] })
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm sm:text-base bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </form>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button 
              variant="outline" 
              onClick={() => setEditOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSaveEdit} 
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto order-1 sm:order-2"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate Dialog - Responsive */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="text-base sm:text-lg text-destructive">
              {selected?.status === "inactive" ? "Activate Appliance" : "Deactivate Appliance"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selected?.status === "inactive"
                ? "This appliance will be marked as active again."
                : "This appliance will be marked as inactive."}
            </DialogDescription>
          </DialogHeader>
          
          {selected && (
            <div className="rounded-md bg-muted p-3 sm:p-4 text-xs sm:text-sm mt-2">
              <p className="font-medium break-words">{selected.name}</p>
              <p className="text-muted-foreground text-xs sm:text-sm break-words">{selected.id}</p>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button 
              variant="outline" 
              onClick={() => setDeactivateOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmToggle}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {selected?.status === "inactive" ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}