import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add route-handling middleware for client-side routes
  // This is needed to make sure all React Router routes work with direct URL access
  app.get(['/landing', '/message', '/experience'], (req, res, next) => {
    next(); // Let the client-side routing handle these routes
  });

  // API routes would go here, prefixed with /api
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
