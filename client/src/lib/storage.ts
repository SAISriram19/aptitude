import { Question, UserProgress } from "@shared/schema";

const STORAGE_KEYS = {
  USER_PROGRESS: 'aptitude_user_progress',
  BOOKMARKS: 'aptitude_bookmarks', 
  CURRENT_USER: 'aptitude_current_user',
  QUESTION_TIMES: 'aptitude_question_times',
  SETTINGS: 'aptitude_settings'
} as const;

export interface QuestionTime {
  questionId: number;
  startTime: number;
  endTime?: number;
  totalTime?: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  swipeEnabled: boolean;
  showHints: boolean;
}

export class LocalStorage {
  // User Progress
  saveProgress(progress: UserProgress) {
    const existingProgress = this.getAllProgress();
    const existingIndex = existingProgress.findIndex(
      p => p.questionId === progress.questionId && p.userId === progress.userId
    );
    
    if (existingIndex >= 0) {
      existingProgress[existingIndex] = progress;
    } else {
      existingProgress.push(progress);
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(existingProgress));
  }

  getAllProgress(): UserProgress[] {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return stored ? JSON.parse(stored) : [];
  }

  getUserProgress(userId: number): UserProgress[] {
    return this.getAllProgress().filter(p => p.userId === userId);
  }

  // Bookmarks
  toggleBookmark(userId: number, questionId: number): boolean {
    const bookmarks = this.getBookmarks(userId);
    const existingIndex = bookmarks.indexOf(questionId);
    
    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
    } else {
      bookmarks.push(questionId);
    }
    
    localStorage.setItem(`${STORAGE_KEYS.BOOKMARKS}_${userId}`, JSON.stringify(bookmarks));
    return existingIndex < 0; // returns true if bookmarked, false if removed
  }

  getBookmarks(userId: number): number[] {
    const stored = localStorage.getItem(`${STORAGE_KEYS.BOOKMARKS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  isBookmarked(userId: number, questionId: number): boolean {
    const bookmarks = this.getBookmarks(userId);
    return bookmarks.includes(questionId);
  }

  // Question Timing
  startQuestionTimer(questionId: number): void {
    const questionTime: QuestionTime = {
      questionId,
      startTime: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.QUESTION_TIMES, JSON.stringify(questionTime));
  }

  endQuestionTimer(questionId: number): number {
    const stored = localStorage.getItem(STORAGE_KEYS.QUESTION_TIMES);
    if (!stored) return 0;
    
    const questionTime: QuestionTime = JSON.parse(stored);
    if (questionTime.questionId !== questionId) return 0;
    
    const endTime = Date.now();
    const totalTime = Math.round((endTime - questionTime.startTime) / 1000); // in seconds
    
    localStorage.removeItem(STORAGE_KEYS.QUESTION_TIMES);
    return totalTime;
  }

  // Settings
  saveSettings(settings: Partial<UserSettings>): void {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  }

  getSettings(): UserSettings {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: UserSettings = {
      theme: 'light',
      swipeEnabled: true,
      showHints: true
    };
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  // Current User (for demo purposes)
  setCurrentUser(userId: number): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId.toString());
  }

  getCurrentUser(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? parseInt(stored) : 1; // Default user ID
  }

  // Stats calculation
  getUserStats(userId: number) {
    const progress = this.getUserProgress(userId);
    const attempted = progress.filter(p => p.selectedAnswer !== null);
    const correct = attempted.filter(p => p.isCorrect === true);
    const bookmarks = this.getBookmarks(userId);

    const categoryStats: { [key: string]: { attempted: number; correct: number; avgTime: number } } = {};
    
    // Note: We'd need question data to calculate category stats properly
    // This is a simplified version for offline use
    
    return {
      totalAttempted: attempted.length,
      totalCorrect: correct.length,
      totalBookmarked: bookmarks.length,
      categoryStats
    };
  }
}

export const localStorage_helper = new LocalStorage();
