import type { Express } from "express";
import { createServer, type Server } from "node:http";

import { fetchRealTimeAlerts } from "./lib/disaster";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/alerts", async (_req, res) => {
    try {
      const alerts = await fetchRealTimeAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      res.status(500).json({ error: "Failed to fetch real-time alerts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
