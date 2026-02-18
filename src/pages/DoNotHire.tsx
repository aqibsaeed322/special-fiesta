import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Search } from "lucide-react";

interface DoNotHireEntry {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  reason: string;
  incidentNotes: string;
  createdAt: string;
}

const initialEntries: DoNotHireEntry[] = [
  {
    id: "1",
    fullName: "Alex Turner",
    phone: "+1 555 000 1122",
    email: "alex.turner@example.com",
    reason: "Policy violation",
    incidentNotes: "Repeated safety protocol violations during site operations.",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    fullName: "Samantha Lee",
    phone: "+1 555 000 3344",
    email: "samantha.lee@example.com",
    reason: "Misconduct",
    incidentNotes: "Unprofessional behavior reported by multiple team members.",
    createdAt: "2024-02-01",
  },
];

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  reason: z.string().min(1, "Reason is required"),
  incidentNotes: z.string().min(1, "Incident notes are required"),
});

type Values = z.infer<typeof schema>;

export default function DoNotHire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DoNotHireEntry[]>(initialEntries);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      reason: "",
      incidentNotes: "",
    },
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      return (
        e.fullName.toLowerCase().includes(q) ||
        (e.phone ?? "").toLowerCase().includes(q) ||
        (e.email ?? "").toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q)
      );
    });
  }, [entries, searchQuery]);

  const onSubmit = (values: Values) => {
    const now = new Date();
    const entry: DoNotHireEntry = {
      id: (typeof crypto !== "undefined" && "randomUUID" in crypto) ? crypto.randomUUID() : String(Date.now()),
      fullName: values.fullName,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      email: values.email?.trim() ? values.email.trim() : undefined,
      reason: values.reason,
      incidentNotes: values.incidentNotes,
      createdAt: now.toISOString().slice(0, 10),
    };

    setEntries((prev) => [entry, ...prev]);
    setOpen(false);
    form.reset();
    toast({
      title: "Entry added",
      description: "Do Not Hire record has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Do Not Hire List</h1>
          <p className="page-subtitle">Track and review restricted candidates</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, email, or reason..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reason</th>
              <th>Contact</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, index) => (
              <tr
                key={e.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td>
                  <div>
                    <p className="font-medium text-foreground">{e.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {e.incidentNotes}
                    </p>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-foreground">{e.reason}</span>
                </td>
                <td>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{e.phone ?? "—"}</p>
                    <p>{e.email ?? "—"}</p>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Do Not Hire Entry</DialogTitle>
            <DialogDescription>
              Save an incident record to prevent future hiring.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Candidate name" {...field} />
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
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input placeholder="Why is this candidate restricted?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incidentNotes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Incident Notes</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[120px]" placeholder="Details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
