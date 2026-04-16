import { useGetCompanyInfoQuery } from "@/store/api/companyInfoApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DetailItem, getMethodTitle } from "./PaymentMethodsModal";

const PaymentModal = ({ isOpen, onClose, t, onConfirm }) => {
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const { data } = useGetCompanyInfoQuery(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  if (!isOpen) return null;

  const paymentMethods = data?.paymentMethods?.filter(
    (m) => m?.isActive == true,
  );

  const selectedMethod = paymentMethods?.find(
    (m) => m._id === selectedMethodId,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{t("payments.payment_method")}</h2>
            <p className="text-sm text-gray-500">
              {t("payments.select_view_details")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ×
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {paymentMethods?.map((method) => {
              const isSelected = selectedMethodId === method?._id;

              return (
                <div key={method?._id} className="space-y-3">
                  <button
                    onClick={() =>
                      setSelectedMethodId(isSelected ? null : method?._id)
                    }
                    className={`w-full rounded-2xl border-2 p-4 text-start transition ${
                      isSelected
                        ? "border-[#042623] bg-[#042623]/5"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <p className="font-semibold">{getMethodTitle(method, t)}</p>
                    <p className="text-xs text-gray-500">
                      {t(`payments.method_names.${method?.method}`)}
                    </p>
                  </button>

                  {isSelected ? (
                    <div className="rounded-2xl border bg-gray-50 p-6 space-y-3 sm:hidden">
                      {renderDetails(method, t)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {selectedMethod ? (
            <div className="mt-6 hidden rounded-2xl border bg-gray-50 p-6 space-y-3 sm:block">
              {renderDetails(selectedMethod, t)}
            </div>
          ) : null}
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            className="px-5 py-2 rounded-xl bg-gray-200"
            onClick={onClose}
          >
            {t("app.cancel")}
          </button>

          <button
            disabled={!selectedMethodId}
            onClick={() => {
              onConfirm(selectedMethod);
            }}
            className={`px-6 py-2 rounded-xl text-white ${
              selectedMethodId
                ? "bg-[#042623] hover:bg-[#021412]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {t("app.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

const renderDetails = (method, t) => {
  switch (method?.method) {
    case "bank":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={method?.bank?.beneficiaryFullName}
            t={t}
          />
          <DetailItem
            label={t("payments.bank.bank_name")}
            value={method?.bank?.bankName}
            t={t}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={method?.bank?.accountNumber}
            copyable
            t={t}
          />
        </>
      );
    case "shamCash":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={method?.shamCash?.beneficiaryName}
            t={t}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={method?.shamCash?.accountNumber}
            copyable
            t={t}
          />
        </>
      );
    case "usdt":
      return (
        <>
          <DetailItem
            label={t("payments.usdt.network")}
            value={method?.usdt?.transferNetwork}
            t={t}
          />
          <DetailItem
            label={t("payments.usdt.wallet_address")}
            value={method?.usdt?.walletAddress}
            copyable
            ltr
            t={t}
          />
        </>
      );
    case "cash":
      return (
        <>
          <DetailItem
            label={t("payments.cash.branch")}
            value={method?.cash?.locationName}
            t={t}
          />
          <DetailItem
            label={t("payments.cash.address")}
            value={`${method?.cash?.locationAddress}, ${method?.cash?.city}`}
            copyable
            t={t}
          />
          <DetailItem
            label={t("payments.cash.currency")}
            value={method?.cash?.currency}
            t={t}
          />
        </>
      );
    case "onlinePayment":
      return (
        <DetailItem
          label={t("payments.payment_method")}
          value={t("common.redirect_warn")}
          t={t}
        />
      );
    default:
      return null;
  }
};

export default PaymentModal;
