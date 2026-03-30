import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvestmentProject } from "@/interfaces/investmentProject";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";

type Props = {
  project: InvestmentProject;
  lang: string;
  isRtl?: boolean;
  t: (key: string) => string;
  onView: (project: InvestmentProject) => void;
  index?: number;
};

const riskClassMap: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const ProjectCard = ({
  project,
  lang,
  isRtl = false,
  t,
  onView,
  index = 0,
}: Props) => {
  const brief =
    lang === "ar"
      ? project.briefAr || project.brief || ""
      : project.brief || project.briefAr || "";

  const categoryName =
    typeof project.category === "object" && project.category
      ? lang === "ar"
        ? project.category.nameAr || project.category.name || "-"
        : project.category.name || project.category.nameAr || "-"
      : "-";

  const logoSrc = project.logo
    ? `${base_url}/investmentProjects/${project.logo}`
    : null;

  const expectedCost = Number(project.investmentData?.expectedProjectCost || 0);
  const expectedROI = Number(project.investmentData?.expectedROI || 0);
  const riskLevel = project.investmentData?.riskLevel || "medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group rounded-3xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl border border-border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {project.name?.charAt(0)?.toUpperCase() || "P"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1">
                {project.name}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="line-clamp-1">{categoryName}</span>
              </div>
            </div>
          </div>

          {/* <span
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium capitalize shrink-0",
              riskClassMap[riskLevel] || riskClassMap.medium
            )}
          >
            {t(`INVESTMENT.${riskLevel.toUpperCase()}`)}
          </span> */}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{project.location || "-"}</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {brief || "-"}
        </p>

        {/* <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-border bg-muted/30 px-3 py-2">
            <div className="text-[10px] text-muted-foreground">
              {t("INVESTMENT.EXPECTED_ROI")}
            </div>
            <div className="mt-1 text-sm font-semibold">{expectedROI}%</div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-3 py-2">
            <div className="text-[10px] text-muted-foreground">
              {t("INVESTMENT.EXPECTED_PROJECT_COST")}
            </div>
            <div className="mt-1 text-sm font-semibold font-mono truncate">
              {expectedCost.toLocaleString()} USD
            </div>
          </div>
        </div> */}

        <Button onClick={() => onView(project)} className="w-full rounded-full">
          {t("GENERAL.SHOW")}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
