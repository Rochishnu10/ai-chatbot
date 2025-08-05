// Generates a chat response from the AI with a specified tone.
// - chat - A function that generates a chat response.
// - ChatInput - The input type for the chat function.
// - ChatOutput - The return type for the chat function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message.'),
  tone: z
    .enum(['formal', 'informal', 'humorous'])
    .describe('The desired tone of the chatbot response.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The previous messages in the conversation.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful AI assistant named Nova. Your persona is futuristic and slightly witty.
  Adjust your response to match the desired tone: {{{tone}}}.
  
  This is the conversation history:
  {{#each history}}
    {{#if (eq this.role "user")}}User: {{{this.content}}}{{/if}}
    {{#if (eq this.role "assistant")}}Nova: {{{this.content}}}{{/if}}
  {{/each}}

  {{#if photoDataUri}}
  The user has provided an image. Analyze the image and use it to inform your response.
  Image: {{media url=photoDataUri}}
  {{/if}}

  User's message: {{{message}}}
  Your response:`,
  template: {
    helpers: {
        eq: (a, b) => a === b,
    },
  },
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
