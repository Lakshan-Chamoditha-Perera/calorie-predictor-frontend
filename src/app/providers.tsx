"use client";
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { getQueryClient } from './get-query-client';
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer
                position="top-right"
                pauseOnHover={false}
                theme="colored"
            />
            {children}
        </QueryClientProvider>
    );
}