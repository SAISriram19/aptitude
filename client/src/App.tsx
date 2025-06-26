import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNavigation } from "@/components/bottom-navigation";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import CategorySelector from "@/pages/category-selector";
import QuestionPage from "@/pages/question";
import Bookmarks from "@/pages/bookmarks";
import ProgressPage from "@/pages/progress";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={Categories} />
        <Route path="/category-selector" component={CategorySelector} />
        <Route path="/question" component={QuestionPage} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route path="/progress" component={ProgressPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
