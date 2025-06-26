import { CheckCircle, XCircle, BookmarkPlus, ArrowRight } from "lucide-react";
import { Question } from "@shared/schema";
import { getCategoryInfo, getDifficultyInfo } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  onNext: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}

export function SolutionModal({
  isOpen,
  onClose,
  question,
  selectedAnswer,
  isCorrect,
  timeSpent,
  onNext,
  onBookmark,
  isBookmarked
}: SolutionModalProps) {
  const categoryInfo = getCategoryInfo(question.category);
  const difficultyInfo = getDifficultyInfo(question.difficulty);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    onClose();
    onNext();
  };

  const handleBookmarkAndNext = () => {
    onBookmark();
    handleNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Solution</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Answer Status */}
          <div className={`p-4 rounded-lg border ${
            isCorrect 
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}>
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-semibold ${
                isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                You selected {String.fromCharCode(65 + selectedAnswer)}) {question.options[selectedAnswer]}
              </span>
            </div>
            
            {!isCorrect && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Correct answer: {String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}
              </div>
            )}
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Time taken: {formatTime(timeSpent)}
            </div>
          </div>

          {/* Question Info */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`bg-${categoryInfo.color}-100 dark:bg-${categoryInfo.color}-900 text-${categoryInfo.color}-800 dark:text-${categoryInfo.color}-200`}
            >
              {categoryInfo.name}
            </Badge>
            <Badge 
              variant="secondary"
              className={`bg-${difficultyInfo.color}-100 dark:bg-${difficultyInfo.color}-900 text-${difficultyInfo.color}-800 dark:text-${difficultyInfo.color}-200`}
            >
              {difficultyInfo.name}
            </Badge>
          </div>

          {/* Explanation */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>

            {question.tips && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                  Tech Interview Tip:
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {question.tips}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button onClick={handleNext} className="flex-1">
              <ArrowRight className="w-4 h-4 mr-2" />
              Next Question
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBookmarkAndNext}
              className="px-4"
            >
              <BookmarkPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
