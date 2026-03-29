import { useCallback, useEffect, useRef } from "react";

export function useAutoLock(
  timeoutMinutes: number,
  onLock: () => void,
  isActive: boolean,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isActive || timeoutMinutes <= 0) return;
    timerRef.current = setTimeout(onLock, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, onLock, isActive]);

  useEffect(() => {
    if (!isActive) return;
    const events = ["mousemove", "touchstart", "keydown", "click"];
    for (const e of events) {
      window.addEventListener(e, resetTimer, { passive: true });
    }
    resetTimer();
    return () => {
      for (const e of events) {
        window.removeEventListener(e, resetTimer);
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, isActive]);
}
