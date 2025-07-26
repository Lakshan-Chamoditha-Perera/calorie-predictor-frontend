import { QueryClient } from '@tanstack/react-query';

// Function to create a new QueryClient instance
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime above 0
                // to avoid refetching immediately on the client.
                staleTime: 60 * 1000, // 60 seconds
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient();
    }
    // On the client, make a new QueryClient if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render.
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}