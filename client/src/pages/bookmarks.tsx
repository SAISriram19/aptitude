import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, BookmarkX, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryInfo, getDifficultyInfo } from "@/lib/questions";
import { localStorage_helper } from "@/lib/storage";

export default function Bookmarks() {
  const [, navigate] = useLocation();
  const currentUserId = localStorage_helper.getCurrentUser();

  const { data: bookmarkedQuestions } = useQuery({
    queryKey: [`/api/bookmarks/${currentUserId}`],
    staleTime: 0,
  });

  // Fallback to local storage for offline mode
  const { data: allQuestions } = useQuery({
    queryKey: ["/api/questions"],
    staleTime: 5 * 60 * 1000,
  });

  const localBookmarks = localStorage_helper.getBookmarks(currentUserId);
  const offlineBookmarkedQuestions = allQuestions?.filter((q: any) => 
    localBookmarks.includes(q.id)
  ) || [];

  const questions = bookmarkedQuestions || offlineBookmarkedQuestions;

  const handleRemoveBookmark = async (questionId: number) => {
    localStorage_helper.toggleBookmark(currentUserId, questionId);
    
    try {
      await fetch(`/api/bookmarks/${currentUserId}/${questionId}`, {
        method: "POST",
      });
    } catch (error) {
      console.log("Offline mode: bookmark removed locally");
    }
  };

  const handleOpenQuestion = (questionId: number) => {
    navigate(`/question?id=${questionId}`);
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
          <h2 className="text-2xl font-bold mb-2">Bookmarked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review questions you've saved for later
          </p>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📚</div>
                <p>No bookmarked questions yet</p>
                <p className="text-sm mt-2">
                  Bookmark questions while practicing to review them later
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question: any, index: number) => {
              const categoryInfo = getCategoryInfo(question.category);
              const difficultyInfo = getDifficultyInfo(question.difficulty);
              
              return (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={`bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-900/30 text-${categoryInfo.color}-800 dark:text-${categoryInfo.color}-200 text-xs`}
                        >
                          {categoryInfo.name}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={`bg-${difficultyInfo.color}-100 dark:bg-${difficultyInfo.color}-900/30 text-${difficultyInfo.color}-800 dark:text-${difficultyInfo.color}-200 text-xs`}
                        >
                          {difficultyInfo.name}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBookmark(question.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 -mr-2"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <button
                      onClick={() => handleOpenQuestion(question.id)}
                      className="w-full text-left"
                    >
                      <p className="text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {question.text}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Question #{question.id}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Bookmarked</span>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
