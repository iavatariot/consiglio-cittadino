import { useState, useEffect } from 'react';
import { LiveCounters, liveCountersService } from '@/lib/liveCounters';

export function useLiveCounters() {
  const [counters, setCounters] = useState<LiveCounters>(
    liveCountersService.getCounters()
  );

  useEffect(() => {
    const unsubscribe = liveCountersService.subscribe(setCounters);
    return unsubscribe;
  }, []);

  return counters;
}