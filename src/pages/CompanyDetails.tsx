import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useGetOneCompanyQuery } from "@/store/api/investmentEntityApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { base_url } from "@/api/GlobalData";
import { RingLoader } from "react-spinners";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  BriefcaseBusiness,
  CircleDollarSign,
  Users,
  FileText,
} from "lucide-react";
import DocumentRow from "@/components/DocumentCard";

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm font-semibold text-foreground break-words">
          {value || "—"}
        </div>
      </div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
    {children}
  </section>
);

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { data: company, isLoading } = useGetOneCompanyQuery(
    { id: id || "" },
    { skip: !id },
  );

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
        <div className="min-h-[60vh] flex items-center justify-center">
          <RingLoader color="#072522" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t("common.no_records")}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const documents = [
    company.commercialRegistration && {
      title: t("companies.documents.commercial_registration"),
      file: `${base_url}/ClientCompany/${company.commercialRegistration}`,
    },
    company.legalRepAuthority && {
      title: t("companies.documents.legal_rep_authority"),
      file: `${base_url}/ClientCompany/${company.legalRepAuthority}`,
    },
    ...(company.associationMemorandumIncorp || []).map((file, index) => ({
      title: `${t("companies.documents.memorandum")} ${index + 1}`,
      file: `${base_url}/ClientCompany/${file}`,
    })),
    ...(company.associationAndBylaws || []).map((file, index) => ({
      title: `${t("companies.documents.bylaws")} ${index + 1}`,
      file: `${base_url}/ClientCompany/${file}`,
    })),
    ...(company.financialStatements || []).map((file, index) => ({
      title: `${t("companies.documents.financial_statements")} ${index + 1}`,
      file: `${base_url}/ClientCompany/${file}`,
    })),
    ...((company.legalDisclosures?.files
      ? Array.isArray(company.legalDisclosures.files)
        ? company.legalDisclosures.files
        : [company.legalDisclosures.files]
      : []
    ).map((file, index) => ({
      title: `${t("companies.documents.legal_disclosure")} ${index + 1}`,
      file: `${base_url}/ClientCompany/${file}`,
    })) || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="outline" onClick={handleBack} className="rounded-full">
          <span className="inline-flex items-center gap-2">
            <span className={isRtl ? "rotate-180 inline-flex" : "inline-flex"}>
              ←
            </span>
            {t("common.back")}
          </span>
        </Button>

        <section className="rounded-[32px] overflow-hidden border border-border/60 bg-card shadow-sm">
          <div className="bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36] px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl border border-white/15 bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                {company.logo ? (
                  <img
                    src={`${base_url}/ClientCompany/${company.logo}`}
                    alt={company.fullLegalName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-white/80" />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {company.fullLegalName}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/80">
                  <span>{company.tradeName || "—"}</span>
                  <span>•</span>
                  <span>{company.economicSector || "—"}</span>
                  <span>•</span>
                  <span>{company.investmentType || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <InfoCard
              icon={<CircleDollarSign className="w-5 h-5 text-jadwa-gold" />}
              label={t("companies.share_price")}
              value={company.sharePrice}
            />
            <InfoCard
              icon={<Users className="w-5 h-5 text-jadwa-gold" />}
              label={t("companies.initial_shares")}
              value={company.initialShares}
            />
            <InfoCard
              icon={<BriefcaseBusiness className="w-5 h-5 text-jadwa-gold" />}
              label={t("companies.min_invest_share")}
              value={company.minInvestShare}
            />
            <InfoCard
              icon={<BriefcaseBusiness className="w-5 h-5 text-jadwa-gold" />}
              label={t("companies.max_invest_share")}
              value={company.maxInvestShare}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-6">
          <Section title={t("companies.company_info")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<Building2 className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.trade_name")}
                value={company.tradeName}
              />
              <InfoCard
                icon={<BriefcaseBusiness className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.legal_structure")}
                value={company.legalStructure}
              />
              <InfoCard
                icon={<FileText className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.crn")}
                value={company.crn}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.governorate")}
                value={company.governorate}
              />
              <InfoCard
                icon={<MapPin className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.address")}
                value={company.registeredLegalAddress}
              />
              <InfoCard
                icon={<Phone className="w-5 h-5 text-jadwa-gold" />}
                label={t("profile.phone")}
                value={company.phoneNumber || company.phone}
              />
              <InfoCard
                icon={<Mail className="w-5 h-5 text-jadwa-gold" />}
                label={t("profile.email")}
                value={company.email}
              />
              <InfoCard
                icon={<Globe className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.website")}
                value={company.website}
              />
            </div>
          </Section>

          <Section title={t("companies.investment_info")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<BriefcaseBusiness className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.sector")}
                value={company.economicSector}
              />
              <InfoCard
                icon={<BriefcaseBusiness className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.target_markets")}
                value={company.targetMarkets}
              />
              <InfoCard
                icon={<CircleDollarSign className="w-5 h-5 text-jadwa-gold" />}
                label={t("companies.required_investment")}
                value={
                  company.reqInvestAmount?.amount
                    ? `${company.reqInvestAmount.amount} ${company.reqInvestAmount.currency || ""}`
                    : "—"
                }
              />
              <InfoCard
                icon={<TrendingIcon />}
                label={t("companies.exit_strategy")}
                value={company.exitStrategy}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-4">
              <div className="text-sm font-medium text-foreground">
                {t("companies.use_of_proceeds")}
              </div>
              <div
                className="mt-2 text-sm text-muted-foreground leading-7"
                style={{ fontWeight: "500" }}
              >
                {company.useOfProceeds || "—"}
              </div>
            </div>
          </Section>
        </div>

        <Section title={t("companies.owners")}>
          {company.owners?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.owners.map((owner, index) => (
                <div
                  key={`${owner.nationalId}-${index}`}
                  className="rounded-2xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="font-semibold text-foreground">
                    {owner.fullName}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {t("companies.nationality")}: {owner.nationality || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("companies.ownership_percentage")}:{" "}
                    {owner.ownershipPercentage ?? "—"}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("common.no_records")}
            </div>
          )}
        </Section>

        <Section title={t("companies.board_members")}>
          {company.boardMembers?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.boardMembers.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="rounded-2xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="font-semibold text-foreground">
                    {member.name}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {member.position || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("common.no_records")}
            </div>
          )}
        </Section>

        <Section title={t("fund.files")}>
          {documents.length ? (
            <div className="space-y-2">
              {documents.map((document, index) => (
                <DocumentRow
                  key={`${document.title}-${index}`}
                  title={document.title}
                  file={document.file}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("common.no_records")}
            </div>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
};

const TrendingIcon = () => (
  <div className="w-5 h-5 text-jadwa-gold flex items-center justify-center">
    ↗
  </div>
);

export default CompanyDetails;
