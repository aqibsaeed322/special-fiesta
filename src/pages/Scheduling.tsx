import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleEvent {
  id: string;
  title: string;
  assignee: string;
  location: string;
  startTime: string;
  endTime: string;
  type: "task" | "meeting" | "break" | "training";
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

const scheduleEvents: Record<string, ScheduleEvent[]> = {
  Mon: [
    {
      id: "1",
      title: "Site Inspection",
      assignee: "Mike Johnson",
      location: "Downtown Office",
      startTime: "09:00",
      endTime: "11:00",
      type: "task",
    },
    {
      id: "2",
      title: "Team Meeting",
      assignee: "All Team",
      location: "Main Office",
      startTime: "14:00",
      endTime: "15:00",
      type: "meeting",
    },
  ],
  Tue: [
    {
      id: "3",
      title: "Equipment Check",
      assignee: "Sarah Williams",
      location: "Warehouse A",
      startTime: "08:00",
      endTime: "10:00",
      type: "task",
    },
    {
      id: "4",
      title: "Safety Training",
      assignee: "Tom Wilson",
      location: "Training Room",
      startTime: "13:00",
      endTime: "16:00",
      type: "training",
    },
  ],
  Wed: [
    {
      id: "5",
      title: "Client Meeting",
      assignee: "David Chen",
      location: "Main Office",
      startTime: "10:00",
      endTime: "12:00",
      type: "meeting",
    },
  ],
  Thu: [
    {
      id: "6",
      title: "Fleet Review",
      assignee: "Emma Davis",
      location: "Garage",
      startTime: "09:00",
      endTime: "12:00",
      type: "task",
    },
    {
      id: "7",
      title: "Inventory Audit",
      assignee: "Lisa Anderson",
      location: "Warehouse A",
      startTime: "14:00",
      endTime: "17:00",
      type: "task",
    },
  ],
  Fri: [
    {
      id: "8",
      title: "Weekly Review",
      assignee: "All Team",
      location: "Main Office",
      startTime: "15:00",
      endTime: "16:00",
      type: "meeting",
    },
  ],
  Sat: [],
  Sun: [],
};

const typeColors = {
  task: "bg-primary/10 border-primary/30 text-primary",
  meeting: "bg-info/10 border-info/30 text-info",
  break: "bg-muted border-muted-foreground/30 text-muted-foreground",
  training: "bg-warning/10 border-warning/30 text-warning",
};

export default function Scheduling() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return weekDays.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Scheduling</h1>
          <p className="page-subtitle">Plan and manage team schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Header */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const prev = new Date(currentWeek);
                prev.setDate(prev.getDate() - 7);
                setCurrentWeek(prev);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-foreground">
              {weekDates[0].toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => {
                const next = new Date(currentWeek);
                next.setDate(next.getDate() + 7);
                setCurrentWeek(next);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
        </div>

        {/* Week View */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-4 text-xs font-medium text-muted-foreground uppercase">
                Time
              </div>
              {weekDays.map((day, index) => {
                const date = weekDates[index];
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={day}
                    className={cn(
                      "p-4 text-center border-l border-border",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {day}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-semibold mt-1",
                        isToday ? "text-primary" : "text-foreground"
                      )}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="divide-y divide-border">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 min-h-[80px]">
                  <div className="p-2 text-xs text-muted-foreground text-right pr-4 pt-0 -mt-2">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const events = scheduleEvents[day]?.filter((event) => {
                      const startHour = parseInt(event.startTime.split(":")[0]);
                      return startHour === hour;
                    });
                    const isToday =
                      weekDates[dayIndex].toDateString() === today.toDateString();

                    return (
                      <div
                        key={day}
                        className={cn(
                          "border-l border-border p-1 relative",
                          isToday && "bg-primary/5"
                        )}
                      >
                        {events?.map((event) => {
                          const startHour = parseInt(
                            event.startTime.split(":")[0]
                          );
                          const endHour = parseInt(event.endTime.split(":")[0]);
                          const duration = endHour - startHour;

                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "absolute left-1 right-1 p-2 rounded-lg border text-xs cursor-pointer transition-all hover:shadow-md",
                                typeColors[event.type]
                              )}
                              style={{
                                height: `${duration * 80 - 8}px`,
                              }}
                            >
                              <p className="font-medium truncate">
                                {event.title}
                              </p>
                              <div className="flex items-center gap-1 mt-1 opacity-80">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                              {duration > 1 && (
                                <>
                                  <div className="flex items-center gap-1 mt-1 opacity-80">
                                    <User className="w-3 h-3" />
                                    <span className="truncate">
                                      {event.assignee}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1 opacity-80">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">
                                      {event.location}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-muted-foreground">Event Types:</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-primary" />
            Task
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-info" />
            Meeting
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-warning" />
            Training
          </span>
        </div>
      </div>
    </div>
  );
}
