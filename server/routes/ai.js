const express = require('express');
const router = express.Router();
const axios = require('axios');
const authenticate = require('../middleware/auth');

// POST /api/ai/chat
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return res.status(500).json({ error: 'AI service configuration error' });
    }

    // Build system prompt using aggregated context only (privacy-first)
    const systemPrompt = `You are a personal financial advisor for LeakLess AI. 
    The user's financial summary is: ${JSON.stringify(context)}. 
    Answer questions about their finances, suggest recovery strategies, and predict future impact. 
    NEVER ask for or use personal account details, bank names, or raw transaction descriptions. 
    Always format amounts in INR (₹). Keep responses concise and actionable.`;

    // Call Anthropic API
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620", // Using a stable model name
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.slice(-10) // Only send last 10 messages for efficiency
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    res.json({
      content: response.data.content[0]?.text || 'Sorry, I could not generate a response.'
    });
  } catch (error) {
    console.error('AI Proxy Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get AI response',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
