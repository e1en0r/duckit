import { useCallback, useRef, useState, useLayoutEffect } from 'react';
import { useAnimationLoop, useSafeTimeout } from '@phork/phorkit';

export type FadingLoaderProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  direction?: 'fadeIn' | 'fadeOut';
  duration?: number;
  loading?: boolean;
};

export const FadingLoader = ({
  children,
  delay = 10,
  direction = 'fadeOut',
  duration = 200,
  loading = false,
  ...props
}: FadingLoaderProps): React.ReactElement | null => {
  const ref = useRef<HTMLDivElement>(null);
  const previousLoading = useRef(loading);
  const timeoutId = useRef<string | undefined>(undefined);
  const [loaderFinishing, setLoaderFinishing] = useState<boolean>();
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimeout();

  const animate = useCallback(
    (percent: number) => {
      if (ref.current) {
        ref.current.style.setProperty('opacity', `${(direction === 'fadeIn' ? percent : 100 - percent) / 100}`);
      }
    },
    [direction],
  );

  const onFinish = useCallback(() => setLoaderFinishing(false), []);

  const { start, stop } = useAnimationLoop({
    animate,
    duration,
    onFinish,
    percent: 0,
    loops: 1,
    manual: true,
  });

  useLayoutEffect(() => {
    if (loading !== previousLoading.current) {
      if (loaderFinishing) {
        if (timeoutId.current) clearSafeTimeout(timeoutId.current);
        stop();
      }

      if (!loading && previousLoading.current) {
        setLoaderFinishing(true);
        timeoutId.current = setSafeTimeout(() => start({}), delay);
      }
      previousLoading.current = loading;
    }
  }, [clearSafeTimeout, delay, loaderFinishing, loading, setSafeTimeout, start, stop]);

  return loading || loaderFinishing ? (
    <div ref={ref} {...props}>
      {children}
    </div>
  ) : null;
};

FadingLoader.displayName = 'FadingLoader';
