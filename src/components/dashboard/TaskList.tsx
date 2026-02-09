import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, User, MoreHorizontal } from "lucide-react";

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "active" | "pending" | "completed";
  dueDate: string;
  location?: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Site inspection at Downtown Office",
    assignee: "Mike Johnson",
    priority: "high",
    status: "active",
    dueDate: "Today, 2:00 PM",
    location: "Downtown Office",
  },
  {
    id: "2",
    title: "Equipment maintenance check",
    assignee: "Sarah Williams",
    priority: "medium",
    status: "pending",
    dueDate: "Today, 4:30 PM",
    location: "Warehouse A",
  },
  {
    id: "3",
    title: "Client meeting preparation",
    assignee: "David Chen",
    priority: "high",
    status: "active",
    dueDate: "Tomorrow, 9:00 AM",
    location: "Main Office",
  },
  {
    id: "4",
    title: "Vehicle fleet review",
    assignee: "Emma Davis",
    priority: "low",
    status: "completed",
    dueDate: "Yesterday",
    location: "Garage",
  },
  {
    id: "5",
    title: "Safety training session",
    assignee: "Tom Wilson",
    priority: "medium",
    status: "pending",
    dueDate: "Feb 5, 10:00 AM",
    location: "Training Room",
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

export function TaskList() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Tasks</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="divide-y divide-border">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="px-6 py-4 hover:bg-muted/30 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground truncate">
                    {task.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={cn("text-xs border", priorityStyles[task.priority])}
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className={cn("text-xs", statusStyles[task.status])}
                >
                  {task.status}
                </Badge>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
