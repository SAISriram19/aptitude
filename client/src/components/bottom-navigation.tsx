import { Link, useLocation } from "wouter";
import { Home, List, Bookmark, TrendingUp } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/categories", icon: List, label: "Categories" },
  { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}>
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
