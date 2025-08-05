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
    .enum(['formal', 'informal', 'humorous', 'normal'])
    .describe('The desired tone of the chatbot response.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .describe('The previous messages in the conversation.'),
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
  input: {schema: z.object({
    message: ChatInputSchema.shape.message,
    tone: ChatInputSchema.shape.tone,
    photoDataUri: ChatInputSchema.shape.photoDataUri,
    formattedHistory: z.string().optional(),
  })},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful AI assistant named Nova. Your persona is futuristic and slightly witty.
  Adjust your response to match the desired tone: {{{tone}}}.

  If the tone is 'formal', you must be professional and reply methodically.

  {{#if formattedHistory}}
  Here is the conversation history:
  {{{formattedHistory}}}
  {{/if}}

  {{#if photoDataUri}}
  The user has provided an image. Analyze the image and use it to inform your response.
  Image: {{media url=photoDataUri}}
  {{/if}}

  User's message: {{{message}}}
  Your response:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    // Format the history into a simple string to avoid complex Handlebars logic.
    const formattedHistory = (input.history || [])
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const {output} = await prompt({
      ...input,
      formattedHistory,
    });
    return output!;
  }
);
