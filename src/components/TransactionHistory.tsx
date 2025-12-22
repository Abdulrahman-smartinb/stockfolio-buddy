import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Package } from "lucide-react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useTranslation } from "react-i18next";

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
  page?: number;
  setPage?: any;
  limit?: number;
  setLimit?: any;
  totalPages?: number;
}

const TransactionHistory = ({
  isLoading,
  data,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}: TransactionHistoryProps) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          {t("transactions_history")}
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
                      {isBuy ? t("buy") : t("sell")}
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
                    {tx.shares} {t("shares")} × ${tx.sharePrice}
                  </span>
                  <span>{format(new Date(tx.createdAt), "MMM dd, HH:mm")}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            {t("no_records_found")}
          </p>
        )}
        <div className="md:flex md:justify-between">
          <Pagination className="w-50 mx-0 sm:w-100">
            <PaginationContent>
              {/* PREVIOUS */}
              <PaginationItem>
                <PaginationPrevious
                  title="asd"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* NEXT */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground sm:w-100">
            <span>{t("rows_per_page")}</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="appearance-none rounded-lg border border-border/60
            bg-background/60 px-3 py-1.5 pr-8 text-sm font-medium text-foreground
            backdrop-blur-md shadow-sm transition hover:border-primary/50
            focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
