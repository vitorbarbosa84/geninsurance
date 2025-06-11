import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

// Define the shape of the expected request from our frontend
interface NlpRequest {
  userText: string;
  choices: { id: string; text: string }[];
}

export async function POST(request: Request) {
  try {
    const { userText, choices }: NlpRequest = await request.json();

    if (!userText || !choices || choices.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // This is the "System Prompt" - it gives the AI strict instructions
    const systemPrompt = `You are a helpful assistant that helps categorize user input. The user will provide a piece of text and a list of possible choices. Your only job is to determine which choice best matches the user's text. Respond ONLY with the 'id' of the best matching choice from the provided list. Do not explain your reasoning. If no choice is a good match, respond with 'null'.`;

    const formattedChoices = choices.map(c => `- id: "${c.id}", text: "${c.text}"`).join('\n');
    const userPrompt = `User text: "${userText}"\n\nPossible choices:\n${formattedChoices}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // As requested, using the gpt-4o model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0, // We want deterministic, not creative, responses
    });

    const matchedId = response.choices[0].message.content;

    // Return the matched ID in a structured format
    return NextResponse.json({ matchedAnswerId: matchedId });

  } catch (error) {
    console.error('Error in NLP endpoint:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
