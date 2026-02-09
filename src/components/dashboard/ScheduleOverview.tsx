import { MapPin, Users } from "lucide-react";

interface ScheduleItem {
  id: string;
  location: string;
  assignedCount: number;
  totalSlots: number;
  timeRange: string;
  tasks: number;
}

const schedules: ScheduleItem[] = [
  {
    id: "1",
    location: "Downtown Office",
    assignedCount: 4,
    totalSlots: 5,
    timeRange: "8:00 AM - 5:00 PM",
    tasks: 8,
  },
  {
    id: "2",
    location: "Warehouse A",
    assignedCount: 3,
    totalSlots: 4,
    timeRange: "7:00 AM - 4:00 PM",
    tasks: 5,
  },
  {
    id: "3",
    location: "Main Office",
    assignedCount: 6,
    totalSlots: 6,
    timeRange: "9:00 AM - 6:00 PM",
    tasks: 12,
  },
  {
    id: "4",
    location: "Garage",
    assignedCount: 2,
    totalSlots: 3,
    timeRange: "7:30 AM - 4:30 PM",
    tasks: 3,
  },
];

export function ScheduleOverview() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Today's Schedule</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View Calendar
        </button>
      </div>
      <div className="p-4 grid gap-3">
        {schedules.map((schedule, index) => (
          <div
            key={schedule.id}
            className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">
                  {schedule.location}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {schedule.timeRange}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {schedule.assignedCount}/{schedule.totalSlots} assigned
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {schedule.tasks} tasks
                </span>
              </div>
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${(schedule.assignedCount / schedule.totalSlots) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
