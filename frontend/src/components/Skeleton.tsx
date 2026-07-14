// Placeholder animation shown while data is loading.
interface Props {
  className?: string;
}

export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`bg-surface-800 rounded-lg animate-pulse ${className}`}
    />
  );
}