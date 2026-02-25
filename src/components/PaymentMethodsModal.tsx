import { base_url } from "@/api/GlobalData";
import { useState } from "react";

const PaymentMethodsModal = ({ isOpen, onClose, data, t }) => {
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  if (!isOpen) return null;

  const selectedMethod = data.find((m) => m._id === selectedMethodId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {t("payments.payment_method")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("payments.select_view_details")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* Method Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {data.map((m) => {
              const isSelected = selectedMethodId === m._id;
              const info = getMethodInfo(m);

              return (
                <button
                  key={m?._id}
                  onClick={() =>
                    setSelectedMethodId(isSelected ? null : m?._id)
                  }
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                    ${
                      isSelected
                        ? "border-[#988662] bg-[#988662]/5 ring-1 ring-[#988662]/20"
                        : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div
                    className={`p-3 rounded-xl ${isSelected ? "bg-[#988662] text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {/* Placeholder for Icons */}
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">
                      {m?.method[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate ${isSelected ? "jadwa-icon-gold" : "text-gray-700"}`}
                    >
                      {info.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {m?.method}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="jadwa-icon-gold">
                      <span className="text-xl">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Details Section */}
          <div className="min-h-[200px]">
            {selectedMethod ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                    {t("payments.payment_details")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderDetails(selectedMethod, t)}
                    </div>

                    {/* QR Code Area */}
                    {getQR(selectedMethod) && (
                      <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <img
                          src={`${base_url}/companyinfo/payment-methods/${getQR(selectedMethod)}`}
                          alt="Payment QR"
                          className="w-32 h-32 object-cover"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 uppercase">
                          {t("payments.scan_to_pay")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400">
                  {t("payments.select_payment_above")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            className="px-6 py-2.5 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
            onClick={onClose}
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Functions for Cleaner JSX ---

const getMethodInfo = (m) => {
  switch (m.method) {
    case "bank":
      return { title: m.bank.bankName };
    case "shamCash":
      return { title: m.shamCash.beneficiaryName };
    case "usdt":
      return { title: m.usdt.transferNetwork };
    case "cash":
      return { title: m.cash.locationName };
    default:
      return { title: "Unknown" };
  }
};

const getQR = (m) =>
  m.bank?.qrCode || m.shamCash?.qrCode || m.usdt?.walletQr || null;

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800 break-all">{value}</p>
  </div>
);

const renderDetails = (m, t) => {
  switch (m.method) {
    case "bank":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={m.bank.beneficiaryFullName}
          />
          <DetailItem
            label={t("payments.bank.bank_name")}
            value={m.bank.bankName}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={m.bank.accountNumber}
          />
        </>
      );
    case "shamCash":
      return (
        <>
          <DetailItem
            label={t("payments.bank.beneficiary_name")}
            value={m.shamCash.beneficiaryName}
          />
          <DetailItem
            label={t("payments.bank.account_number")}
            value={m.shamCash.accountNumber}
          />
        </>
      );
    case "usdt":
      return (
        <>
          <DetailItem
            label={t("payments.usdt.network")}
            value={m.usdt.transferNetwork}
          />
          <DetailItem
            label={t("payments.usdt.wallet_address")}
            value={m.usdt.walletAddress}
          />
        </>
      );
    case "cash":
      return (
        <>
          <DetailItem
            label={t("payments.cash.branch")}
            value={m.cash.locationName}
          />
          <DetailItem
            label={t("payments.cash.address")}
            value={`${m.cash.locationAddress}, ${m.cash.city}`}
          />
          <DetailItem
            label={t("payments.cash.currency")}
            value={m.cash.currency}
          />
        </>
      );
    default:
      return null;
  }
};

export default PaymentMethodsModal;
