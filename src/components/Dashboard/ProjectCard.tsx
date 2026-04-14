import { motion } from "framer-motion";
import { ArrowUpRight, Building2 } from "lucide-react";
import { InvestmentProject } from "@/interfaces/investmentProject";
import { base_url } from "@/api/GlobalData";

type Props = {
  project: InvestmentProject;
  lang: string;
  isRtl?: boolean;
  t: (key: string) => string;
  onView: (project: InvestmentProject) => void;
  index?: number;
};

const ProjectCard = ({ project, lang, onView, index = 0 }: Props) => {
  const projectName =
    lang === "ar"
      ? project.nameAr || project.name || ""
      : project.name || project.nameAr || "";

  const categoryName =
    typeof project.category === "object" && project.category
      ? lang === "ar"
        ? project.category.nameAr || project.category.name || "-"
        : project.category.name || project.category.nameAr || "-"
      : "-";

  const logoSrc = project.logo
    ? `${base_url}/investmentProjects/${project.logo}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onView(project)}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted/30 p-5">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-14 w-14 rounded-2xl border border-border/80 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={projectName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">
                {projectName}
              </h3>
              <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {categoryName}
              </div>
            </div>
          </div>

          <div className="h-10 w-10 rounded-full border border-border/70 bg-background/80 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
