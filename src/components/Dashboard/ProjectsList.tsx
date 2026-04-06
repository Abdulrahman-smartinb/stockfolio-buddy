import ProjectCard from "./ProjectCard";
import { InvestmentProject } from "@/interfaces/investmentProject";

type Props = {
  projects: InvestmentProject[];
  isLoading?: boolean;
  lang: string;
  isRtl?: boolean;
  t: (key: string) => string;
  onView: (project: InvestmentProject) => void;
};

const ProjectsList = ({
  projects,
  isLoading = false,
  lang,
  isRtl = false,
  t,
  onView,
}: Props) => {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div>
          {/* <h2 className="text-lg font-semibold text-foreground">
            {t("investment.investment_projects")}
          </h2> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-border bg-card animate-pulse"
            >
              <div className="h-40 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 rounded-2xl bg-muted" />
                  <div className="h-14 rounded-2xl bg-muted" />
                </div>
                <div className="h-10 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!projects?.length) {
    return (
      <section className="space-y-4">
        <div>
          {/* <h2 className="text-lg font-semibold text-foreground">
            {t("investment.investment_projects")}
          </h2> */}
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {t("common.no_records")}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        {/* <h2 className="text-lg font-semibold text-foreground">
          {t("investment.investment_projects")}
        </h2> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id}
            project={project}
            lang={lang}
            isRtl={isRtl}
            t={t}
            onView={onView}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsList;
