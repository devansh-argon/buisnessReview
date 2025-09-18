// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getAllCompanyConfigs, deleteCompanyConfig, saveCompanyConfig } from '@/lib/db';
import { CompanyConfigDialog } from './CompanyConfigDialog';
import type { CompanyConfig, CompanyConfigWithId } from '@/types/company-config';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import ConfigCard from '@/components/ui/config-card';
import { Grid } from '@mui/material';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { AdminHeader } from '@/components/ui/AdminHeader';

function AdminConfigPageContent() {
    const router = useRouter();
    const [configs, setConfigs] = useState<CompanyConfigWithId[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<CompanyConfig | undefined>(undefined);

    const refresh = async () => {
        const data = await getAllCompanyConfigs();
        setConfigs(data);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleSave = async (config: CompanyConfig, id?: string) => {
        await saveCompanyConfig(config, id);
        toast({ title: id ? 'Updated' : 'Saved', description: 'Configuration saved.' });
        await refresh();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await deleteCompanyConfig(id);
            toast({ title: 'Deleted' });
            await refresh();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            
            <div className="p-5 space-y-4 max-w-full mx-auto lg:px-20 lg:py-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Company Configurations</h1>
                    <Button onClick={() => { setSelectedConfig(undefined); setDialogOpen(true); }}>
                        + Add New
                    </Button>
                </div>

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 6, md: 12, lg: 16, xl: 20 }}>
                    {configs.map((config) => (
                        <Grid key={config.id} size={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 4 }}>
                            <ConfigCard
                                config={config}
                                onEdit={() => {
                                    setSelectedConfig(config);
                                    setDialogOpen(true);
                                }}
                                onDelete={() => handleDelete(config.id)}
                            />
                        </Grid>
                    ))}
                </Grid>

                <CompanyConfigDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    initialData={selectedConfig}
                    onSave={(config) => handleSave(config, (selectedConfig as CompanyConfigWithId)?.id)}
                />
            </div>
        </div>
    );
}

export default function AdminConfigPage() {
    return (
        <ProtectedRoute>
            <AdminConfigPageContent />
        </ProtectedRoute>
    );
}