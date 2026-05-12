import { Slider } from "@/components/ui/slider";

interface TeamStepProps {
  teamSize: number;
  setTeamSize: (n: number) => void;
}

export function TeamStep({ teamSize, setTeamSize }: TeamStepProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">What's your total company size?</h2>
      <p className="mt-2 text-muted-foreground text-sm">This helps us benchmark your spend against similar teams.</p>
      <div className="mt-10 glass rounded-2xl p-8">
        <div className="text-center">
          <div className="text-7xl font-bold gradient-text">{teamSize}</div>
          <div className="mt-1 text-sm text-muted-foreground">{teamSize === 1 ? "person" : "people"}</div>
        </div>
        <div className="mt-8">
          <Slider value={[teamSize]} onValueChange={(v) => setTeamSize(v[0])} min={1} max={100} step={1} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>100+</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {[1, 5, 15, 50].map((n) => (
            <button
              key={n}
              onClick={() => setTeamSize(n)}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                teamSize === n ? "bg-white/10 border border-white/20" : "bg-white/3 border border-white/5 hover:bg-white/5"
              }`}
            >
              {n === 1 ? "Solo" : n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
