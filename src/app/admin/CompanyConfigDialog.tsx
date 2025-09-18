'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { CompanyConfig } from '@/types/company-config';

const formSchema = z.object({
  companyDescription: z.string().min(1, 'Company description is required.'),
  keywords: z.string().min(1, 'Keywords are required.'),
  googleMapsUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: CompanyConfig;
  onSave: (config: CompanyConfig) => Promise<void>;
};

export const CompanyConfigDialog: React.FC<Props> = ({ open, onClose, initialData, onSave }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(initialData?.logoUrl ?? null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyDescription: initialData?.companyDescription ?? '',
      keywords: initialData?.keywords?.join(', ') ?? '',
      googleMapsUrl: initialData?.googleMapsUrl ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        companyDescription: initialData.companyDescription,
        keywords: initialData.keywords.join(', '),
        googleMapsUrl: initialData.googleMapsUrl,
      });
      setLogoPreviewUrl(initialData.logoUrl);
      setLogoFile(null);
    } else {
      form.reset({
        companyDescription: '',
        keywords: '',
        googleMapsUrl: '',
      });
      setLogoPreviewUrl(null);
      setLogoFile(null);
    }
  }, [initialData, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return initialData?.logoUrl ?? null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const formData = new FormData();
    formData.append("file", logoFile);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || 'Upload failed');
    } catch (err) {
      toast({ title: 'Upload Error', description: String(err), variant: 'destructive' });
      return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    const logoUrl = await uploadLogo();
    if (logoUrl === null) {
      setIsSaving(false);
      return;
    }

    const newConfig: CompanyConfig = {
      ...initialData,
      companyDescription: data.companyDescription,
      keywords: data.keywords.split(',').map(k => k.trim()),
      googleMapsUrl: data.googleMapsUrl ?? '',
      logoUrl,
    };

    await onSave(newConfig);
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Configuration' : 'New Configuration'}</DialogTitle>
          <DialogDescription>Set business information for your review page.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <div className="flex items-center gap-4">
                {logoPreviewUrl && (
                  <Image src={logoPreviewUrl} alt="Logo" width={48} height={48} className="rounded border h-12 w-12" />
                )}
                <Input type="file" accept="image/*" onChange={handleLogoChange} />
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="googleMapsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                initialData ? 'Update' : 'Save'
              )}
            </Button>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
