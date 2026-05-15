import { Link } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-df-charcoal/10 px-8 py-8 flex justify-between items-center ">
      <div className="flex items-center gap-6">
        <span className="font-mono text-[10px] text-df-charcoal/40 uppercase tracking-widest">
          Deckforge
        </span>
        <Link to="/privacy" className="font-mono text-[10px] text-df-charcoal/40 uppercase tracking-widest hover:text-df-charcoal transition-colors">
          Privacy Policy
        </Link>
        </div>
        <span className="font-mono text-[10px] text-df-charcoal uppercase tracking-widest">
        Coherence Over Compromise.
        </span>
    </footer>

  );
}
