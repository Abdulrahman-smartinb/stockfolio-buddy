import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { base_url } from "@/api/GlobalData";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { RingLoader } from "react-spinners";
import DocumentRow from "@/components/DocumentCard";
import useFundDetails from "@/hooks/useFundDetails";
import FundNetFlowChart from "@/components/FundNetFlowChart";
import { useState } from "react";
import { formatCurrency } from "@/hooks/helpers";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Building2,
  FolderOpen,
  MapPin,
  Tag,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const normalizeDisplayName = (item, lang, fallbacks = []) => {
  if (!item) return null;
  if (typeof item === "string") return item;

  const candidates =
    lang === "ar"
      ? [
          item.nameAr,
          item.tradeName,
          item.fullLegalName,
          item.name,
          ...fallbacks,
        ]
      : [
          item.fullLegalName,
          item.name,
          item.tradeName,
          item.nameAr,
          ...fallbacks,
        ];

  return (
    candidates.find((value) => typeof value === "string" && value.trim()) ||
    null
  );
};

const normalizeItems = (items) =>
  Array.isArray(items) ? items.filter(Boolean) : [];

const FundDetails = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  type RangeType = "24H" | "7D" | "1M" | "3M" | "1Y" | "ALL";

  const [range, setRange] = useState<RangeType>("1M");

  const { fund, netTimeline, isLoading, netLoading } = useFundDetails(range);

  const [activeTab, setActiveTab] = useState<"overview" | "files">("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RingLoader />
      </div>
    );
  }

  const currentShares =
    netTimeline.length > 0 ? netTimeline[netTimeline.length - 1].total : 0;

  const currentInvestment = currentShares * (fund?.sharePrice || 0);
  const fundCategory = normalizeDisplayName(fund?.category, i18n.language);
  const fundTags = normalizeItems(fund?.tags).map((tag) =>
    typeof tag === "string" ? tag : normalizeDisplayName(tag, i18n.language),
  );

  const linkedCompanies = normalizeItems(fund?.linkedCompanies);
  const linkedProjects = normalizeItems(fund?.linkedProjects);
  const allocationSummary = fund?.allocationSummary;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* DARK TRADING SECTION */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-[#0f3a36] text-white px-6 pt-6 pb-6">
            {/* Floating Fund Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                {fund?.logo ? (
                  <img
                    src={`${base_url}/InvestmentFunds/${fund.logo}`}
                    className="w-10 h-10 rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                    {fund?.fullLegalName?.slice(0, 2)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-sm">{fund?.fullLegalName}</p>
                  <p className="text-xs text-white/60">{fund?.code}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">
                  {formatCurrency(currentInvestment)}
                </p>
                <p className="text-xs text-emerald-400">
                  {t("portfolio.total_invested")}
                </p>
              </div>
            </div>

            {/* Chart */}
            <FundNetFlowChart data={netTimeline} loading={netLoading} />

            <div className="flex justify-center gap-3 mt-4 text-xs">
              {(["ALL", "1Y", "3M", "1M", "7D", "24H"] as RangeType[]).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-full transition
        ${
          range === r
            ? "bg-emerald-400 text-black font-semibold"
            : "bg-white/10 hover:bg-white/20 text-white"
        }
      `}
                  >
                    {r}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="relative rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/40 p-2 shadow-xl overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-400/5 blur-3xl rounded-full" />

          {/* SEGMENTED TABS */}
          <div className="relative z-10 flex justify-center mb-8">
            <div className="bg-muted/40 backdrop-blur-md p-1 rounded-2xl flex gap-1">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                label={t("fund.overview")}
              />
              <TabButton
                active={activeTab === "files"}
                onClick={() => setActiveTab("files")}
                label={t("fund.files")}
              />
            </div>
          </div>

          {/* CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard label={t("fund.fund_code")} value={fund?.code} />
                <InfoCard
                  label={t("fund.issued")}
                  value={fund?.shareIssued ? t("common.yes") : t("common.no")}
                />
                <InfoCard
                  label={t("fund.treasury_shares")}
                  value={fund?.treasuryShares ?? 0}
                />
                <InfoCard
                  label={t("fund.total_fund_value")}
                  value={formatCurrency(allocationSummary?.totalFundValue ?? 0)}
                />
                <InfoCard
                  label={t("fund.allocated_amount")}
                  value={formatCurrency(
                    allocationSummary?.totalAllocatedAmount ?? 0,
                  )}
                />
                <InfoCard
                  label={t("fund.unallocated_amount")}
                  value={formatCurrency(
                    allocationSummary?.remainingUnallocatedAmount ?? 0,
                  )}
                />
                <InfoCard
                  label={t("common.created_at")}
                  value={new Date(fund?.createdAt).toLocaleDateString()}
                />
                <InfoCard
                  label={t("common.last_updated")}
                  value={new Date(fund?.updatedAt).toLocaleDateString()}
                />
              </div>

              {(fundCategory || fundTags.length > 0) && (
                <section className="rounded-3xl border border-border/50 bg-background/60 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    {fundCategory ? (
                      <MetaBadge
                        icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
                        label={t("fund.category")}
                        value={fundCategory}
                      />
                    ) : null}

                    {fundTags.map((tag) =>
                      tag ? (
                        <MetaBadge
                          key={tag}
                          icon={<Tag className="h-3.5 w-3.5" />}
                          label={t("fund.tag")}
                          value={tag}
                        />
                      ) : null,
                    )}
                  </div>
                </section>
              )}

              {(linkedCompanies.length > 0 || linkedProjects.length > 0) && (
                <div className="grid gap-5 xl:grid-cols-2">
                  <AssociationSection
                    title={t("fund.associated_companies")}
                    emptyLabel={t("common.no_records")}
                    icon={<Building2 className="h-5 w-5 text-emerald-500" />}
                  >
                    {linkedCompanies.length ? (
                      <div className="grid gap-3">
                        {linkedCompanies.map((linkedCompany, index) => {
                          const company = linkedCompany?.company;
                          const companyName = normalizeDisplayName(
                            company,
                            i18n.language,
                          );
                          const sector =
                            typeof company === "string"
                              ? null
                              : company?.economicSector || company?.tradeName;

                          return (
                            <AssociationCard
                              key={`${companyName}-${index}`}
                              title={companyName || t("app.unknown_asset")}
                              subtitle={sector}
                              imageSrc={
                                typeof company === "string" || !company?.logo
                                  ? null
                                  : `${base_url}/ClientCompany/${company.logo}`
                              }
                              fallbackLabel={companyName}
                              badgeValue={formatCurrency(
                                linkedCompany?.allocatedAmount ?? 0,
                              )}
                              onClick={
                                typeof company === "string" || !company?._id
                                  ? undefined
                                  : () =>
                                      navigate(
                                        `/company-details/${company._id}`,
                                        {
                                          state: {
                                            from: location.pathname,
                                            restoreScrollY: window.scrollY,
                                          },
                                        },
                                      )
                              }
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState label={t("common.no_records")} />
                    )}
                  </AssociationSection>

                  <AssociationSection
                    title={t("fund.associated_projects")}
                    emptyLabel={t("common.no_records")}
                    icon={<FolderOpen className="h-5 w-5 text-emerald-500" />}
                  >
                    {linkedProjects.length ? (
                      <div className="grid gap-3">
                        {linkedProjects.map((linkedProject, index) => {
                          const project = linkedProject?.project;
                          const projectName = normalizeDisplayName(
                            project,
                            i18n.language,
                          );
                          const category =
                            typeof project === "string"
                              ? null
                              : normalizeDisplayName(
                                  project?.category,
                                  i18n.language,
                                );
                          const subtitle =
                            typeof project === "string"
                              ? null
                              : [category, project?.location]
                                  .filter(Boolean)
                                  .join(" • ");

                          return (
                            <AssociationCard
                              key={`${projectName}-${index}`}
                              title={projectName || t("app.unknown_asset")}
                              subtitle={subtitle}
                              imageSrc={
                                typeof project === "string" || !project?.logo
                                  ? null
                                  : `${base_url}/investmentProjects/${project.logo}`
                              }
                              fallbackLabel={projectName}
                              badgeValue={formatCurrency(
                                linkedProject?.allocatedAmount ?? 0,
                              )}
                              onClick={
                                typeof project === "string" || !project?._id
                                  ? undefined
                                  : () =>
                                      navigate(
                                        `/project-details/${project._id}`,
                                        {
                                          state: {
                                            from: location.pathname,
                                            restoreScrollY: window.scrollY,
                                          },
                                        },
                                      )
                              }
                            >
                              {typeof project !== "string" &&
                              project?.location ? (
                                <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {project.location}
                                </div>
                              ) : null}
                            </AssociationCard>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState label={t("common.no_records")} />
                    )}
                  </AssociationSection>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="relative z-10 space-y-4">
              {fund?.fundInfoFile && (
                <DocumentRow
                  title={t("fund.fund_info")}
                  file={`${base_url}/InvestmentFunds/${fund.fundInfoFile}`}
                />
              )}
              {fund?.investingStepsFile && (
                <DocumentRow
                  title={t("fund.investment_steps")}
                  file={`${base_url}/InvestmentFunds/${fund.investingStepsFile}`}
                />
              )}
              {fund?.investingRequestFile && (
                <DocumentRow
                  title={t("fund.investment_req_form")}
                  file={`${base_url}/InvestmentFunds/${fund.investingRequestFile}`}
                />
              )}
              {fund?.userAgreementFile && (
                <DocumentRow
                  title={t("fund.user_agreement")}
                  file={`${base_url}/InvestmentFunds/${fund.userAgreementFile}`}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div
    className="
    group
    relative
    rounded-2xl
    border border-border/40
    bg-gradient-to-br from-card to-card/80
    px-5 py-3
    transition-all duration-300
    hover:border-emerald-400/40
    hover:shadow-lg
  "
  >
    <div className="flex items-center justify-between">
      <span
        className="
        text-xs
        uppercase
        tracking-wide
        text-muted-foreground
        transition-colors
        group-hover:text-foreground
      "
      >
        {label}
      </span>

      <span className="text-sm font-semibold tracking-tight text-foreground">
        {value}
      </span>
    </div>

    <div
      className="
      absolute
      bottom-0 left-0
      h-[2px]
      w-0
      bg-emerald-400
      transition-all duration-300
      group-hover:w-full
    "
    />
  </div>
);

const MetaBadge = ({ icon, label, value }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-2 text-sm text-foreground">
    <span className="text-emerald-500">{icon}</span>
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const AssociationSection = ({ title, icon, children }) => (
  <section className="rounded-3xl border border-border/50 bg-background/60 p-5">
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </section>
);

const AssociationCard = ({
  title,
  subtitle,
  imageSrc,
  fallbackLabel,
  badgeValue,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    className={cn(
      "w-full rounded-2xl border border-border/60 bg-card/90 p-4 text-left transition-all",
      onClick
        ? "hover:border-emerald-400/50 hover:shadow-md"
        : "cursor-default",
    )}
  >
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border/50">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-bold text-foreground/70">
            {String(fallbackLabel || title || "?")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
            {badgeValue ? (
              <div className="mt-2 inline-flex rounded-full border border-emerald-500/15 bg-emerald-500/8 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {badgeValue}
              </div>
            ) : null}
          </div>

          {onClick ? (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/80 text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  </button>
);

const EmptyState = ({ label }) => (
  <div className="rounded-2xl border border-dashed border-border/60 bg-card/60 px-4 py-6 text-center text-sm text-muted-foreground">
    {label}
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`
      px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200
      ${
        active
          ? "bg-primary text-white shadow-md"
          : "text-muted-foreground hover:text-foreground"
      }
    `}
  >
    {label}
  </button>
);

export default FundDetails;
