export function OwlMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="66" rx="38" ry="42" fill="var(--color-duo-green)" />
      <path d="M28 40c-6-10-4-22 4-26 4 8 4 16 2 24Z" fill="var(--color-duo-green)" />
      <path d="M92 40c6-10 4-22-4-26-4 8-4 16-2 24Z" fill="var(--color-duo-green)" />
      <circle cx="44" cy="58" r="16" fill="white" />
      <circle cx="76" cy="58" r="16" fill="white" />
      <circle cx="44" cy="60" r="7" fill="var(--color-duo-eel)" />
      <circle cx="76" cy="60" r="7" fill="var(--color-duo-eel)" />
      <path d="M56 68l4 8 4-8Z" fill="var(--color-duo-orange)" />
      <ellipse cx="60" cy="96" rx="14" ry="7" fill="var(--color-duo-orange)" />
      <path d="M18 78c-8 4-10 12-6 18 6-2 12-8 14-14Z" fill="var(--color-duo-green-dark)" />
      <path d="M102 78c8 4 10 12 6 18-6-2-12-8-14-14Z" fill="var(--color-duo-green-dark)" />
    </svg>
  );
}
