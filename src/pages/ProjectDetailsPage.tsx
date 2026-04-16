import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  ShieldAlert,
  FolderOpen,
  Download,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  BarChart3,
  NotebookText,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  useGetOneInvestmentProjectQuery,
  useToggleProjectInterestMutation,
} from "@/store/api/investmentProjectsApi";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const riskClassMap: Record<string, string> = {
  low: "bg-emerald-500/15 text-emerald-50 border-emerald-300/20",
  medium: "bg-amber-500/15 text-amber-50 border-amber-300/20",
  high: "bg-red-500/15 text-red-50 border-red-300/20",
};

const riskPlainClassMap: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="rounded-[28px] border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm">
    <div className="flex items-center gap-2 px-5 md:px-6 pt-5 md:pt-6 pb-3">
      {icon}
      <h2 className="text-base md:text-lg font-semibold text-foreground">
        {title}
      </h2>
    </div>
    <div className="px-5 md:px-6 pb-5 md:pb-6">{children}</div>
  </section>
);

const MetricCard = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div
      className={cn(
        "mt-2 text-sm md:text-[15px] font-semibold text-foreground",
        mono && "font-mono",
      )}
    >
      {value || "-"}
    </div>
  </div>
);

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const profileCookie = Cookies.get("profile");
  const profile = profileCookie ? JSON.parse(profileCookie) : null;

  const { data: project, isLoading } = useGetOneInvestmentProjectQuery(
    { id: id || "" },
    { skip: !id },
  );
  const [toggleProjectInterest, { isLoading: isUpdatingInterest }] =
    useToggleProjectInterestMutation();

  const handleBack = () => {
    navigate(location.state?.from || "/", {
      replace: true,
      state: { restoreScrollY: location.state?.restoreScrollY ?? 0 },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
        <Header />
        <main className="container mx-auto p-4 pb-[120px] max-w-6xl">
          <div className="space-y-5 animate-pulse">
            <div className="h-10 w-32 rounded-full bg-muted" />
            <div className="rounded-[32px] overflow-hidden border border-border bg-card">
              <div className="h-72 bg-muted" />
              <div className="p-6 space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-muted" />
                <div className="h-7 w-1/2 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-20 rounded-2xl bg-muted" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
        <Header />
        <main className="container mx-auto p-4 pb-[120px] max-w-6xl">
          <div className="rounded-[28px] border border-border bg-card p-8 text-center text-muted-foreground">
            {t("common.no_records")}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const projectName =
    i18n.language === "ar"
      ? project.nameAr || project.name || ""
      : project.name || project.nameAr || "";

  const displayBrief =
    i18n.language === "ar"
      ? project.briefAr || project.brief || ""
      : project.brief || project.briefAr || "";

  const displayDescription =
    i18n.language === "ar"
      ? project.fullDescriptionAr || project.fullDescription || ""
      : project.fullDescription || project.fullDescriptionAr || "";

  const categoryName =
    typeof project.category === "object" && project.category
      ? i18n.language === "ar"
        ? project.category.nameAr || project.category.name || "-"
        : project.category.name || project.category.nameAr || "-"
      : "-";

  const logoSrc = project.logo
    ? `${base_url}/investmentProjects/${project.logo}`
    : null;

  const heroSrc = project.coverImage
    ? `${base_url}/investmentProjects/${project.coverImage}`
    : project.images?.[0]?.url
      ? `${base_url}/investmentProjects/${project.images[0].url}`
      : logoSrc;

  const images = project.images || [];
  const attachments = project.attachments || [];
  const interestedUsers = project.interestedUsers || [];
  const isInterested = profile?.authUserId
    ? interestedUsers.some(
        (userId: string) => String(userId) === String(profile.authUserId),
      )
    : false;

  const handleInterestToggle = async () => {
    if (!project?._id) return;
    await toggleProjectInterest({ id: project._id }).unwrap();
  };

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto p-4 pb-[120px] max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div className="hidden md:block">
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-full"
            >
              <span
                className={cn(
                  "inline-flex items-center gap-2",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className={cn("inline-flex", isRtl && "rotate-180")}>
                  ←
                </span>
                {t("common.back")}
              </span>
            </Button>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-sm">
            <div className="relative h-[260px] md:h-[340px] lg:h-[380px] bg-muted">
              {heroSrc ? (
                <img
                  src={heroSrc}
                  alt={projectName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  {t("common.no_image")}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

              <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white">
                  {categoryName}
                </span>

                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium capitalize backdrop-blur-md",
                    riskClassMap[
                      project.investmentData?.riskLevel || "medium"
                    ] || riskClassMap.medium,
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {t(
                      `investment.${String(
                        project.investmentData?.riskLevel?.toLowerCase() ||
                          "medium",
                      )}`,
                    )}
                  </span>
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={projectName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg md:text-xl font-semibold text-white">
                        {projectName?.charAt(0)?.toUpperCase() || "P"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl md:text-3xl font-semibold text-white line-clamp-2">
                      {projectName}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location || "-"}
                      </span>

                      <span className="hidden md:inline text-white/50">•</span>

                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString()
                          : "-"}
                      </span>

                      {/* <span className="hidden md:inline text-white/50">•</span>

                      <span className="inline-flex items-center gap-1 capitalize">
                        <FolderOpen className="w-4 h-4" />
                        {categoryName}
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {displayBrief ? (
              <div className="px-5 md:px-6 py-5 pb-2 border-t border-border/50 bg-card">
                <p
                  className="text-sm md:text-base leading-7"
                  style={{ fontWeight: "500", color: "#505050" }}
                >
                  {displayBrief}
                </p>
              </div>
            ) : null}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_.85fr] gap-5">
            <SectionCard
              title={t("common.desc")}
              icon={<NotebookText className="w-5 h-5 text-muted-foreground" />}
            >
              <div
                className="text-sm md:text-base leading-8 whitespace-pre-wrap"
                style={{ fontWeight: "500", color: "#505050" }}
              >
                {displayDescription || "-"}
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title={t("investment.investment_data")}
            icon={<BarChart3 className="w-5 h-5 text-muted-foreground" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                label={t("investment.expected_project_cost")}
                value={`${Number(
                  project.investmentData?.expectedProjectCost || 0,
                ).toLocaleString()} USD`}
                mono
              />
              <MetricCard
                label={t("investment.return_profit_margin")}
                value={`${project.investmentData?.returnProfitMargin ?? 0}%`}
                mono
              />
              <MetricCard
                label={t("investment.profitability_index")}
                value={project.investmentData?.profitabilityIndex ?? 0}
                mono
              />
              <MetricCard
                label={t("investment.expected_irr")}
                value={`${project.investmentData?.expectedIRR ?? 0}%`}
                mono
              />
              <MetricCard
                label={t("investment.expected_roi")}
                value={`${project.investmentData?.expectedROI ?? 0}%`}
                mono
              />
              <MetricCard
                label={t("investment.paycheck_period")}
                value={`${project.investmentData?.paybackPeriodYears ?? 0} ${t(
                  "common.year",
                )}`}
                mono
              />
              <MetricCard
                label={t("investment.project_stage")}
                value={
                  t(`investment.${project.investmentData?.projectStage}`) || "-"
                }
              />
              <MetricCard
                label={t("investment.risk_level")}
                value={
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                      riskPlainClassMap[
                        project.investmentData?.riskLevel || "medium"
                      ] || riskPlainClassMap.medium,
                    )}
                  >
                    {t(
                      `investment.${String(
                        project.investmentData?.riskLevel?.toLowerCase() ||
                          "medium",
                      )}`,
                    )}
                  </span>
                }
              />
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard
              title={t("investment.exit_plan")}
              icon={<TrendingUp className="w-5 h-5 text-muted-foreground" />}
            >
              <div
                className="text-sm leading-7 whitespace-pre-wrap"
                style={{ fontWeight: "500", color: "#505050" }}
              >
                {project.investmentData?.exitPlan || "-"}
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-background/70 px-4 py-3">
                <div className="text-xs text-muted-foreground">
                  {t("investment.exit_duration")}
                </div>
                <div
                  className="mt-1 text-sm font-semibold"
                  style={{ fontWeight: "500", color: "#505050" }}
                >
                  {project.exitDuration ?? 0} {t("common.year")}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={t("common.notes")}
              icon={<NotebookText className="w-5 h-5 text-muted-foreground" />}
            >
              <div
                className="text-sm text-muted-foreground leading-7 whitespace-pre-wrap"
                style={{ fontWeight: "500" }}
              >
                {project.investmentData?.notes || "-"}
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title={t("common.images")}
            icon={<ImageIcon className="w-5 h-5 text-muted-foreground" />}
          >
            {images.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div
                    key={`${img.url}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-muted"
                  >
                    <img
                      src={`${base_url}/investmentProjects/${img.url}`}
                      alt={img.alt || `project-image-${index}`}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">-</div>
            )}
          </SectionCard>

          <SectionCard
            title={t("common.attachments")}
            icon={<FileText className="w-5 h-5 text-muted-foreground" />}
          >
            {attachments.length ? (
              <div className="space-y-3">
                {attachments.map((file, index) => (
                  <a
                    key={`${file.fileUrl}-${index}`}
                    href={`${base_url}/investmentProjects/${file.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3 hover:bg-background transition"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {file.title || file.fileUrl}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.fileType || "-"}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">-</div>
            )}
          </SectionCard>
        </motion.div>
      </main>

      <div className="fixed top-20 md:top-auto md:bottom-4 left-0 right-0 z-30 px-4">
        <div className="container mx-auto flex max-w-6xl justify-end">
          <div className="rounded-full border border-border/70 bg-background/92 p-2 shadow-lg backdrop-blur-md">
            <Button
              type="button"
              onClick={handleInterestToggle}
              disabled={isUpdatingInterest}
              className="rounded-full px-5"
            >
              {isInterested
                ? t("investment.interested_active")
                : t("investment.interested")}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;
