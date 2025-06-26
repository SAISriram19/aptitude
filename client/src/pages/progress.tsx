import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, TrendingUp, Target, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/lib/questions";
import { localStorage_helper } from "@/lib/storage";

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const currentUserId = localStorage_helper.getCurrentUser();

  const { data: stats } = useQuery({
    queryKey: [`/api/stats/${currentUserId}`],
    staleTime: 0,
  });

  const userStats = stats || localStorage_helper.getUserStats(currentUserId);

  const overallAccuracy = userStats.totalAttempted > 0 
    ? Math.round((userStats.totalCorrect / userStats.totalAttempted) * 100)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg mx-auto px-4 pb-20 pt-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4 -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and performance
          </p>
        </div>

        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {userStats.totalAttempted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Questions Attempted
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-success">
                  {overallAccuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Overall Accuracy
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const categoryStats = userStats.categoryStats?.[key];
                const attempted = categoryStats?.attempted || 0;
                const correct = categoryStats?.correct || 0;
                const avgTime = categoryStats?.avgTime || 0;
                const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{category.name}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {attempted} questions
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Accuracy</span>
                          <span>{accuracy}%</span>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                      </div>
                      
                      {avgTime > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(avgTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/question?mode=casual")}
              >
                <Target className="w-4 h-4 mr-2" />
                Start Casual Practice
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/categories")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Practice by Category
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/bookmarks")}
              >
                <Award className="w-4 h-4 mr-2" />
                Review Bookmarked Questions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
