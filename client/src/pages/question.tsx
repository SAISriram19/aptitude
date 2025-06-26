import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
import { SolutionModal } from "@/components/solution-modal";
import { localStorage_helper } from "@/lib/storage";
import { shuffleArray } from "@/lib/questions";
import { Question } from "@shared/schema";

export default function QuestionPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const categories = params.get("categories");
  const mode = params.get("mode");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
  } | null>(null);

  const currentUserId = localStorage_helper.getCurrentUser();

  // Fetch questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", { category, categories, random: mode === "casual" }],
    staleTime: 5 * 60 * 1000,
  });

  const [questionList, setQuestionList] = useState<Question[]>([]);

  useEffect(() => {
    if (questions && Array.isArray(questions)) {
      let filteredQuestions = questions;
      
      // Filter by multiple categories if provided
      if (categories) {
        const selectedCategories = categories.split(",");
        filteredQuestions = questions.filter((q: any) => 
          selectedCategories.includes(q.category)
        );
      } else if (category) {
        filteredQuestions = questions.filter((q: any) => q.category === category);
      }
      
      if (mode === "casual") {
        setQuestionList(shuffleArray(filteredQuestions));
      } else {
        setQuestionList(filteredQuestions);
      }
    }
  }, [questions, mode, category, categories]);

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      // Save to local storage for offline use
      localStorage_helper.saveProgress({
        id: Date.now(),
        userId: currentUserId,
        questionId: data.questionId,
        selectedAnswer: data.selectedAnswer,
        isCorrect: data.isCorrect,
        timeSpent: data.timeSpent,
        isBookmarked: false,
        attemptedAt: new Date(),
      });
      
      // Also try to save to server
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            questionId: data.questionId,
            selectedAnswer: data.selectedAnswer,
            isCorrect: data.isCorrect,
            timeSpent: data.timeSpent,
          }),
        });
        return response.json();
      } catch (error) {
        // Offline mode - continue with local storage
        console.log("Offline mode: saved to local storage");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stats/${currentUserId}`] });
    },
  });

  const currentQuestion = questionList[currentIndex];

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">
            Loading questions...
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (selectedAnswer: number, timeSpent: number) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setLastAnswer({
      answer: selectedAnswer,
      isCorrect,
      timeSpent,
    });

    saveProgressMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    });

    setShowSolution(true);
  };

  const handleSkip = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate("/");
    }
  };

  const handleNext = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate("/");
    }
  };

  const handleBookmark = async () => {
    const isBookmarked = localStorage_helper.toggleBookmark(currentUserId, currentQuestion.id);
    
    // Try to sync with server
    try {
      await fetch(`/api/bookmarks/${currentUserId}/${currentQuestion.id}`, {
        method: "POST",
      });
    } catch (error) {
      // Offline mode
      console.log("Offline mode: bookmark saved locally");
    }
    
    queryClient.invalidateQueries({ queryKey: [`/api/bookmarks/${currentUserId}`] });
  };

  const isBookmarked = localStorage_helper.isBookmarked(currentUserId, currentQuestion.id);

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
        </div>

        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          onBookmark={handleBookmark}
          currentIndex={currentIndex}
          totalQuestions={questionList.length}
          isBookmarked={isBookmarked}
        />

        {showSolution && lastAnswer && (
          <SolutionModal
            isOpen={showSolution}
            onClose={() => setShowSolution(false)}
            question={currentQuestion}
            selectedAnswer={lastAnswer.answer}
            isCorrect={lastAnswer.isCorrect}
            timeSpent={lastAnswer.timeSpent}
            onNext={handleNext}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked}
          />
        )}
      </div>
    </div>
  );
}
