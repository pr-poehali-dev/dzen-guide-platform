import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import MapPage from "./pages/MapPage";
import Cabinet from "./pages/Cabinet";
import StudentDay from "./pages/StudentDay";
import Archipelago from "./pages/Archipelago";
import Welcome, { hasSeenWelcome } from "./pages/Welcome";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const HomeOrWelcome = () => {
  return hasSeenWelcome() ? <Index /> : <Navigate to="/welcome" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeOrWelcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/student-day" element={<StudentDay />} />
          <Route path="/archipelago" element={<Archipelago />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;