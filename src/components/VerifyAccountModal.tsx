import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CameraCapture } from "./CameraCapture";
import { base_url } from "@/api/GlobalData";
import InputField from "./InputField";
import UploadCard from "./UploadCard";
import { X } from "lucide-react";

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
  console.log("user", user);
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
    if (!user) return;

    setEmail(user?.email ?? "");
    setIdNumber(user?.idNumber ?? "");
    setPassportNumber(user?.passportNumber ?? "");
    setPassportExpDate(user?.passportExpDate ?? "");

    setIdPhotoPreview(
      user?.idPhoto ? `${base_url}/Applicants/${user.idPhoto}` : null
    );
    setIdPhotoBackPreview(
      user?.idPhotoBack ? `${base_url}/Applicants/${user.idPhotoBack}` : null
    );
    setLivePhotoPreview(
      user?.livePhoto ? `${base_url}/Applicants/${user.livePhoto}` : null
    );
    setPassportPreview(
      user?.passportImage
        ? `${base_url}/Applicants/${user.passportImage}`
        : null
    );
  }, [user]);

  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed inset-0 z-50
          bg-black/30 backdrop-blur-sm
          flex items-end md:items-center
          justify-center
          p-0 md:p-6
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="
            w-full h-full md:h-auto
            max-w-full md:max-w-2xl
            bg-white
            rounded-none md:rounded-xl
            shadow-none md:shadow-lg
            border-0 md:border border-gray-100
            flex flex-col
          "
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
        >
          {/* HEADER */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  {t("verification.verify")}
                </h2>
                <p className="text-[11px] md:text-xs text-gray-400 mt-1">
                  {t("verification.subtitle")}
                </p>
              </div>

              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="
    w-9 h-9
    rounded-full
    bg-gray-50
    hover:bg-gray-100
    text-gray-400
    hover:text-gray-700
    flex items-center justify-center
    transition-all duration-200
  "
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-6">
            {user?.rejectionReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-semibold">
                  {t("transactions.rejection_reason")}:
                </span>{" "}
                {user?.rejectionReason}
              </div>
            )}
            <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                {t("verification.identity_section")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                {t("verification.identity_documents")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                {t("verification.live_photo")}
              </h3>

              {!openCamera && (
                <button
                  onClick={() => setOpenCamera(true)}
                  className="
                    w-full md:w-auto
                    px-4 py-2
                    rounded-md
                    bg-gray-900
                    text-white
                    text-xs md:text-sm
                    font-medium
                    hover:opacity-90
                    transition
                  "
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
                <div className="rounded-lg border border-gray-100 p-2 bg-gray-50">
                  <img
                    src={livePhotoPreview}
                    alt="live preview"
                    className="rounded-md max-h-48 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row gap-2 md:justify-end">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="
                w-full md:w-auto
                px-4 py-2
                rounded-md
                border border-gray-200
                text-gray-600
                text-xs md:text-sm
                hover:bg-gray-50
                transition
              "
            >
              {t("app.cancel")}
            </button>

            <button
              onClick={onSubmit}
              disabled={disableSubmit}
              className="
                w-full md:w-auto
                px-5 py-2
                rounded-md
                bg-gray-900
                text-white
                text-xs md:text-sm
                font-medium
                disabled:opacity-40
                transition
              "
            >
              {isSubmitting ? t("app.loading") : t("verification.verify_now")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
