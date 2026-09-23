export function FlameIcon({ className = "", active = true }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2c.6 2.2-.4 3.6-1.6 5-1.4 1.6-2.9 3.3-2.9 6a4.5 4.5 0 0 0 9 0c0-1.4-.5-2.4-1.1-3.3.9.4 1.6 1.4 1.6 3.3a6 6 0 1 1-12 0c0-3.6 2-5.6 3.7-7.4C10 4.4 11 3.4 12 2Z"
        fill={active ? "var(--color-duo-orange)" : "var(--color-duo-gray-300)"}
        stroke={active ? "var(--color-duo-orange-dark)" : "var(--color-duo-gray-400)"}
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        fill="var(--color-duo-yellow)"
        stroke="var(--color-duo-yellow-dark)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="var(--color-duo-gray-400)" />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="var(--color-duo-gray-400)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13l4 4 10-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5-4.9-4.5 6.6-.7L12 2.5Z"
        fill="white"
      />
    </svg>
  );
}
