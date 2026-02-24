import { useParams } from "react-router-dom";
import { useGetOneEntityQuery } from "@/store/api/investmentEntityApi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { base_url } from "@/api/GlobalData";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { formatNumber } from "@/lib/utils";
import DocumentCard from "@/components/DocumentCard";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const FundDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOneEntityQuery({ id });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading fund details...</div>
      </div>
    );

  const fund = data?.data;

  return (
    <div
      className="min-h-screen bg-background select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Header />

      <main className="container mx-auto px-4 py-10 space-y-10">
        {/* Fund Header */}
        <div className="relative bg-card border border-border rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-10 overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <img
            src={`/uploads/${fund?.logo}`}
            alt={fund?.fullLegalName}
            className="w-28 h-28 md:w-32 md:h-32 object-contain rounded-2xl border bg-background p-4 shadow-sm"
            draggable={false}
          />

          <div className="flex-1 space-y-5 relative">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {fund?.fullLegalName}
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                {fund?.nameAr}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard label="Fund Code" value={fund?.code} />
              <InfoCard label="Share Price" value={`$${fund?.sharePrice}`} />
              <InfoCard
                label="Initial Shares"
                value={formatNumber(fund?.initialShares)}
              />
              <InfoCard
                label="Issued"
                value={fund?.shareIssued ? "Yes" : "No"}
              />
            </div>
          </div>
        </div>

        {/* Investment Info */}
        <div className="bg-card border border-border rounded-3xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Investment Limits
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Minimum Shares
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatNumber(fund?.minInvestShare)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Maximum Shares
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatNumber(fund?.maxInvestShare)}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Documents</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {!fund?.fundInfoFile &&
              !fund?.investingStepsFile &&
              !fund?.investingRequestFile &&
              !fund?.userAgreementFile && (
                <h3 className="text-lg">No documents added</h3>
              )}
            {fund?.fundInfoFile && (
              <DocumentCard
                title="Fund Information"
                file={`${base_url}/InvestmentFunds/${fund?.fundInfoFile}`}
              />
            )}

            {fund?.investingStepsFile && (
              <DocumentCard
                title="Investment Steps"
                file={`${base_url}/InvestmentFunds/${fund?.investingStepsFile}`}
              />
            )}

            {fund?.investingRequestFile && (
              <DocumentCard
                title="Investment Request Form"
                file={`${base_url}/InvestmentFunds/${fund?.investingRequestFile}`}
              />
            )}

            {fund?.userAgreementFile && (
              <DocumentCard
                title="User Agreement"
                file={`${base_url}/InvestmentFunds/${fund?.userAgreementFile}`}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-muted/40 p-4 hover:bg-muted/70 transition-colors duration-200">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="text-xl font-semibold mt-1 tracking-tight">{value}</p>
  </div>
);

export default FundDetails;
