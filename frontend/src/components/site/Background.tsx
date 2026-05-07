export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[var(--violet)]/30 blur-[120px] animate-blob" />
      <div className="absolute top-40 -right-40 h-[500px] w-[700px] rounded-full bg-[var(--electric)]/25 blur-[120px] animate-blob" style={{ animationDelay: "4s" }} />
      <div className="absolute bottom-0 -left-40 h-[500px] w-[700px] rounded-full bg-[var(--cyan)]/20 blur-[120px] animate-blob" style={{ animationDelay: "8s" }} />
      <div className="absolute inset-0 grid-bg opacity-50" />
    </div>
  );
}
