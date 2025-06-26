import { Question } from "@shared/schema";

export const CATEGORIES = {
  numerical: {
    name: "Numerical Reasoning",
    icon: "calculator",
    color: "blue",
    description: "Mathematical calculations • Number operations"
  },
  verbal: {
    name: "Verbal Reasoning",
    icon: "message-square",
    color: "green",
    description: "Language comprehension • Reading analysis"
  },
  logical: {
    name: "Logical Reasoning", 
    icon: "brain",
    color: "purple",
    description: "Logic patterns • Reasoning skills"
  },
  abstract: {
    name: "Abstract/Non-Verbal Reasoning",
    icon: "shapes",
    color: "orange",
    description: "Visual patterns • Shape sequences"
  },
  quantitative: {
    name: "Quantitative Aptitude",
    icon: "trending-up",
    color: "indigo",
    description: "Probability • Statistics • Algebra"
  },
  datainterpretation: {
    name: "Data Interpretation",
    icon: "bar-chart",
    color: "cyan",
    description: "Charts • Graphs • Data analysis"
  },
  criticalthinking: {
    name: "Critical Thinking",
    icon: "lightbulb",
    color: "yellow",
    description: "Analysis • Evaluation • Problem solving"
  },
  spatial: {
    name: "Spatial Reasoning",
    icon: "cube",
    color: "pink",
    description: "3D visualization • Spatial relationships"
  },
  mechanical: {
    name: "Mechanical Aptitude",
    icon: "settings",
    color: "gray",
    description: "Mechanics • Physics • Engineering"
  },
  situational: {
    name: "Situational Judgment",
    icon: "users",
    color: "teal",
    description: "Workplace scenarios • Decision making"
  },
  diagrammatic: {
    name: "Diagrammatic Reasoning",
    icon: "git-branch",
    color: "red",
    description: "Flow charts • Process diagrams"
  },
  inductive: {
    name: "Inductive Reasoning",
    icon: "arrow-up-right",
    color: "emerald",
    description: "Pattern identification • Rule finding"
  },
  deductive: {
    name: "Deductive Reasoning",
    icon: "arrow-down-left",
    color: "violet",
    description: "Logical conclusions • Rule application"
  },
  analytical: {
    name: "Analytical Reasoning",
    icon: "search",
    color: "amber",
    description: "Data analysis • Logical structure"
  },
  verbalanalogies: {
    name: "Verbal Analogies",
    icon: "link",
    color: "lime",
    description: "Word relationships • Comparisons"
  },
  errorchecking: {
    name: "Error Checking",
    icon: "shield-check",
    color: "rose",
    description: "Attention to detail • Accuracy"
  },
  numbersequences: {
    name: "Number Sequences",
    icon: "hash",
    color: "sky",
    description: "Number patterns • Series completion"
  },
  wordproblems: {
    name: "Word Problems",
    icon: "file-text",
    color: "stone",
    description: "Text-based math • Real-world scenarios"
  },
  logicalpuzzles: {
    name: "Logical Puzzles",
    icon: "puzzle",
    color: "fuchsia",
    description: "Brain teasers • Logic games"
  },
  patternrecognition: {
    name: "Pattern Recognition",
    icon: "eye",
    color: "slate",
    description: "Visual patterns • Sequence identification"
  }
} as const;

export const DIFFICULTIES = {
  easy: { name: "Easy", color: "green" },
  medium: { name: "Medium", color: "orange" },
  hard: { name: "Hard", color: "red" }
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type DifficultyKey = keyof typeof DIFFICULTIES;

export function getCategoryInfo(category: string) {
  return CATEGORIES[category as CategoryKey] || CATEGORIES.quantitative;
}

export function getDifficultyInfo(difficulty: string) {
  return DIFFICULTIES[difficulty as DifficultyKey] || DIFFICULTIES.medium;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
