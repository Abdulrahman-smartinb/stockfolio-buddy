import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "./PhoneInput";
import COUNTRIES from "@/data/countries.json";
import { isMobile } from "@/hooks/helpers";
import { base_url } from "@/api/GlobalData";
import { useMemo } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: any;
  setEditData: any;
  onSave: () => void;
  handleProfileImageChange: (file: File) => void;
  isSaving: boolean;
  avatarPreview?: string;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  editData,
  setEditData,
  onSave,
  isSaving,
  handleProfileImageChange,
  avatarPreview,
}: Props) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const previewSrc = useMemo(() => {
    const value = editData?.profilePreview;

    // 1️⃣ No image → fallback avatar
    if (!value) return avatarPreview;

    // 2️⃣ If it's a blob (new uploaded file)
    if (value.startsWith("blob:")) {
      return value;
    }

    // 3️⃣ If backend already returns full URL
    if (value.startsWith("http")) {
      return value;
    }

    // 4️⃣ Otherwise assume it's a filename from server
    return `${base_url}/Investor/${value}`;
  }, [editData?.profilePreview, avatarPreview]);

  const handleClose = () => {
    const value = editData?.profilePreview;

    // If current preview is a blob → revoke it
    if (value?.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }

    // Reset preview back to original image (from server)
    setEditData((prev: any) => ({
      ...prev,
      profilePreview: prev.originalProfileImage || null,
    }));

    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            dir={isRtl ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className={cn(
              "w-full max-w-xl",
              "rounded-3xl bg-background shadow-2xl",
              "border border-border/60",
              "flex flex-col",
              "max-h-[90vh]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <h2 className="text-xl font-extrabold">
                {t("profile.edit_profile")}
              </h2>

              <button
                onClick={onClose}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-6 overflow-y-auto space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden ring-1 ring-border bg-muted/30">
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-primary">
                        {editData.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  <label className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) return;

                        const file = e.target.files[0];
                        const previewUrl = URL.createObjectURL(file);

                        handleProfileImageChange(file);

                        setEditData((prev: any) => ({
                          ...prev,
                          profilePreview: previewUrl,
                        }));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <FormField
                  label={t("profile.full_name")}
                  value={editData.fullName}
                  onChange={(v: string) =>
                    setEditData((p: any) => ({ ...p, fullName: v }))
                  }
                />

                <FormField
                  label={t("profile.email")}
                  value={editData.email}
                  onChange={(v: string) =>
                    setEditData((p: any) => ({ ...p, email: v }))
                  }
                  customStyle={"font-google"}
                />

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t("profile.phone")}
                  </label>

                  <PhoneInput
                    countries={COUNTRIES}
                    country={editData.countryCode}
                    phone={editData.phone}
                    isRtl={isRtl}
                    isMobile={isMobile}
                    onCountryChange={(c) =>
                      setEditData((p: any) => ({
                        ...p,
                        countryCode: c.code,
                      }))
                    }
                    onPhoneChange={(phone) =>
                      setEditData((p: any) => ({ ...p, phone }))
                    }
                  />
                </div>
              </div>

              <FormField
                label={t("profile.birth_date")}
                type="date"
                value={editData.birthDate}
                onChange={(v: string) =>
                  setEditData((p: any) => ({ ...p, birthDate: v }))
                }
              />
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border/50 px-6 py-4 flex gap-3 bg-background">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-2xl"
                onClick={handleClose}
              >
                {t("app.cancel")}
              </Button>

              <Button
                className="flex-1 h-11 rounded-2xl"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("profile.save")}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ================= Helpers ================= */

const FormField = ({
  label,
  value,
  onChange,
  customStyle,
  type = "text",
}: any) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <Input
      type={type}
      className={cn(
        "h-11 rounded-2xl bg-muted/20 focus:bg-background transition",
        customStyle
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
