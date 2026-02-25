import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { base_url } from "@/api/GlobalData";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { formatNumber } from "@/lib/utils";
import { RingLoader } from "react-spinners";
import DocumentRow from "@/components/DocumentCard";
import { Section } from "./Settings";
import useFundDetails from "@/hooks/useFundDetails";
import FundNetFlowChart from "@/components/FundNetFlowChart";
import { useState } from "react";
import { formatCurrency } from "@/hooks/helpers";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const FundDetails = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* ===============================
            DARK TRADING SECTION
        =============================== */}
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
                <p className="text-xs text-emerald-400">Total Invested</p>
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
                )
              )}
            </div>
          </div>
        </div>

        {/* ===============================
            TABS SECTION
        =============================== */}
        <div className="relative rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/40 p-2 shadow-xl overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-400/5 blur-3xl rounded-full" />

          {/* ===============================
      SEGMENTED TABS
=============================== */}
          <div className="relative z-10 flex justify-center mb-8">
            <div className="bg-muted/40 backdrop-blur-md p-1 rounded-2xl flex gap-1">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                label="Overview"
              />
              <TabButton
                active={activeTab === "files"}
                onClick={() => setActiveTab("files")}
                label="Files"
              />
            </div>
          </div>

          {/* ===============================
      CONTENT
=============================== */}

          {activeTab === "overview" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoCard label="Fund Code" value={fund?.code} />
              <InfoCard
                label="Issued"
                value={fund?.shareIssued ? "Yes" : "No"}
              />
              <InfoCard
                label="Created At"
                value={new Date(fund?.createdAt).toLocaleDateString()}
              />
              <InfoCard
                label="Last Updated"
                value={new Date(fund?.updatedAt).toLocaleDateString()}
              />
            </div>
          )}

          {activeTab === "files" && (
            <div className="relative z-10 space-y-4">
              {fund?.fundInfoFile && (
                <DocumentRow
                  title="Fund Info"
                  file={`${base_url}/InvestmentFunds/${fund.fundInfoFile}`}
                />
              )}
              {fund?.investingStepsFile && (
                <DocumentRow
                  title="Investment Steps"
                  file={`${base_url}/InvestmentFunds/${fund.investingStepsFile}`}
                />
              )}
              {fund?.investingRequestFile && (
                <DocumentRow
                  title="Investment Form"
                  file={`${base_url}/InvestmentFunds/${fund.investingRequestFile}`}
                />
              )}
              {fund?.userAgreementFile && (
                <DocumentRow
                  title="User Agreement"
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

      <span
        className="
        text-sm
        font-semibold
        tracking-tight
        text-foreground
      "
      >
        {value}
      </span>
    </div>

    {/* Subtle bottom accent line */}
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
