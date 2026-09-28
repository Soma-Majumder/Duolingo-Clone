export function SoundToggle({
  enabled,
  ready,
  onToggle,
}: {
  enabled: boolean;
  ready: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Sound effects"
      aria-pressed={enabled}
      disabled={!ready}
      onClick={onToggle}
      className="shrink-0 rounded-xl border-2 border-duo-gray-200 px-3 py-2 text-sm font-bold text-duo-eel hover:bg-duo-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duo-blue disabled:opacity-50"
    >
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
