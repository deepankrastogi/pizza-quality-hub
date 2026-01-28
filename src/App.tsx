import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Classification from "./pages/Classification";
import ReClassification from "./pages/ReClassification";
import QualityScoring from "./pages/QualityScoring";
import BrowseImages from "./pages/BrowseImages";
import QualityAnalytics from "./pages/QualityAnalytics";
import TrainingAnalytics from "./pages/TrainingAnalytics";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/classify"
            element={
              <AppLayout>
                <Classification />
              </AppLayout>
            }
          />
          <Route
            path="/reclassify"
            element={
              <AppLayout>
                <ReClassification />
              </AppLayout>
            }
          />
          <Route
            path="/scoring"
            element={
              <AppLayout>
                <QualityScoring />
              </AppLayout>
            }
          />
          <Route
            path="/browse"
            element={
              <AppLayout>
                <BrowseImages />
              </AppLayout>
            }
          />
          <Route
            path="/analytics/quality"
            element={
              <AppLayout>
                <QualityAnalytics />
              </AppLayout>
            }
          />
          <Route
            path="/analytics/training"
            element={
              <AppLayout>
                <TrainingAnalytics />
              </AppLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AppLayout>
                <UserManagement />
              </AppLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
