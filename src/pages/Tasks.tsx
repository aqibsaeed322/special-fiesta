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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "active" | "pending" | "completed";
  dueDate: string;
  location: string;
  createdAt: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Site inspection at Downtown Office",
    description: "Complete safety inspection and report findings",
    assignee: "Mike Johnson",
    priority: "high",
    status: "active",
    dueDate: "2024-02-02",
    location: "Downtown Office",
    createdAt: "2024-01-28",
  },
  {
    id: "2",
    title: "Equipment maintenance check",
    description: "Routine maintenance for all HVAC units",
    assignee: "Sarah Williams",
    priority: "medium",
    status: "pending",
    dueDate: "2024-02-02",
    location: "Warehouse A",
    createdAt: "2024-01-29",
  },
  {
    id: "3",
    title: "Client meeting preparation",
    description: "Prepare presentation materials for quarterly review",
    assignee: "David Chen",
    priority: "high",
    status: "active",
    dueDate: "2024-02-03",
    location: "Main Office",
    createdAt: "2024-01-30",
  },
  {
    id: "4",
    title: "Vehicle fleet review",
    description: "Annual inspection of all company vehicles",
    assignee: "Emma Davis",
    priority: "low",
    status: "completed",
    dueDate: "2024-02-01",
    location: "Garage",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    title: "Safety training session",
    description: "Conduct mandatory safety training for new hires",
    assignee: "Tom Wilson",
    priority: "medium",
    status: "pending",
    dueDate: "2024-02-05",
    location: "Training Room",
    createdAt: "2024-01-31",
  },
  {
    id: "6",
    title: "Inventory audit",
    description: "Complete monthly inventory count and reconciliation",
    assignee: "Lisa Anderson",
    priority: "medium",
    status: "active",
    dueDate: "2024-02-04",
    location: "Warehouse A",
    createdAt: "2024-01-31",
  },
];

const priorityStyles = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const statusStyles = {
  active: "status-active",
  pending: "status-pending",
  completed: "status-completed",
};

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignee: z.string().min(1, "Assignee is required"),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["active", "pending", "completed"]),
  dueDate: z.string().min(1, "Due date is required"),
  location: z.string().min(1, "Location is required"),
});

type CreateTaskValues = z.infer<typeof createTaskSchema>;

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
      location: "",
    },
  });

  const onCreateTask = (values: CreateTaskValues) => {
    const now = new Date();
    const newTask: Task = {
      id: (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
        : String(Date.now()),
      title: values.title,
      description: values.description,
      assignee: values.assignee,
      priority: values.priority,
      status: values.status,
      dueDate: values.dueDate,
      location: values.location,
      createdAt: now.toISOString().slice(0, 10),
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsCreateOpen(false);
    form.reset();
    toast({
      title: "Task created",
      description: "Your task has been added to the list.",
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">Create, assign, and track all tasks</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Add a new task and assign it to a team member.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreateTask)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description"
                          className="min-h-[90px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sarah Williams" {...field} />
                      </FormControl>
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
                        <Input placeholder="e.g. Main Office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks or assignee..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Location</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr
                key={task.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td>
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {task.assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-foreground">{task.assignee}</span>
                  </div>
                </td>
                <td>
                  <Badge
                    variant="outline"
                    className={cn("text-xs border", priorityStyles[task.priority])}
                  >
                    {task.priority}
                  </Badge>
                </td>
                <td>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", statusStyles[task.status])}
                  >
                    {task.status}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{task.location}</span>
                  </div>
                </td>
                <td>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            {tasks.filter((t) => t.status === "completed").length} completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {tasks.filter((t) => t.status === "active").length} active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            {tasks.filter((t) => t.status === "pending").length} pending
          </span>
        </div>
      </div>
    </div>
  );
}
