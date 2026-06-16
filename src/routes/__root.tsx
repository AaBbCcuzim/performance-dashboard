/* eslint-disable */
// @ts-nocheck
import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { PollingController } from '@/components/controls/PollingController';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <header className="border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold">PerfDash</h1>
            <nav className="flex items-center gap-3 text-sm">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
              >
                Dashboard
              </Link>
              <Link
                to="/compare"
                className="text-muted-foreground hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
              >
                Compare
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <PollingController />
            <TimeRangeSelector />
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  ),
});
