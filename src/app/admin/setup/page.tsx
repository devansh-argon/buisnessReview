// app/admin/setup/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createAdminUser } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { notFound } from "next/navigation";

export default function AdminSetupPage() {

    if (process.env.NODE_ENV === "production") {
        notFound();
    }
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [setupComplete, setSetupComplete] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            toast({
                title: 'Error',
                description: 'Please enter both username and password',
                variant: 'destructive',
            });
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        if (credentials.password.length < 6) {
            toast({
                title: 'Error',
                description: 'Password must be at least 6 characters long',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await createAdminUser(credentials.username, credentials.password);
            toast({
                title: 'Success',
                description: 'Admin user created successfully!',
            });
            setSetupComplete(true);
        } catch (error) {
            console.error('Setup error:', error);
            toast({
                title: 'Error',
                description: 'Failed to create admin user. Check console for details.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (setupComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold text-green-600">Setup Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-600">
                            Admin user has been created successfully.
                        </p>
                        <p className="text-sm text-gray-500">
                            You can now navigate to <code>/admin/login</code> to sign in.
                        </p>
                        <Button
                            onClick={() => window.location.href = '/admin/login'}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center  bg-contain justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: "url('/login_bg.png')" }}
        >
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Admin Setup</CardTitle>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Create the first admin user for your application
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                placeholder="Enter admin username"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Enter admin password (min 6 characters)"
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={credentials.confirmPassword}
                                onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm admin password"
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Admin User...
                                </>
                            ) : (
                                'Create Admin User'
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-xs text-yellow-800">
                            <strong>Important:</strong> This page should only be used once to create the initial admin user.
                            Consider removing or protecting this route after setup.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}