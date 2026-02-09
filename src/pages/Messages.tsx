import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Search,
  Bell,
  MessageSquare,
  Users,
  Plus,
  Check,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  recipient: string;
  content: string;
  timestamp: string;
  type: "direct" | "broadcast";
  status: "sent" | "delivered" | "read";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success";
  read: boolean;
}

const messages: Message[] = [
  {
    id: "1",
    sender: "You",
    senderAvatar: "JD",
    recipient: "Mike Johnson",
    content: "Please complete the site inspection by end of day today.",
    timestamp: "10:30 AM",
    type: "direct",
    status: "read",
  },
  {
    id: "2",
    sender: "You",
    senderAvatar: "JD",
    recipient: "All Employees",
    content:
      "Reminder: Team meeting tomorrow at 2 PM in the main conference room.",
    timestamp: "9:15 AM",
    type: "broadcast",
    status: "delivered",
  },
  {
    id: "3",
    sender: "You",
    senderAvatar: "JD",
    recipient: "Sarah Williams",
    content: "Great job on the equipment maintenance report!",
    timestamp: "Yesterday",
    type: "direct",
    status: "read",
  },
  {
    id: "4",
    sender: "You",
    senderAvatar: "JD",
    recipient: "David Chen",
    content: "Can you prepare the client presentation for Monday?",
    timestamp: "Yesterday",
    type: "direct",
    status: "read",
  },
];

const notifications: Notification[] = [
  {
    id: "1",
    title: "Task Completed",
    message: "Mike Johnson completed the site inspection task.",
    timestamp: "5 min ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "Maintenance Alert",
    message: "Vehicle #3 is due for scheduled maintenance.",
    timestamp: "1 hour ago",
    type: "warning",
    read: false,
  },
  {
    id: "3",
    title: "New Employee Clock In",
    message: "Emma Davis clocked in at Garage location.",
    timestamp: "2 hours ago",
    type: "info",
    read: true,
  },
  {
    id: "4",
    title: "Schedule Updated",
    message: "Tomorrow's schedule has been modified.",
    timestamp: "3 hours ago",
    type: "info",
    read: true,
  },
];

const notificationTypeStyles = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const statusIcons = {
  sent: Clock,
  delivered: Check,
  read: Check,
};

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">(
    "messages"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Messages & Notifications</h1>
          <p className="page-subtitle">
            Communicate with your team and view alerts
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("messages")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
            activeTab === "messages"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Messages
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="w-4 h-4" />
          Notifications
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge
              variant="destructive"
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications.filter((n) => !n.read).length}
            </Badge>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message/Notification List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden divide-y divide-border">
            {activeTab === "messages" ? (
              messages.map((message, index) => {
                const StatusIcon = statusIcons[message.status];
                return (
                  <div
                    key={message.id}
                    className="p-4 hover:bg-muted/30 transition-colors cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm flex-shrink-0">
                        {message.senderAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              To: {message.recipient}
                            </span>
                            {message.type === "broadcast" && (
                              <Badge
                                variant="secondary"
                                className="text-xs gap-1"
                              >
                                <Users className="w-3 h-3" />
                                Broadcast
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <StatusIcon
                            className={cn(
                              "w-3 h-3",
                              message.status === "read" && "text-primary"
                            )}
                          />
                          <span className="capitalize">{message.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/30 transition-colors cursor-pointer animate-fade-in",
                    !notification.read && "bg-primary/5"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        notificationTypeStyles[notification.type]
                      )}
                    >
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">
                          {notification.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Send */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border shadow-card p-6 sticky top-8">
            <h3 className="font-semibold text-foreground mb-4">Quick Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  To
                </label>
                <Input placeholder="Select recipient or all employees" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[120px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <Button className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
