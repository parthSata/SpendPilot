import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LandingFaq } from "@/hooks/useLandingPage";
import { SectionHeader } from "@/components/features/home/components/SectionHeader";

type FaqSectionProps = {
  faqs: LandingFaq[];
  openFaq: number | null;
  toggleFaq: (index: number) => void;
};

export function FaqSection({ faqs, openFaq, toggleFaq }: FaqSectionProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeader tag="FAQ" title="Questions, answered" />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/3 transition"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-sm text-muted-foreground">{faq.a}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
