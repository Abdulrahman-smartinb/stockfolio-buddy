import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface PendingRequestsProps {
  isLoading: boolean;
  data?: {
    shares: number;
    sharePrice: number;
  }[];
}

const PendingRequests = ({ isLoading, data }: PendingRequestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Pending Requests
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
              <Badge variant="outline" className="text-xs">
                {purchase.shares} shares
              </Badge>

              <span className="text-xs sm:text-sm">
                ${(purchase.shares * purchase.sharePrice).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center">
            No pending requests
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
