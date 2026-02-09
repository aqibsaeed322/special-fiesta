import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Globe, Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Full Name
            </label>
            <Input defaultValue="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Email Address
            </label>
            <Input defaultValue="john.doe@company.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Phone Number
            </label>
            <Input defaultValue="+1 (555) 123-4567" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Role
            </label>
            <Input defaultValue="Manager" disabled />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Task Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified about task updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Employee Updates</p>
              <p className="text-sm text-muted-foreground">
                Clock in/out notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Summary emails every Monday
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">
              Manage your security preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Current Password
            </label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                New Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Confirm New Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="outline">Change Password</Button>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Language & Region</h3>
            <p className="text-sm text-muted-foreground">
              Set your preferred language and timezone
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Language
            </label>
            <Input defaultValue="English (US)" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Timezone
            </label>
            <Input defaultValue="Eastern Time (ET)" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
