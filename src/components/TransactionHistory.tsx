import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

interface TransactionHistoryProps {
  isLoading: boolean;
  data?: {
    type: string;
    shares: number;
    purchaseValue: number;
  }[];
}

const TransactionHistory = ({ isLoading, data }: TransactionHistoryProps) => {
  console.log(data);
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
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        ) : data?.length ? (
          data.map((purchase, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                {purchase.type === "buy" ? (
                  <TrendingUp className="w-4 h-4 text-primary" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}

                <Badge variant="outline" className="text-xs">
                  {purchase.shares} shares
                </Badge>
              </div>

              <div className="text-xs sm:text-sm">
                ${purchase.purchaseValue.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center">
            No purchase history yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
