import { useParams } from "react-router-dom";
import { useGetOneEntityQuery } from "@/store/api/investmentEntityApi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { base_url } from "@/api/GlobalData";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { formatNumber } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { RingLoader } from "react-spinners";
import DocumentRow from "@/components/DocumentCard";
import { Section } from "./Settings";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const FundDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, isLoading } = useGetOneEntityQuery({ id });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RingLoader />
      </div>
    );

  const fund = data?.data;

  return (
    <div
      className="min-h-screen bg-background select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Top Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT — HERO PANEL */}
          <div
            className="lg:col-span-2 rounded-3xl
      bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]
      text-white p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 blur-3xl rounded-full opacity-30" />

            <div className="relative flex items-center gap-5">
              <img
                src={`${base_url}/InvestmentFunds/${fund?.logo}`}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 p-3"
                draggable={false}
              />

              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
                  {fund?.fullLegalName}
                </h1>
                <p className="text-sm text-white/60 mt-1">{fund?.nameAr}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <HeroBadge label={t("fund.fund_code")} value={fund?.code} />
              <HeroBadge
                label={t("fund.share_price")}
                value={`$${fund?.sharePrice}`}
              />
              <HeroBadge
                label={t("fund.issued")}
                value={fund?.shareIssued ? t("common.yes") : t("common.no")}
              />
            </div>
          </div>

          {/* RIGHT — STATS */}
          <div className="grid grid-cols-2 gap-4">
            <StatTile
              label={t("fund.initial_shares")}
              value={formatNumber(fund?.initialShares)}
            />
            <StatTile
              label={t("fund.min_shares")}
              value={formatNumber(fund?.minInvestShare)}
            />
            <StatTile
              label={t("fund.min_shares")}
              value={formatNumber(fund?.maxInvestShare)}
            />
            <StatTile
              label={t("fund.share_price")}
              value={`$${fund?.sharePrice}`}
            />
          </div>
        </div>

        {/* DOCUMENTS SECTION */}
        <div className="rounded-3xl border border-border/50 bg-muted/30 p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-6">
            {t("fund.documents")}
          </h2>

          <Section>
            {fund?.fundInfoFile && (
              <DocumentRow
                title={t("fund.fund_info")}
                file={`${base_url}/InvestmentFunds/${fund?.fundInfoFile}`}
              />
            )}

            {fund?.investingStepsFile && (
              <DocumentRow
                title={t("fund.investment_steps")}
                file={`${base_url}/InvestmentFunds/${fund?.investingStepsFile}`}
              />
            )}

            {fund?.investingRequestFile && (
              <DocumentRow
                title={t("fund.investment_req_form")}
                file={`${base_url}/InvestmentFunds/${fund?.investingRequestFile}`}
              />
            )}

            {fund?.userAgreementFile && (
              <DocumentRow
                title={t("fund.user_agreement")}
                file={`${base_url}/InvestmentFunds/${fund?.userAgreementFile}`}
              />
            )}
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const HeroBadge = ({ label, value }) => (
  <div className="bg-white/10 px-4 py-2 rounded-xl">
    <p className="text-[10px] uppercase text-white/50 tracking-wide">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

const StatTile = ({ label, value }) => (
  <div
    className="
    rounded-2xl
    bg-card
    border border-border/50
    p-4
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl
  "
  >
    <p className="text-[10px] uppercase text-muted-foreground tracking-wide">
      {label}
    </p>
    <p className="mt-1 text-lg md:text-xl font-semibold">{value}</p>
  </div>
);

export default FundDetails;
