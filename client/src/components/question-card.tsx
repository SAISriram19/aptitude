import { useState, useEffect } from "react";
import { Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { Question } from "@shared/schema";
import { getCategoryInfo, getDifficultyInfo } from "@/lib/questions";
import { localStorage_helper } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSwipe } from "@/hooks/use-swipe";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: number, timeSpent: number) => void;
  onSkip: () => void;
  onBookmark: () => void;
  currentIndex: number;
  totalQuestions: number;
  isBookmarked: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  onSkip,
  onBookmark,
  currentIndex,
  totalQuestions,
  isBookmarked
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [dragX, setDragX] = useState(0);

  const categoryInfo = getCategoryInfo(question.category);
  const difficultyInfo = getDifficultyInfo(question.difficulty);

  // Timer effect
  useEffect(() => {
    localStorage_helper.startQuestionTimer(question.id);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [question.id]);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTimer(0);
    setDragX(0);
  }, [question.id]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {
      if (selectedAnswer !== null) {
        handleSubmit();
      }
    },
    onSwipedRight: () => {
      onSkip();
    }
  });

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const timeSpent = localStorage_helper.endQuestionTimer(question.id);
    onAnswer(selectedAnswer, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="w-full"
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      onDrag={(event, info) => setDragX(info.offset.x)}
      onDragEnd={(event, info) => {
        if (Math.abs(info.offset.x) > 100) {
          if (info.offset.x > 0) {
            onSkip();
          } else if (selectedAnswer !== null) {
            handleSubmit();
          }
        }
        setDragX(0);
      }}
      style={{ x: dragX }}
      {...swipeHandlers}
    >
      <Card className="w-full shadow-sm border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
            </div>
            <button
              onClick={onBookmark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Category and Difficulty */}
          <div className="flex items-center space-x-2 mb-4">
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

          {/* Timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm">{formatTime(timer)}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 leading-relaxed">
              {question.text}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  selectedAnswer === index
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="text-sm">{String.fromCharCode(65 + index)}) {option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Swipe Hints */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span>←</span>
                <span>Swipe left to attempt</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Swipe right to skip</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Skip Question
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
