const Groq = require('groq-sdk');
const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');
const AppError = require('../utils/AppError');

class LLMService {
  constructor() {
    this.providers = {
      groq: process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null,
      gemini: process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null,
      openai: process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null,
      llama: process.env.LLAMA_API_KEY ? new OpenAI({ 
        apiKey: process.env.LLAMA_API_KEY, 
        baseURL: process.env.LLAMA_BASE_URL || 'https://integrate.api.nvidia.com/v1' 
      }) : null,
    };
  }

  async generateResponse(prompt, providerName = 'groq') {
    const aiClient = this.providers[providerName];

    if (!aiClient) {
      throw new AppError(`The API key for ${providerName.toUpperCase()} is missing in your .env file.`, 500);
    }

    try {
      let content = null;

      if (providerName === 'groq') {
        const completion = await aiClient.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.2,
        });
        content = completion.choices[0].message.content;
      }
      else if (providerName === 'gemini') {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        content = response.text;
      }
      else if (providerName === 'openai') {
        const completion = await aiClient.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4o-mini',
          temperature: 0.2,
        });
        content = completion.choices[0].message.content;
      }
      else if (providerName === 'llama') {
        const completion = await aiClient.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'meta/llama-3.1-70b-instruct',
          temperature: 0.2,
        });
        content = completion.choices[0].message.content;
      }

      return content;
    } catch (error) {
      console.error(`LLM API Error (${providerName}):`, error);
      throw new AppError(`AI text generation failed for ${providerName}. Ensure your quota/rate limits aren't exceeded.`, 502);
    }
  }

  // Chat with full message history (for persistent memory)
  async generateChatResponse(messages, providerName = 'groq') {
    const aiClient = this.providers[providerName];
    if (!aiClient) {
      throw new AppError(`The API key for ${providerName.toUpperCase()} is missing in your .env file.`, 500);
    }

    try {
      let content = null;

      if (providerName === 'groq') {
        const completion = await aiClient.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.3,
        });
        content = completion.choices[0].message.content;
      }
      else if (providerName === 'gemini') {
        // Gemini uses a different format — flatten to text
        const flatPrompt = messages
          .map(m => `${m.role === 'system' ? '[Context]' : m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n\n') + '\n\nAssistant:';
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: flatPrompt,
        });
        content = response.text;
      }
      else if (providerName === 'openai') {
        const completion = await aiClient.chat.completions.create({
          messages,
          model: 'gpt-4o-mini',
          temperature: 0.3,
        });
        content = completion.choices[0].message.content;
      }
      else if (providerName === 'llama') {
        const completion = await aiClient.chat.completions.create({
          messages,
          model: 'meta/llama-3.1-70b-instruct',
          temperature: 0.3,
        });
        content = completion.choices[0].message.content;
      }

      return content;
    } catch (error) {
      console.error(`LLM Chat API Error (${providerName}):`, error);
      throw new AppError(`AI chat failed for ${providerName}. Check your quota/rate limits.`, 502);
    }
  }
}

module.exports = new LLMService();
