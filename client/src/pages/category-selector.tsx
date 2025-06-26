import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Play, Shuffle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES } from "@/lib/questions";

export default function CategorySelector() {
  const [, navigate] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mode, setMode] = useState<"casual" | "structured">("casual");

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryKey)
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === Object.keys(CATEGORIES).length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(Object.keys(CATEGORIES));
    }
  };

  const handleStartPractice = () => {
    if (selectedCategories.length === 0) return;
    
    const categoriesParam = selectedCategories.join(",");
    const modeParam = mode === "casual" ? "casual" : "structured";
    navigate(`/question?categories=${categoriesParam}&mode=${modeParam}`);
  };

  const isAllSelected = selectedCategories.length === Object.keys(CATEGORIES).length;

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
          <h2 className="text-2xl font-bold mb-2">Custom Practice Session</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose categories and practice mode for your session
          </p>
        </div>

        {/* Mode Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Practice Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex space-x-3">
              <Button
                variant={mode === "casual" ? "default" : "outline"}
                onClick={() => setMode("casual")}
                className="flex-1"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Casual (Mixed)
              </Button>
              <Button
                variant={mode === "structured" ? "default" : "outline"}
                onClick={() => setMode("structured")}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Structured
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === "casual" 
                ? "Questions from selected categories will be mixed randomly"
                : "Questions will be grouped by category in order"
              }
            </p>
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Select Categories</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-primary"
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleCategoryToggle(key)}
                >
                  <Checkbox
                    checked={selectedCategories.includes(key)}
                    onChange={() => handleCategoryToggle(key)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{category.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`bg-${category.color}-100 dark:bg-${category.color}-900/30 text-${category.color}-800 dark:text-${category.color}-200 text-xs`}
                      >
                        {category.color}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  {selectedCategories.includes(key) && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selection Summary */}
        {selectedCategories.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Selected Categories:</span>
                <Badge variant="secondary">
                  {selectedCategories.length} of {Object.keys(CATEGORIES).length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(key => (
                  <Badge 
                    key={key} 
                    variant="outline"
                    className="text-xs"
                  >
                    {CATEGORIES[key as keyof typeof CATEGORIES].name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Button */}
        <Button
          onClick={handleStartPractice}
          disabled={selectedCategories.length === 0}
          className="w-full h-12 text-lg"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Practice Session
        </Button>

        {selectedCategories.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            Please select at least one category to start practicing
          </p>
        )}
      </div>
    </div>
  );
}