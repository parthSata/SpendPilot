import { Link } from "@tanstack/react-router";
import { Share2, Copy, Check, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResultsCtaSectionProps = {
  copied: boolean;
  shareUrl: string;
  onCopy: () => void;
  onOpenLeadModal: () => void;
};

export function ResultsCtaSection({ copied, shareUrl, onCopy, onOpenLeadModal }: ResultsCtaSectionProps) {
  return (
    <div className="mt-12 grid md:grid-cols-2 gap-6">
      <div className="glass-strong rounded-2xl p-6 gradient-border">
        <Share2 className="h-5 w-5 text-cyan" />
        <h3 className="mt-3 text-lg font-semibold">Share this report</h3>
        <p className="mt-1 text-sm text-muted-foreground">Send to your team or post on social.</p>
        <div className="mt-4 flex items-center gap-2 glass rounded-lg p-2">
          <input
            readOnly
            value={shareUrl.replace("https://", "")}
            className="flex-1 bg-transparent text-sm font-mono px-2 outline-none"
          />
          <Button size="sm" variant="hero" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <Link to="/report" className="mt-3 inline-block text-xs text-muted-foreground hover:text-foreground">
          Preview public page →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl p-6 gradient-border bg-linear-to-br from-(--violet)/20 to-(--electric)/20">
        <MessageSquare className="h-5 w-5 text-cyan" />
        <h3 className="mt-3 text-lg font-semibold">You qualify for a Credex consultation</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Teams saving over $1k/mo get a free 30-min call to lock in these wins.
        </p>
        <Button variant="hero" className="mt-4" onClick={onOpenLeadModal}>
          Book consultation <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
