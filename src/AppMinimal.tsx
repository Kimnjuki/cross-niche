import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnhancedErrorBoundary } from '@/components/error/EnhancedErrorBoundary';
import { SafeConvexProvider } from '@/components/providers/SafeConvexProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import TestFeatures from './pages/TestFeatures';

const queryClient = new QueryClient();

const AppMinimal = () => (
  <EnhancedErrorBoundary>
    <SafeConvexProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<div className="min-h-screen bg-gray-900 text-white p-8">
                  <h1 className="text-4xl font-bold mb-4">GridNexus - Minimal Test</h1>
                  <p>If you can see this, React is working!</p>
                  <a href="/test-features" className="text-blue-400 hover:text-blue-300 underline block mt-4">
                    Go to Test Features →
                  </a>
                </div>} />
                <Route path="/test-features" element={<TestFeatures />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeConvexProvider>
  </EnhancedErrorBoundary>
);

export default AppMinimal;
