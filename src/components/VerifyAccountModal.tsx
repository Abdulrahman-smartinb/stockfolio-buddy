import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CameraCapture } from "./CameraCapture";
import { Field } from "./ui/Field";
import { isMobile } from "@/hooks/helpers";

export const VerifyAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  t,

  idNumber,
  setIdNumber,
  passportNumber,
  setPassportNumber,
  passportExpDate,
  setPassportExpDate,
  idPhoto,
  setIdPhoto,
  livePhoto,
  setLivePhoto,
  livePhotoPreview,
  setLivePhotoPreview,
  email,
  setEmail,
}) => {
  if (!isOpen) return null;

  const [openCamera, setOpenCamera] = useState(false);

  const disableSubmit =
    !idPhoto ||
    !livePhoto ||
    (!idNumber && (!passportNumber || !passportExpDate));

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
                <ShieldCheck className="w-5 h-5 jadwa-icon-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-jadwa">
                  {t("verification.verify")}
                </h3>
                <p className="text-xs text-jadwa-muted">
                  {t("verification.subtitle")}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="jadwa-icon-gold"
            >
              ✕
            </Button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4">
              <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 jadwa-icon-gold" />
                <span className="text-jadwa-muted">
                  <span className="text-destructive font-semibold">*</span>{" "}
                  {t("verification.indicates_required_fields")}
                </span>
              </div>

              {/* Identity Section */}
              <div className="rounded-xl border p-4 space-y-4">
                <div className="text-sm font-semibold text-jadwa">
                  {t("verification.identity_section")}
                </div>

                <Field label={t("profile.email")} required>
                  <Input
                    type="email"
                    className="h-10 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field
                  label={t("verification.id_number")}
                  required={!passportNumber}
                >
                  <Input
                    type="number"
                    className="h-10 text-sm"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </Field>

                <Field
                  label={t("verification.passport_number")}
                  required={!idNumber}
                >
                  <Input
                    type="text"
                    className="h-10 text-sm"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                  />
                </Field>

                {passportNumber && (
                  <Field label={t("verification.passport_exp_date")} required>
                    <Input
                      type="date"
                      className="h-10 text-sm"
                      value={passportExpDate}
                      onChange={(e) => setPassportExpDate(e.target.value)}
                    />
                  </Field>
                )}

                <Field label={t("verification.id_photo")} required>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="h-10 text-sm"
                    onChange={(e) => setIdPhoto(e.target.files?.[0] ?? null)}
                  />
                </Field>

                <Field label={t("verification.live_photo")} required>
                  <div className="space-y-2">
                    {isMobile && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setLivePhoto(e.target.files?.[0] ?? null)
                        }
                      />
                    )}

                    {!isMobile && !openCamera && !livePhoto && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setOpenCamera(true)}
                      >
                        <Camera className="w-4 h-4 jadwa-icon-brown" />
                        {t("verification.open_camera")}
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
                            {t("verification.photo_preview")}
                          </p>
                          {!isMobile && (
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline"
                              onClick={() => setOpenCamera(true)}
                            >
                              {t("verification.retake")}
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
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("app.cancel")}
            </Button>

            <Button onClick={onSubmit} disabled={disableSubmit}>
              {isSubmitting ? t("app.loading") : t("verification.verify_now")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
