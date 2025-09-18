'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster'; // Corrected import path
import { getCompanyConfig } from '@/lib/db';
import { generateInitialReviews, regenerateReviewSuggestions } from '@/ai/flows'; // Assuming flows are exported from index
import { openGoogleMapsReview } from '@/services/google-maps';
import type { CompanyConfig } from '@/types/company-config';
import { ClipboardCopy, RefreshCw, Check, Star, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicReviewPage() {
  const [config, setConfig] = useState<CompanyConfig | null>(null);
  const [reviews, setReviews] = useState<string[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const params = useParams();
  const docId = params.docId as string;

  const fetchConfigAndInitialReviews = useCallback(async () => {
    setIsLoadingConfig(true);
    setIsLoadingReviews(true);
    try {
      const fetchedConfig = await getCompanyConfig(docId);
      setConfig(fetchedConfig);

      if (fetchedConfig.companyDescription && fetchedConfig.keywords.length > 0) {
        const initialReviewsOutput = await generateInitialReviews({
          companyDescription: fetchedConfig.companyDescription,
          keywords: fetchedConfig.keywords,
          numReviews: 3, // Generate 3 reviews initially
        });
        setReviews(initialReviewsOutput.reviews);
      } else {
         setReviews([
            "Great experience!",
            "Highly recommended.",
            "Very satisfied with the service."
         ]); // Default placeholder reviews
      }
    } catch (error) {
      console.error('Error fetching config or initial reviews:', error);
      toast({
        title: 'Error',
        description: 'Could not load company information or review suggestions.',
        variant: 'destructive',
      });
       setReviews([
            "Error loading reviews.",
            "Please try again later.",
            "Could not connect."
        ]); // Error placeholder reviews
    } finally {
      setIsLoadingConfig(false);
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigAndInitialReviews();
  }, [fetchConfigAndInitialReviews,docId]);

  const handleRegenerateReviews = async () => {
    if (!config || !config.companyDescription || config.keywords.length === 0) {
       toast({
        title: 'Cannot Regenerate',
        description: 'Company description and keywords are needed.',
        variant: 'destructive',
      });
      return;
    }

    setIsRegenerating(true);
    try {
      const regeneratedReviewsOutput = await regenerateReviewSuggestions({
        companyDescription: config.companyDescription,
        keywords: config.keywords,
        numReviews: 3,
      });
      setReviews(regeneratedReviewsOutput.reviews);
    } catch (error) {
      console.error('Error regenerating reviews:', error);
      toast({
        title: 'Error',
        description: 'Could not regenerate review suggestions.',
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast({
        title: 'Copied!',
        description: 'Review suggestion copied to clipboard.',
      });
      setTimeout(() => setCopiedIndex(null), 2000); // Reset icon after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text:', err);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy text to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const handleLeaveReview = () => {
    if (config?.googleMapsUrl) {
      openGoogleMapsReview(config.googleMapsUrl);
    } else {
       toast({
        title: 'Missing URL',
        description: 'The Google Maps review link is not configured.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl min-h-screen flex flex-col items-center">
      <Card className="w-full shadow-lg rounded-lg overflow-hidden mb-8">
         <CardContent className="p-6 md:p-8 text-center">
           {isLoadingConfig ? (
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
           ) : (
             config && (
               <>
                 {config.logoUrl && (
                   <Image
                     src={config.logoUrl}
                     alt="Company Logo"
                     width={80}
                     height={80}
                     className="mx-auto mb-4 rounded-md object-contain h-20 w-20 border"
                     data-ai-hint="company logo"
                     priority // Prioritize loading the logo
                   />
                 )}
                 <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                   We’d love your feedback!
                 </h1>
                 <p className="text-muted-foreground mb-6">
                   Please leave us a review. Get inspired by the suggestions below or write your own.
                 </p>
               </>
             )
           )}

            <div className="space-y-4 mb-6">
                {isLoadingReviews ? (
                   Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="bg-secondary/50 border-dashed">
                        <CardContent className="p-4 flex justify-between items-center">
                           <Skeleton className="h-4 flex-grow mr-4" />
                           <Skeleton className="h-8 w-8 rounded" />
                        </CardContent>
                    </Card>
                   ))
                ) : (
                  reviews.map((review, index) => (
                    <Card key={index} className="bg-secondary/50 text-left hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4 flex justify-between items-center gap-2">
                        <p className="text-secondary-foreground flex-grow">{review}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyToClipboard(review, index)}
                          aria-label="Copy review suggestion"
                          className="text-primary hover:text-primary/80 shrink-0"
                        >
                          {copiedIndex === index ? <Check className="h-5 w-5 text-green-500" /> : <ClipboardCopy className="h-5 w-5" />}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={handleRegenerateReviews}
                disabled={isRegenerating || isLoadingReviews || isLoadingConfig}
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Suggestions
                  </>
                )}
              </Button>
              <Button
                onClick={handleLeaveReview}
                disabled={!config?.googleMapsUrl || isLoadingConfig}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Star className="mr-2 h-4 w-4 fill-current" />
                Leave a Google Review
              </Button>
            </div>
         </CardContent>
      </Card>
      <footer className="text-center text-sm text-muted-foreground mt-auto py-4">
        Powered by ReviewSpark
      </footer>
      <Toaster />
    </div>
  );
}
