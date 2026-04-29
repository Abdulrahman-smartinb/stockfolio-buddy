import { base_url } from "@/api/GlobalData";
import { Copy, Expand, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const getMethodTitle = (method, t, isRtl) =>
  isRtl
    ? method?.nameAr
    : method?.name ||
      t(`payments.method_names.${method?.method}`) ||
      method?.method;

const getQrImage = (method) =>
  method?.bank?.qrCode ||
  method?.shamCash?.qrCode ||
  method?.usdt?.walletQr ||
  null;

const buildDetails = (method, t) => {
  switch (method?.method) {
    case "bank":
      return [
        {
          label: t("payments.bank.beneficiary_name"),
          value: method?.bank?.beneficiaryFullName,
        },
        { label: t("payments.bank.bank_name"), value: method?.bank?.bankName },
        {
          label: t("payments.bank.account_number"),
          value: method?.bank?.accountNumber,
          copyable: true,
        },
        {
          label: t("payments.bank.iban"),
          value: method?.bank?.iban,
          copyable: true,
        },
        {
          label: t("payments.bank.swift_code"),
          value: method?.bank?.swiftCode,
          copyable: true,
        },
        { label: t("payments.bank.branch"), value: method?.bank?.branch },
        { label: t("payments.cash.currency"), value: method?.bank?.currency },
      ].filter((item) => item.value);
    case "shamCash":
      return [
        {
          label: t("payments.bank.beneficiary_name"),
          value: method?.shamCash?.beneficiaryName,
        },
        {
          label: t("payments.bank.account_number"),
          value: method?.shamCash?.accountNumber,
          copyable: true,
        },
        {
          label: t("payments.bank.beneficiary_address"),
          value: method?.shamCash?.beneficiaryAddress,
        },
      ].filter((item) => item.value);
    case "usdt":
      return [
        {
          label: t("payments.usdt.network"),
          value: method?.usdt?.transferNetwork,
        },
        {
          label: t("payments.usdt.wallet_address"),
          value: method?.usdt?.walletAddress,
          copyable: true,
          ltr: true,
        },
      ].filter((item) => item.value);
    case "cash":
      return [
        { label: t("payments.cash.branch"), value: method?.cash?.locationName },
        {
          label: t("payments.cash.address"),
          value: [
            method?.cash?.country,
            method?.cash?.city,
            method?.cash?.locationAddress,
          ]
            .filter(Boolean)
            .join(", "),
          copyable: true,
        },
      ].filter((item) => item.value);
    case "onlinePayment":
      return [
        {
          label: t("payments.payment_method"),
          value:
            method?.onlinePayment?.gatewayName || t("payments.online_payment"),
        },
        {
          label: t("payments.accept_currency"),
          value: method?.onlinePayment?.acceptCurrency,
        },
      ].filter((item) => item.value);
    default:
      return [];
  }
};

export const DetailItem = ({
  label,
  value,
  copyable = false,
  ltr = false,
  t,
}) => {
  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(String(value));
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p
            dir={ltr ? "ltr" : "auto"}
            className="text-sm font-medium text-foreground break-all"
          >
            {value}
          </p>
        </div>

        {copyable ? (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/50 shrink-0"
            aria-label={t("payments.copy")}
          >
            <Copy className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

const PaymentMethodsModal = ({ isOpen, onClose, data, t }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const paymentMethods = useMemo(
    () => data?.filter((m) => m?.isActive == true) || [],
    [data],
  );
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!isOpen) return null;

  const selectedMethod =
    paymentMethods.find((m) => m._id === selectedMethodId) || paymentMethods[0];

  const selectedQrImage = getQrImage(selectedMethod);
  const selectedDetails = buildDetails(selectedMethod, t);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border/70 bg-background shadow-2xl flex max-h-[90vh] flex-col">
          <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {t("payments.payment_method")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("payments.select_view_details")}
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-muted/50 inline-flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod?._id === method._id;
                const qrImage = getQrImage(method);
                const details = buildDetails(method, t);

                return (
                  <div key={method._id} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMethodId(method._id)}
                      className={`w-full rounded-2xl border p-4 text-start transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="text-sm font-semibold text-foreground">
                        {getMethodTitle(method, t, isRtl)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t(`payments.method_names.${method.method}`)}
                      </div>
                    </button>

                    {isSelected ? (
                      <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 md:hidden">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          {t("payments.payment_details")}
                        </h3>

                        {method?.method === "onlinePayment" ? (
                          <div className="text-sm text-muted-foreground">
                            {t("payments.no_details_available")}
                          </div>
                        ) : details.length ? (
                          <div className="space-y-3">
                            {details.map((detail) => (
                              <DetailItem
                                key={`${detail.label}-${detail.value}`}
                                {...detail}
                                t={t}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {t("payments.select_payment_above")}
                          </div>
                        )}

                        {qrImage ? (
                          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-background/70 p-4">
                            <button
                              type="button"
                              onClick={() =>
                                setFullscreenImage(
                                  `${base_url}/companyinfo/payment-methods/${qrImage}`,
                                )
                              }
                              className="relative overflow-hidden rounded-2xl border border-border bg-background"
                            >
                              <img
                                src={`${base_url}/companyinfo/payment-methods/${qrImage}`}
                                alt="Payment QR"
                                className="h-56 w-56 object-contain"
                              />
                              <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90">
                                <Expand className="w-4 h-4" />
                              </span>
                            </button>
                            <p className="mt-3 text-xs text-muted-foreground">
                              {t("payments.tap_to_expand")}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {selectedMethod ? (
              <div className="hidden gap-5 md:grid md:grid-cols-1 xl:grid-cols-[1.35fr_.8fr]">
                <div className="rounded-3xl border border-border/70 bg-card p-5">
                  <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
                    {t("payments.payment_details")}
                  </h3>
                  {selectedMethod?.method === "onlinePayment" ? (
                    <div className="text-sm text-muted-foreground">
                      {t("payments.no_details_available")}
                    </div>
                  ) : selectedDetails.length ? (
                    <div className="space-y-3">
                      {selectedDetails.map((detail) => (
                        <DetailItem
                          key={`${detail.label}-${detail.value}`}
                          {...detail}
                          t={t}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {t("payments.select_payment_above")}
                    </div>
                  )}
                </div>

                {selectedQrImage ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-card p-5">
                    <button
                      type="button"
                      onClick={() =>
                        setFullscreenImage(
                          `${base_url}/companyinfo/payment-methods/${selectedQrImage}`,
                        )
                      }
                      className="relative overflow-hidden rounded-2xl border border-border bg-background"
                    >
                      <img
                        src={`${base_url}/companyinfo/payment-methods/${selectedQrImage}`}
                        alt="Payment QR"
                        className="h-56 w-56 object-contain"
                      />
                      <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90">
                        <Expand className="w-4 h-4" />
                      </span>
                    </button>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {t("payments.tap_to_expand")}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="hidden rounded-3xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground md:block">
                {t("payments.select_payment_above")}
              </div>
            )}
          </div>
        </div>
      </div>

      {fullscreenImage ? (
        <div
          className="fixed inset-0 z-[60] bg-black/90 p-4 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white inline-flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={fullscreenImage}
            alt="Payment method"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}
    </>
  );
};

export default PaymentMethodsModal;
