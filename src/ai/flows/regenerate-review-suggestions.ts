// src/ai/flows/regenerate-review-suggestions.ts
'use server';

/**
 * @fileOverview A flow to regenerate review suggestions based on the company description and keywords.
 *
 * - regenerateReviewSuggestions - A function that regenerates review suggestions.
 * - RegenerateReviewSuggestionsInput - The input type for the regenerateReviewSuggestions function.
 * - RegenerateReviewSuggestionsOutput - The return type for the regenerateReviewSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RegenerateReviewSuggestionsInputSchema = z.object({
  companyDescription: z.string().describe('A short description of the company.'),
  keywords: z.array(z.string()).describe('A list of keywords or tags that describe the company/services.'),
  numReviews: z.number().default(3).describe('The number of reviews to generate.'),
});
export type RegenerateReviewSuggestionsInput = z.infer<
  typeof RegenerateReviewSuggestionsInputSchema
>;

const RegenerateReviewSuggestionsOutputSchema = z.object({
  reviews: z.array(z.string()).describe('A list of AI-generated review suggestions.'),
});
export type RegenerateReviewSuggestionsOutput = z.infer<
  typeof RegenerateReviewSuggestionsOutputSchema
>;

export async function regenerateReviewSuggestions(
  input: RegenerateReviewSuggestionsInput
): Promise<RegenerateReviewSuggestionsOutput> {
  return regenerateReviewSuggestionsFlow(input);
}

const reviewSuggestionPrompt = ai.definePrompt({
  name: 'reviewSuggestionPrompt',
  input: {
    schema: z.object({
      companyDescription: z.string().describe('A short description of the company.'),
      keywords: z.array(z.string()).describe('A list of keywords or tags that describe the company/services.'),
      numReviews: z.number().default(3).describe('The number of reviews to generate.'),
    }),
  },
  output: {
    schema: z.object({
      reviews: z.array(z.string()).describe('A list of AI-generated review suggestions.'),
    }),
  },
  prompt: `You are an AI assistant specialized in generating customer review suggestions for businesses.

  Given the following company description and keywords, generate {{{numReviews}}} distinct customer review suggestions.

  Company Description: {{{companyDescription}}}
  Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Each review should be concise, positive, and reflect the essence of the company as described.
  The generated reviews should be engaging and inspire potential customers.  Vary the length and tone of each review.

  Output the reviews as a JSON array of strings.
  `,
});

const regenerateReviewSuggestionsFlow = ai.defineFlow<
  typeof RegenerateReviewSuggestionsInputSchema,
  typeof RegenerateReviewSuggestionsOutputSchema
>(
  {
    name: 'regenerateReviewSuggestionsFlow',
    inputSchema: RegenerateReviewSuggestionsInputSchema,
    outputSchema: RegenerateReviewSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await reviewSuggestionPrompt(input);
    return output!;
  }
);
