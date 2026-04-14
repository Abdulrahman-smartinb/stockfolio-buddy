import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { base_url } from "@/api/GlobalData";
import { useLocation, useNavigate } from "react-router-dom";

const CompaniesList = ({ companies = [], isLoading, t, lang }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-border/60 bg-background/60 p-5 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/50" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 rounded bg-muted/50" />
                <div className="h-3 w-1/3 rounded bg-muted/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {t("common.no_records")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {companies.map((company, index) => {
        const displayName =
          lang === "ar"
            ? company.tradeName || company.fullLegalName
            : company.fullLegalName || company.tradeName;

        return (
          <motion.div
            key={company._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.2) }}
            onClick={() =>
              navigate(`/company-details/${company._id}`, {
                state: {
                  from: location.pathname,
                  restoreScrollY: window.scrollY,
                },
              })
            }
            className="cursor-pointer rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-muted/30 ring-1 ring-border/60 overflow-hidden flex items-center justify-center shrink-0">
                {company.logo ? (
                  <img
                    src={`${base_url}/ClientCompany/${company.logo}`}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-base font-semibold text-foreground truncate">
                  {displayName || "-"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground truncate">
                  {company.economicSector || company.investmentType || "-"}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CompaniesList;
