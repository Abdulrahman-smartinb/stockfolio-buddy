import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraCapture } from "./CameraCapture";
import { isMobile } from "@/hooks/helpers";
import { base_url } from "@/api/GlobalData";
import InputField from "./InputField";
import UploadCard from "./UploadCard";

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
  idPhotoBack,
  setIdPhotoBack,
  livePhoto,
  setLivePhoto,
  livePhotoPreview,
  setLivePhotoPreview,
  passportImage,
  setPassportImage,
  email,
  setEmail,
  user,
  idPhotoPreview,
  setIdPhotoPreview,
  idPhotoBackPreview,
  setIdPhotoBackPreview,
  setPassportPreview,
  passportPreview,
}) => {
  if (!isOpen) return null;
  const [openCamera, setOpenCamera] = useState(false);

  const disableSubmit =
    (!idPhoto && !idPhotoPreview) ||
    (!idPhotoBack && !idPhotoBackPreview) ||
    (!livePhoto && !livePhotoPreview) ||
    (!idNumber &&
      (!passportNumber ||
        !passportExpDate ||
        (!passportImage && !passportPreview)));

  useEffect(() => {
    if (user) {
      setEmail(user?.email ?? "");
      setIdNumber(user?.idNumber ?? "");
      setPassportNumber(user?.passportNumber ?? "");
      setPassportExpDate(user?.passportExpDate ?? "");

      setIdPhotoPreview(
        user?.idPhoto ? `${base_url}/Applicants/${user.idPhoto}` : null,
      );

      setIdPhotoBackPreview(
        user?.idPhotoBack ? `${base_url}/Applicants/${user.idPhotoBack}` : null,
      );

      setLivePhotoPreview(
        user?.livePhoto ? `${base_url}/Applicants/${user.livePhoto}` : null,
      );

      setPassportPreview(
        user?.passportImage
          ? `${base_url}/Applicants/${user.passportImage}`
          : null,
      );
    }
  }, [user]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {t("verification.verify")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("verification.subtitle")}
                </p>
              </div>

              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="p-8 max-h-[75vh] overflow-y-auto space-y-8">
            {/* Alert Section */}
            <div className="space-y-4">
              {user?.reviewStatus === "pending" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t("verification.pending_note")}
                </div>
              )}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="font-medium">*</span>{" "}
                {t("verification.indicates_required_fields")}
              </div>

              {user?.rejectionReason && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="font-semibold">
                    {t("transactions.rejection_reason")}:
                  </span>{" "}
                  {user?.rejectionReason}
                </div>
              )}
            </div>

            {/* IDENTITY CARD */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("verification.identity_section")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("profile.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />

                <InputField
                  label={t("verification.id_number")}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  type="number"
                  required={!passportNumber}
                />

                <InputField
                  label={t("verification.passport_number")}
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  type="text"
                  required={!idNumber}
                />

                {passportNumber && (
                  <InputField
                    label={t("verification.passport_exp_date")}
                    value={passportExpDate}
                    onChange={(e) => setPassportExpDate(e.target.value)}
                    type="date"
                    required
                  />
                )}
              </div>

              {/* Passport Upload */}
              {passportNumber && (
                <UploadCard
                  label={t("verification.passport_photo")}
                  preview={passportPreview}
                  onFile={(file) => {
                    setPassportImage(file);
                    setPassportPreview(URL.createObjectURL(file));
                  }}
                />
              )}
            </div>

            {/* DOCUMENTS */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("verification.identity_documents")}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <UploadCard
                  label={t("verification.id_photo")}
                  preview={idPhotoPreview}
                  onFile={(file) => {
                    setIdPhoto(file);
                    setIdPhotoPreview(URL.createObjectURL(file));
                  }}
                />

                <UploadCard
                  label={t("verification.id_photo_back")}
                  preview={idPhotoBackPreview}
                  onFile={(file) => {
                    setIdPhotoBack(file);
                    setIdPhotoBackPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            {/* LIVE PHOTO */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("verification.live_photo")}
              </h3>

              {!isMobile && !openCamera && !livePhoto && (
                <button
                  onClick={() => setOpenCamera(true)}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-sm hover:opacity-90 transition"
                >
                  {t("verification.open_camera")}
                </button>
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

              {livePhotoPreview && (
                <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                  <img
                    src={livePhotoPreview}
                    alt="live preview"
                    className="rounded-xl max-h-64"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              {t("app.cancel")}
            </button>

            <button
              onClick={onSubmit}
              disabled={disableSubmit}
              className="px-6 py-2.5 rounded-xl bg-black text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? t("app.loading") : t("verification.verify_now")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
