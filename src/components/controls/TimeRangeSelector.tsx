import { useUIStore } from '@/store/ui-store';
import { TIME_RANGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function TimeRangeSelector() {
  const timeRangeHours = useUIStore((s) => s.timeRangeHours);
  const setTimeRange = useUIStore((s) => s.setTimeRange);

  return (
    <div className="flex items-center gap-1">
      {TIME_RANGES.map((r) => (
        <Button
          key={r.hours}
          variant={timeRangeHours === r.hours ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange(r.hours)}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}
