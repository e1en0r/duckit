function shallowDiffers(prev: Record<string, unknown>, next: Record<string, unknown>): boolean {
  if (Object.keys(prev).some(key => prev[key] !== next[key])) return true;
  if (Object.keys(next).some(key => prev[key] !== next[key])) return true;
  return false;
}

// [source] https://github.com/bvaughn/react-window/blob/master/src/areEqual.js
export function areEqual(
  prevProps: { style: React.CSSProperties; isScrolling?: boolean; [key: string]: unknown },
  nextProps: { style: React.CSSProperties; isScrolling?: boolean; [key: string]: unknown },
): boolean {
  const { style: prevStyle, isScrolling: prevIsScrolling, ...prevRest } = prevProps;
  const { style: nextStyle, isScrolling: nextIsScrolling, ...nextRest } = nextProps;

  return (
    !shallowDiffers(prevStyle as Record<string, unknown>, nextStyle as Record<string, unknown>) &&
    !shallowDiffers(prevRest, nextRest) &&
    (nextIsScrolling ?? nextIsScrolling === prevIsScrolling)
  );
}
