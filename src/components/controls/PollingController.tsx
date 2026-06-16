import { useUIStore } from '@/store/ui-store';
import { POLLING_INTERVALS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PollingController() {
  const pollingInterval = useUIStore((s) => s.pollingInterval);
  const setPollingInterval = useUIStore((s) => s.setPollingInterval);

  return (
    <Select
      value={String(pollingInterval)}
      onValueChange={(v) => setPollingInterval(Number(v))}
    >
      <SelectTrigger className="w-20 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {POLLING_INTERVALS.map((p) => (
          <SelectItem key={p} value={String(p)}>
            {p}s
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
