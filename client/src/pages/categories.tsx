import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  ChevronLeft, Calculator, MessageSquare, Brain, Shapes, TrendingUp, 
  BarChart, Lightbulb, Box, Settings, Users, GitBranch, ArrowUpRight,
  ArrowDownLeft, Search, Link as LinkIcon, ShieldCheck, Hash, FileText,
  Puzzle, Eye, Shuffle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/questions";
import { localStorage_helper } from "@/lib/storage";

const categoryIcons = {
  numerical: Calculator,
  verbal: MessageSquare,
  logical: Brain,
  abstract: Shapes,
  quantitative: TrendingUp,
  datainterpretation: BarChart,
  criticalthinking: Lightbulb,
  spatial: Box,
  mechanical: Settings,
  situational: Users,
  diagrammatic: GitBranch,
  inductive: ArrowUpRight,
  deductive: ArrowDownLeft,
  analytical: Search,
  verbalanalogies: LinkIcon,
  errorchecking: ShieldCheck,
  numbersequences: Hash,
  wordproblems: FileText,
  logicalpuzzles: Puzzle,
  patternrecognition: Eye,
};

export default function Categories() {
  const [, navigate] = useLocation();
  const currentUserId = localStorage_helper.getCurrentUser();

  const { data: stats } = useQuery({
    queryKey: [`/api/stats/${currentUserId}`],
    staleTime: 0,
  });

  const { data: questions } = useQuery({
    queryKey: ["/api/questions"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const userStats = stats || localStorage_helper.getUserStats(currentUserId);
  const allQuestions = Array.isArray(questions) ? questions : [];

  const getCategoryProgress = (category: string) => {
    const categoryQuestions = allQuestions.filter((q: any) => q.category === category);
    const categoryStats = (userStats as any)?.categoryStats?.[category];
    const attempted = categoryStats?.attempted || 0;
    const total = categoryQuestions.length;
    return total > 0 ? Math.round((attempted / total) * 100) : 0;
  };

  const getCategoryCount = (category: string) => {
    if (!Array.isArray(allQuestions)) return 0;
    return allQuestions.filter((q: any) => q.category === category).length;
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
          <h2 className="text-2xl font-bold mb-2">Select Category</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose topics you want to practice</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 space-y-3">
          <Link href="/category-selector">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shuffle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Custom Practice Session</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose multiple categories and practice mode
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            const progress = getCategoryProgress(key);
            const questionCount = getCategoryCount(key);
            
            return (
              <Link key={key} href={`/question?category=${key}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-8 h-8 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 text-${category.color}-600 dark:text-${category.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight mb-1">{category.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{questionCount} questions</span>
                        <span className="text-gray-500">{progress}% done</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`bg-${category.color}-600 h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
