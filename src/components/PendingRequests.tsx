import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { PendingRequestItem } from "@/interfaces/Stocks";
import { ChangeEvent, useRef } from "react";
import { useUploadReceiptMutation } from "@/store/api/stocksApi";
import { toast } from "@/hooks/use-toast";
import { isMobile } from "@/hooks/helpers";
import { compressImage } from "@/lib/utils";

interface PendingRequestsProps {
  isLoading: boolean;
  data?: PendingRequestItem[];
  refetch: () => void;
}

const PendingRequests = ({
  isLoading,
  data,
  refetch,
}: PendingRequestsProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadReceipt, { isLoading: isUploading, error }] =
    useUploadReceiptMutation();

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    request: PendingRequestItem,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (Images or PDF)
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPDF && !isImage) {
      toast({
        title: t("unsupported_file"),
        variant: "destructive",
        description: t("supported_files_pdf_img"),
        duration: 5000,
      });
      return;
    }

    try {
      const formData = new FormData();
      const compressed = await compressImage(file);
      formData.append("paymentConfirmationDocument", compressed);
      await uploadReceipt({ id: request._id, formData }).unwrap();
      toast({
        title: t("file_uploaded"),
        variant: "default",
      });
      refetch();
    } catch (err) {
      console.error("Upload failed", err);
      toast({
        title: t("error_while_uploading"),
        variant: "default",
        description: error?.data?.message || err.message,
        duration: 5000,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Clock className="w-4 h-4 jadwa-icon-gold shrink-0" />
          {t("transactions.pending_requests")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        ) : data?.data?.length ? (
          data?.data?.map((request: PendingRequestItem) => {
            const isBuy = request.tradeType === "buy";
            const shares = Number(request.numberOfShares || 0);
            const price = Number(request.pricePerShare || 0);
            const total = shares * price;

            const title =
              request.source?.fullLegalName ||
              request.source?.tradeName ||
              t("app.unknown_asset");

            return (
              <div
                key={request._id}
                className="
                  flex flex-col gap-3
                  rounded-lg bg-muted/30 px-3 py-2.5
                  sm:flex-row sm:items-center sm:justify-between
                "
              >
                {/* LEFT SIDE */}
                <div className="flex items-start gap-3">
                  {/* ICON */}
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isBuy
                        ? "bg-primary/10 jadwa-icon-gold"
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
                        className={`text-[10px] uppercase px-2 py-0.5 ${
                          isBuy
                            ? "border-primary text-primary"
                            : "border-destructive text-destructive"
                        }`}
                      >
                        {t(request?.tradeType)}
                      </Badge>

                      <Badge
                        variant={
                          request.requestStatus === "approved"
                            ? "warning"
                            : request.requestStatus === "pending"
                              ? "info"
                              : request.requestStatus === "rejected"
                                ? "destructive"
                                : "default"
                        }
                        className="text-[10px] capitalize"
                      >
                        {request.requestStatus === "approved"
                          ? t("transactions.pending_payment_doc")
                          : t(request.requestStatus)}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 capitalize"
                      >
                        {t(request?.sourceType?.toLowerCase())}
                      </Badge>
                    </div>

                    {/* Asset name */}
                    <p className="text-xs font-medium leading-tight">{title}</p>

                    {/* Shares x price */}
                    <p className="text-[11px] sm:text-xs text-jadwa-muted leading-tight">
                      {shares} {t("shares.share_s")} × ${price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Middle side */}
                <div
                  className={`flex items-start gap-3 ${isMobile ? "max-w-[100%]" : "max-w-[40%]"}`}
                >
                  {request?.requestStatus === "rejected" && (
                    <div className="border bg-destructive/80 rounded-sm p-2 text-white">
                      <b>{t("transactions.rejection_reason")}</b>
                      <p>{request?.rejectionReason}</p>
                    </div>
                  )}
                  {request?.requestStatus === "approved" && (
                    <>
                      {/* Hidden Input */}
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileChange(e, request)}
                        disabled={isUploading}
                        className="hidden"
                        id={`upload-${request?._id}`}
                      />

                      <label
                        htmlFor={`upload-${request._id}`}
                        onClick={() =>
                          isUploading ? null : fileInputRef.current?.click()
                        }
                        className={`border bg-warning/80 rounded-sm p-2 text-white transition-colors hover:bg-warning 
                          ${isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <b>{t("shares.click_upload_receipt")}</b>
                      </label>
                    </>
                  )}
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

                    <span className="text-[9px] text-jadwa-muted">
                      {format(new Date(request.createdAt), "MMM dd")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-jadwa-muted text-center py-4">
            {t("activity.no_records")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
