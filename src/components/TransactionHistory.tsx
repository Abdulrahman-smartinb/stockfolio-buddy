import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Package } from "lucide-react";
import { format } from "date-fns";

interface TransactionItem {
  type: string;
  shares: number;
  sharePrice: number;
  purchaseValue: number;
  createdAt: string;
}

interface TransactionHistoryProps {
  isLoading: boolean;
  data?: TransactionItem[];
}

const TransactionHistory = ({ isLoading, data }: TransactionHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Transactions History
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ) : data?.length ? (
          data.map((tx, i) => {
            const isBuy = tx.type === "buy";

            return (
              <div key={i} className="rounded-lg bg-muted/30 p-3 space-y-2">
                {/* TOP ROW */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isBuy ? (
                      <TrendingUp className="w-4 h-4 text-primary" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}

                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 ${
                        isBuy
                          ? "text-primary border-primary/40"
                          : "text-destructive border-destructive/40"
                      }`}
                    >
                      {isBuy ? "BUY" : "SELL"}
                    </Badge>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isBuy ? "text-primary" : "text-destructive"
                    }`}
                  >
                    ${tx.purchaseValue.toFixed(2)}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {tx.shares} shares × ${tx.sharePrice}
                  </span>
                  <span>{format(new Date(tx.createdAt), "MMM dd, HH:mm")}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No transactions yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
