import { useGetCompanyInfoQuery } from "@/store/api/companyInfoApi";
import { useState } from "react";
import { DetailItem } from "./PaymentMethodsModal";

const PaymentModal = ({ isOpen, onClose, t, onConfirm }) => {
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const { data } = useGetCompanyInfoQuery(null);

  if (!isOpen) return null;

  const selectedMethod = data?.paymentMethods?.find(
    (m) => m._id === selectedMethodId,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {t("payments.payment_method")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("payments.select_view_details")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
          {/* Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {data?.paymentMethods
              ?.filter((m) => m.isActive == true)
              ?.map((m) => {
                const isSelected = selectedMethodId === m?._id;

                return (
                  <button
                    key={m?._id}
                    onClick={() =>
                      setSelectedMethodId(isSelected ? null : m?._id)
                    }
                    className={`p-4 rounded-2xl border-2 text-left transition
                    ${
                      isSelected
                        ? "border-[#042623] bg-[#042623]/5"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <p className="font-semibold">{getMethodTitle(m)}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {m?.method}
                    </p>
                  </button>
                );
              })}
          </div>

          {/* Details */}
          {selectedMethod && (
            <div className="bg-gray-50 p-6 rounded-2xl border">
              {renderDetails(selectedMethod, t)}
            </div>
          )}
        </div>

        {/* Footer */}
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
              onClose();
            }}
            className={`px-6 py-2 rounded-xl text-white
              ${
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

const getMethodTitle = (m) => {
  switch (m?.method) {
    case "bank":
      return m?.bank?.bankName;
    case "shamCash":
      return m?.shamCash?.beneficiaryName;
    case "usdt":
      return m?.usdt?.transferNetwork;
    case "cash":
      return m?.cash?.locationName;
    default:
      return "Unknown";
  }
};

const renderDetails = (m, t) => {
  switch (m?.method) {
    case "bank":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={m?.bank?.beneficiaryFullName}
          />
          <DetailItem
            label={t("payments.bank.bank_name")}
            value={m?.bank?.bankName}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={m?.bank?.accountNumber}
          />
        </>
      );
    case "shamCash":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={m?.shamCash?.beneficiaryName}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={m?.shamCash?.accountNumber}
          />
        </>
      );
    case "usdt":
      return (
        <>
          <DetailItem
            label={t("payments.usdt.network")}
            value={m?.usdt?.transferNetwork}
          />
          <DetailItem
            label={t("payments.usdt.wallet_address")}
            value={m?.usdt?.walletAddress}
          />
        </>
      );
    case "cash":
      return (
        <>
          <DetailItem
            label={t("payments.cash.branch")}
            value={m?.cash?.locationName}
          />
          <DetailItem
            label={t("payments.cash.address")}
            value={`${m?.cash?.locationAddress}, ${m?.cash?.city}`}
          />
          <DetailItem
            label={t("payments.cash.currency")}
            value={m?.cash?.currency}
          />
        </>
      );
    default:
      return null;
  }
};

export default PaymentModal;
