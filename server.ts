import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Initialize Gemini Client on the server side securely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } else {
    console.warn('⚠️ GEMINI_API_KEY environment variable is missing.');
  }

  // 2. Server API Route for the Coach Chat with Gemini
  app.post('/api/coach-chat', async (req, res) => {
    try {
      const { message, history, vitals } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message payload is required' });
      }

      if (!ai) {
        return res.status(500).json({ 
          error: 'Gemini client is uninitialized. Please define GEMINI_API_KEY secret.' 
        });
      }

      const systemInstruction = 
        `You are Ananya Deshmukh, an elite GOQii health & wellness coach assigned to Ashit Jagannath Amin. 
        You speak with high professional composure, extreme empathy, and specialized clinical expertise on sleep hygiene, physical activity, and glucose control.
        Ashit is 35 years old. 
        His current Health Risk Profile context:
        - Health Risk Score: ${vitals?.riskScore || 72}/100
        - Risk Category: ${vitals?.riskCategory || 'MODERATE RISK'}
        - Recent Live Biomarkers: Biological Age is 43 Years, Sleep quality is 78%, Cardio risk is Moderate, Glucose level shows prediabetic markers.
        - Live Metrics Context: ${vitals?.metricsSummary || 'Steps: 4443, Sleep: 7h 24m'}.
        
        Rule 1: Answer Ashit directly. Keep your answers concise (under 2-3 short paragraphs), highly encouraging, simple, actionable, and structured with clean spacing.
        Rule 2: Prioritize recommendations that help improve sleep depth (8 hours) and decrease visceral glucose loading (balanced organic greens).
        Rule 3: Avoid using markdown headers or bold lists, speak in conversational paragraph form.
        Rule 4: Never state you are an AI model or simulation. You are a realcertified coach.`;

      // Map incoming chat turns into the compatible Gemini structure
      // Roles are mapped: user -> user, coach/model -> model
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          const role = turn.role === 'model' ? 'model' : 'user';
          const textVal = turn.parts?.[0]?.text || '';
          if (textVal) {
            contents.push({
              role,
              parts: [{ text: textVal }]
            });
          }
        }
      }

      // Append absolute newest user query
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Invoke Gemini 3.5 Flash server-side
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Let's work together to optimize your vitals.";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error('Error invoking Gemini model:', error);
      res.status(500).json({ 
        error: 'Technical complication contacting Gemini. Returning back mock support.',
        details: error?.message || String(error)
      });
    }
  });

  // 3. API route status health indicator
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: 'local_persistence' });
  });

  // 4. Vite middleware for routing in development asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static compiled folders static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Wellness Companion Server running on http://localhost:${PORT}`);
  });
}

startServer();
