import { motion } from "framer-motion";
import { useRef, useState } from "react";
import SummaryCard from "../SummaryCard";
import CompanyCard from "../CompanyCard";

// Main Slider
export default function InvestmentsSlider({ t, portfolio, isRtl }: any) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const summary = portfolio?.data?.summary || {};
  const assets = portfolio?.data?.assets || [];

  const updateProgress = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <div
        ref={scrollerRef}
        onScroll={updateProgress}
        className="
        flex gap-4
        overflow-x-auto snap-x snap-mandatory scrollbar-hidden
        md:my-6
      "
      >
        <SummaryCard t={t} summary={summary} />
        {assets.map((row: any) => (
          <CompanyCard key={row.assetId} row={row} t={t} isRtl={isRtl} />
        ))}
      </div>

      <div className="mt-2 h-0.5 w-[90%] mx-auto bg-muted/30 rounded-full">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${scrollProgress}%`, backgroundColor: "#0a3330" }}
        />
      </div>
    </motion.div>
  );
}
