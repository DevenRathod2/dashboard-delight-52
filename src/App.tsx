import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Dashboard from "./pages/Dashboard.tsx";
import Events from "./pages/Index.tsx";
import Clients from "./pages/Clients.tsx";
import Leads from "./pages/Leads.tsx";
import Billing from "./pages/Billing.tsx";
import Studio from "./pages/Studio.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import CollectionPhotos from "./pages/CollectionPhotos.tsx";
import Settings from "./pages/Settings.tsx";
import FaceRecognition from "./pages/studio/FaceRecognition.tsx";
import SmartSelections from "./pages/studio/SmartSelections.tsx";
import MotionReels from "./pages/studio/MotionReels.tsx";
import ColorGrading from "./pages/studio/ColorGrading.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/collections/:collectionId" element={<CollectionPhotos />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/face-recognition" element={<FaceRecognition />} />
          <Route path="/studio/smart-selections" element={<SmartSelections />} />
          <Route path="/studio/motion-reels" element={<MotionReels />} />
          <Route path="/studio/color-grading" element={<ColorGrading />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
