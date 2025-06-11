import OpenAI from 'openai';

// It's a best practice to initialize the client once and reuse it.
// The API key is automatically read from the OPENAI_API_KEY environment variable.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
