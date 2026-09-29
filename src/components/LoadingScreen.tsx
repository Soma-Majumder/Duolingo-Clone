import { DragonMascot } from "./DragonMascot";

/** Full-page placeholder shown while the session or progress is loading. */
export function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <DragonMascot className="h-24 w-24" />
    </div>
  );
}
