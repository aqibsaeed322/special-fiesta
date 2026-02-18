import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Employees from "./pages/Employees";
import Scheduling from "./pages/Scheduling";
import TimeTracking from "./pages/TimeTracking";
import Vehicles from "./pages/Vehicles";
import Appliances from "./pages/Appliances";
import Locations from "./pages/Locations";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import DoNotHire from "./pages/DoNotHire";
import OnboardingMonitoring from "./pages/OnboardingMonitoring";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/appliances" element={<Appliances />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/do-not-hire" element={<DoNotHire />} />
            <Route path="/onboarding" element={<OnboardingMonitoring />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
