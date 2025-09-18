'use server';
/**
 * @fileOverview Generates initial review suggestions based on company description and keywords.
 *
 * - generateInitialReviews - A function that generates initial review suggestions.
 * - GenerateInitialReviewsInput - The input type for the generateInitialReviews function.
 * - GenerateInitialReviewsOutput - The return type for the generateInitialReviews function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateInitialReviewsInputSchema = z.object({
  companyDescription: z
    .string()
    .describe('A short description of the company.'),
  keywords: z.array(z.string()).describe('Keywords related to the business/services.'),
  numReviews: z
    .number()
    .min(3)
    .max(5)
    .default(3) // Default to 3 reviews if not specified
    .describe('The number of review suggestions to generate (between 3 and 5).'),
});
export type GenerateInitialReviewsInput = z.infer<typeof GenerateInitialReviewsInputSchema>;

const GenerateInitialReviewsOutputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of generated review suggestions.'),
});
export type GenerateInitialReviewsOutput = z.infer<typeof GenerateInitialReviewsOutputSchema>;

export async function generateInitialReviews(input: GenerateInitialReviewsInput): Promise<GenerateInitialReviewsOutput> {
  return generateInitialReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialReviewsPrompt',
  input: {
    schema: z.object({
      companyDescription: z
        .string()
        .describe('A short description of the company.'),
      keywords: z.array(z.string()).describe('Keywords related to the business/services.'),
      numReviews: z
        .number()
        .min(3)
        .max(5)
        .default(3) // Default to 3 reviews if not specified
        .describe('The number of review suggestions to generate (between 3 and 5).'),
    }),
  },
  output: {
    schema: z.object({
      reviews: z.array(z.string()).describe('An array of generated review suggestions.'),
    }),
  },
  prompt: `You are an expert review generator for businesses. Based on the company description and keywords provided, generate {{numReviews}} review suggestions that customers might write.

Company Description: {{{companyDescription}}}
Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Reviews:`,
});

const generateInitialReviewsFlow = ai.defineFlow<
  typeof GenerateInitialReviewsInputSchema,
  typeof GenerateInitialReviewsOutputSchema
>(
  {
    name: 'generateInitialReviewsFlow',
    inputSchema: GenerateInitialReviewsInputSchema,
    outputSchema: GenerateInitialReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
