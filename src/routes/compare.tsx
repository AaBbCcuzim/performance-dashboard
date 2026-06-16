// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { ComparisonView } from '@/components/charts/ComparisonView';

export const Route = createFileRoute('/compare')({
  component: () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Multi-Dimension Comparison</h2>
      <ComparisonView />
    </div>
  ),
});
