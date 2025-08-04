// Adjusts the chatbot's tone based on a selected setting (e.g., formal, informal, humorous).
// - adjustTone - A function that adjusts the tone of the chatbot response.
// - AdjustToneInput - The input type for the adjustTone function.
// - AdjustToneOutput - The return type for the adjustTone function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustToneInputSchema = z.object({
  originalResponse: z.string().describe('The original chatbot response.'),
  tone: z
    .enum(['formal', 'informal', 'humorous'])
    .describe('The desired tone of the chatbot response.'),
});
export type AdjustToneInput = z.infer<typeof AdjustToneInputSchema>;

const AdjustToneOutputSchema = z.object({
  adjustedResponse: z
    .string()
    .describe('The chatbot response adjusted to the specified tone.'),
});
export type AdjustToneOutput = z.infer<typeof AdjustToneOutputSchema>;

export async function adjustTone(input: AdjustToneInput): Promise<AdjustToneOutput> {
  return adjustToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustTonePrompt',
  input: {schema: AdjustToneInputSchema},
  output: {schema: AdjustToneOutputSchema},
  prompt: `You are an AI chatbot. You are tasked with adjusting your response to match a specific tone.

Original Response: {{{originalResponse}}}
Desired Tone: {{{tone}}}

Adjusted Response:`,
});

const adjustToneFlow = ai.defineFlow(
  {
    name: 'adjustToneFlow',
    inputSchema: AdjustToneInputSchema,
    outputSchema: AdjustToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
