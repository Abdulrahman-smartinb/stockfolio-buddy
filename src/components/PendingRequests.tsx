import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { PendingRequestItem } from "@/store/api/stocksApi";
import { useTranslation } from "react-i18next";

interface PendingRequestsProps {
  isLoading: boolean;
  data?: PendingRequestItem[];
}

const PendingRequests = ({ isLoading, data }: PendingRequestsProps) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          {t("pending_requests")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        ) : data?.length ? (
          data.map((request) => {
            const isBuy = request.type === "buy";
            const total = request.shares * request.sharePrice;

            return (
              <div
                key={request._id}
                className="
                  flex flex-col gap-3
                  rounded-lg bg-muted/30
                  px-3 py-2.5
                  sm:flex-row sm:items-center sm:justify-between
                "
              >
                {/* LEFT SIDE */}
                <div className="flex items-start gap-3">
                  {/* ICON */}
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isBuy
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isBuy ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 ${
                          isBuy
                            ? "border-primary text-primary"
                            : "border-destructive text-destructive"
                        }`}
                      >
                        {request.type.toUpperCase()}
                      </Badge>

                      <Badge
                        variant="secondary"
                        className="text-[10px] capitalize"
                      >
                        {t(request.status)}
                      </Badge>
                    </div>

                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                      {request.shares} {t("shares")} × $
                      {request.sharePrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1 font-semibold text-sm">
                    <DollarSign className="w-4 h-4" />
                    {total.toFixed(2)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[9px] px-2 py-0.5 ${
                        request.paymentStatus === "paid"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {t(request.paymentStatus)}
                    </Badge>

                    <span className="text-[9px] text-muted-foreground">
                      {format(new Date(request.createdAt), "MMM dd")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            {t("no_records_found")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
