import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Worm, Menu, Zap, BarChart3, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { localStorage_helper } from "@/lib/storage";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { toggleTheme } = useTheme();
  const currentUserId = localStorage_helper.getCurrentUser();
  
  const { data: stats } = useQuery({
    queryKey: [`/api/stats/${currentUserId}`],
    staleTime: 0,
  });

  const userStats = stats || localStorage_helper.getUserStats(currentUserId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AptitudePro</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                🌙
              </Button>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-20 pt-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose your learning mode to get started</p>
        </div>

        {/* Mode Selection Cards */}
        <div className="space-y-4 mb-8">
          <Link href="/question?mode=casual">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Worm className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Quick Practice</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Random questions from all 20 categories
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/category-selector">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Custom Session</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose specific categories and practice mode
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/categories">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Menu className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Browse Categories</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Explore all 20 aptitude test categories
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {(userStats as any)?.totalAttempted || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Attempted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {(userStats as any)?.totalCorrect || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {(userStats as any)?.totalBookmarked || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bookmarked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
