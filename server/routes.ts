import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Questions routes
  app.get("/api/questions", async (req, res) => {
    try {
      const { category, categories, random, limit } = req.query;
      
      let questions;
      if (random === 'true') {
        questions = await storage.getRandomQuestions(
          category as string, 
          limit ? parseInt(limit as string) : 10
        );
      } else if (categories) {
        // Handle multiple categories
        const categoryList = (categories as string).split(',');
        questions = await storage.getQuestionsByMultipleCategories(categoryList);
      } else if (category) {
        questions = await storage.getQuestionsByCategory(category as string);
      } else {
        questions = await storage.getAllQuestions();
      }
      
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestionById(parseInt(req.params.id));
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  // User progress routes
  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookmarks = await storage.getBookmarkedQuestions(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks/:userId/:questionId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const questionId = parseInt(req.params.questionId);
      const progress = await storage.toggleBookmark(userId, questionId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle bookmark" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
