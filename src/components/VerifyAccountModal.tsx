// src/components/modals/VerifyAccountModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "./ui/alert";
import { useProfile } from "@/hooks/useProfile";
import { CameraCapture } from "./CameraCapture";

const Field = ({ label, required, children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
      <div className="md:col-span-4">
        <p className="text-sm text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
      </div>
      <div className="md:col-span-8">{children}</div>
    </div>
  );
};

export const VerifyAccountModal = ({
  // modal
  isOpen,
  t,
  isMobile,
  onClose,
}) => {
  if (!isOpen) return null;
  const [openCamera, setOpenCamera] = useState(false);
  const {
    idPhoto,
    setIdPhoto,
    livePhoto,
    setLivePhoto,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    handleSubmit,
    isSubmitting,
    livePhotoPreview,
    setLivePhotoPreview,
    REVIEW_STATUS_STYLES,
    paymentMethod,
    setPaymentMethod,
    bankData,
    setBankData,
    shamCashData,
    setShamCashData,
    usdtData,
    setUsdtData,
  } = useProfile();

  const disableSubmit =
    !idNumber ||
    !passportNumber ||
    !idPhoto ||
    !livePhoto ||
    !paymentMethod ||
    (paymentMethod === "bank" &&
      (!bankData?.beneficiaryFullName ||
        !bankData?.beneficiaryAddress ||
        !bankData?.bankName ||
        !bankData?.accountNumber)) ||
    (paymentMethod === "shamcash" &&
      (!shamCashData?.accountNumber || !shamCashData?.beneficiaryName)) ||
    (paymentMethod === "usdt" &&
      (!usdtData?.transferNetwork || !usdtData?.walletAddress));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-3xl bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("verify")}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("verify_subtitle") ||
                    "Complete verification to enable trading."}
                </p>
              </div>
            </div>

            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              ✕
            </Button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4">
              <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">
                  <span className="text-destructive font-semibold">*</span>{" "}
                  {t("indicates_required_fields") ||
                    "indicates required fields"}
                </span>
              </div>

              {/* Identity Section */}
              <div className="rounded-xl border p-4 space-y-4">
                <div className="text-sm font-semibold">
                  {t("identity_section") || "Identity Information"}
                </div>

                <Field label={t("id_number")} required>
                  <Input
                    type="number"
                    className="h-10 text-sm"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </Field>

                <Field label={t("passport_number")} required>
                  <Input
                    type="number"
                    className="h-10 text-sm"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                  />
                </Field>

                <Field label={t("id_photo")} required>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="h-10 text-sm"
                    onChange={(e) => setIdPhoto(e.target.files?.[0] ?? null)}
                  />
                </Field>

                <Field label={t("live_photo")} required>
                  <div className="space-y-2">
                    {isMobile && (
                      <Input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) =>
                          setLivePhoto(e.target.files?.[0] ?? null)
                        }
                      />
                    )}

                    {!isMobile && !openCamera && !livePhoto && (
                      <Button
                        type="button"
                        variant="accent"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setOpenCamera(true)}
                      >
                        <Camera className="w-4 h-4" />
                        {t("open_camera") || "Open Camera"}
                      </Button>
                    )}

                    {openCamera && (
                      <CameraCapture
                        onCapture={(file) => {
                          setLivePhoto(file);
                          setLivePhotoPreview(URL.createObjectURL(file));
                        }}
                        onClose={() => setOpenCamera(false)}
                      />
                    )}

                    {livePhoto && !openCamera && (
                      <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm">
                            {t("photo_preview") || "Photo preview"}
                          </p>
                          {!isMobile && (
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline"
                              onClick={() => setOpenCamera(true)}
                            >
                              {t("retake") || "Retake"}
                            </button>
                          )}
                        </div>
                        <img
                          alt="live preview"
                          className="rounded-lg max-h-52 w-auto"
                          src={livePhotoPreview}
                        />
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* Payment Section */}
              <div className="rounded-xl border p-4 space-y-4">
                <div className="text-sm font-semibold">
                  {t("payment_section") || "Payment Method"}
                </div>

                <Field label={t("payment_method")} required>
                  <select
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">{t("pls_select")}</option>
                    <option value="bank">{t("bank_transfer")}</option>
                    <option value="shamcash">{t("sham_cash")}</option>
                    <option value="usdt">{t("usdt")}</option>
                  </select>
                </Field>

                {/* BANK */}
                {paymentMethod === "bank" && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="text-sm font-medium">
                      {t("bank_details") || "Bank Details"}
                    </div>

                    <Field label={t("beneficiary_full_name")} required>
                      <Input
                        className="h-10 text-sm"
                        value={bankData?.beneficiaryFullName ?? ""}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            beneficiaryFullName: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("beneficiary_address")} required>
                      <Input
                        className="h-10 text-sm"
                        value={bankData?.beneficiaryAddress ?? ""}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            beneficiaryAddress: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("bank_name")} required>
                      <Input
                        className="h-10 text-sm"
                        value={bankData?.bankName ?? ""}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            bankName: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("account_number")} required>
                      <Input
                        className="h-10 text-sm"
                        value={bankData?.accountNumber ?? ""}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            accountNumber: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* SHAMCASH */}
                {paymentMethod === "shamcash" && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="text-sm font-medium">
                      {t("shamcash_details") || "ShamCash Details"}
                    </div>

                    <Field label={t("account_number")} required>
                      <Input
                        className="h-10 text-sm"
                        value={shamCashData?.accountNumber ?? ""}
                        onChange={(e) =>
                          setShamCashData({
                            ...shamCashData,
                            accountNumber: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("qr_code_optional")} required={false}>
                      <Input
                        type="file"
                        className="h-10 text-sm"
                        onChange={(e) =>
                          setShamCashData({
                            ...shamCashData,
                            qrCode: e.target.files?.[0] ?? null,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("beneficiary_full_name")} required>
                      <Input
                        className="h-10 text-sm"
                        value={shamCashData?.beneficiaryName ?? ""}
                        onChange={(e) =>
                          setShamCashData({
                            ...shamCashData,
                            beneficiaryName: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("beneficiary_address")} required={false}>
                      <Input
                        className="h-10 text-sm"
                        value={shamCashData?.beneficiaryAddress ?? ""}
                        onChange={(e) =>
                          setShamCashData({
                            ...shamCashData,
                            beneficiaryAddress: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* USDT */}
                {paymentMethod === "usdt" && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="text-sm font-medium">
                      {t("usdt_details") || "USDT Details"}
                    </div>

                    <Field label={t("transfer_network")} required>
                      <select
                        value={
                          usdtData?.transferNetwork
                            ? usdtData.transferNetwork
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setUsdtData((prev) => ({
                            ...prev,
                            transferNetwork: value === "other" ? "" : value,
                            otherNetwork: value === "other" ? "" : undefined,
                          }));
                        }}
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                      >
                        <option value="">{t("pls_select")}</option>
                        <option value="TRC20">TRC20</option>
                        <option value="ERC20">ERC20</option>
                        <option value="BEP20">BEP20</option>
                        <option value="other">{t("other")}</option>
                      </select>
                    </Field>

                    {usdtData?.otherNetwork !== undefined && (
                      <Field label={t("transfer_network")} required>
                        <Input
                          className="h-10 text-sm"
                          value={usdtData.otherNetwork}
                          onChange={(e) =>
                            setUsdtData((prev) => ({
                              ...prev,
                              otherNetwork: e.target.value,
                              transferNetwork: e.target.value,
                            }))
                          }
                        />
                      </Field>
                    )}

                    <Field label={t("wallet_address")} required>
                      <Input
                        className="h-10 text-sm"
                        value={usdtData?.walletAddress ?? ""}
                        onChange={(e) =>
                          setUsdtData({
                            ...usdtData,
                            walletAddress: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("wallet_qr")} required={false}>
                      <Input
                        type="file"
                        className="h-10 text-sm"
                        onChange={(e) =>
                          setUsdtData({
                            ...usdtData,
                            walletQr: e.target.files?.[0] ?? null,
                          })
                        }
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("cancel") || "Cancel"}
            </Button>

            <Button onClick={handleSubmit} disabled={disableSubmit}>
              {isSubmitting
                ? t("loading") || "Loading..."
                : t("verify_now") || "Verify Now"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
