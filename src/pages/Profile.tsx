import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PendingRequests from "@/components/PendingRequests";
import { Footer } from "@/components/Footer";
import { VerifyAccountModal } from "@/components/VerifyAccountModal";

import {
  User,
  Mail,
  Calendar,
  Phone,
  PenBox,
  CheckCircle2,
  Verified,
  ShieldCheck,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCcw,
} from "lucide-react";

import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { base_url } from "@/api/GlobalData";
import { RingLoader } from "react-spinners";
import { CSSProperties, useMemo } from "react";
import { cn } from "@/lib/utils";
import { isMobile } from "@/hooks/helpers";
import { useAuth } from "@/hooks/useAuth";

function LtrValue({ children, className = "" }) {
  return (
    <span dir="ltr" className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { logout } = useAuth();

  const {
    loadingUser,
    user,

    isEditing,
    setIsEditing,
    containerVariants,
    itemVariants,

    editData,
    setEditData,
    handleProfileImageChange,
    handleSaveProfile,
    isSaving,

    role,
    refetchRole,
    isInvestor,
    isApplicant,
    reviewStatus,

    openVerify,
    setOpenVerify,

    idPhoto,
    setIdPhoto,
    livePhoto,
    setLivePhoto,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    passportExpDate,
    setPassportExpDate,
    handleSubmit,
    isSubmitting,
    handleClose,
    livePhotoPreview,
    setLivePhotoPreview,
  } = useProfile();

  const avatarSrc = useMemo(() => {
    const p = editData?.profilePreview;
    if (!p) return "";
    // if preview is blob url => use it directly
    if (String(p).startsWith("blob:")) return p;
    // otherwise it’s server filename/path
    return `${base_url}/Investor/${p}`;
  }, [editData?.profilePreview]);

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-8"
        >
          {loadingUser ? (
            <div className="py-10">
              <RingLoader
                color={"#072522"}
                loading={loadingUser}
                cssOverride={override}
                size={130}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {/* HERO CARD */}
              <motion.div variants={itemVariants}>
                <div
                  className={cn(
                    "relative",
                    "rounded-3xl border border-border/60",
                    "bg-background/70 backdrop-blur-xl shadow-sm"
                  )}
                >
                  {/* ===== TOP ACTIONS ===== */}
                  <div
                    className={cn(
                      "absolute top-4 sm:top-5 z-10 flex items-center gap-2",
                      "right-4 sm:right-5",
                      "rtl:right-auto rtl:left-4 sm:rtl:left-5"
                    )}
                  >
                    {/* Refresh */}
                    <button
                      onClick={refetchRole}
                      className={cn(
                        "h-8 px-3 rounded-xl text-sm font-medium",
                        "inline-flex items-center gap-2",
                        "ring-1 ring-border/60",
                        "bg-background/60 hover:bg-muted/40 transition"
                      )}
                    >
                      <RefreshCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("refresh")}</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className={cn(
                        "h-8 px-3 rounded-xl text-sm font-medium",
                        "inline-flex items-center gap-2",
                        "ring-1 ring-rose-500/30",
                        "text-rose-600 bg-rose-500/10",
                        "hover:bg-rose-500/15 hover:ring-rose-500/40 transition"
                      )}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("logout")}</span>
                    </button>
                  </div>

                  {/* ===== CONTENT ===== */}
                  <div className="p-5 sm:p-6">
                    <div
                      className={cn(
                        "grid gap-4",
                        "grid-cols-1 sm:grid-cols-[auto_1fr_auto]",
                        "items-center"
                      )}
                    >
                      {/* ===== AVATAR COLUMN (FIXED) ===== */}
                      <div className="flex items-center gap-4 min-w-[96px]">
                        <div className="relative">
                          <div
                            className={cn(
                              "h-[86px] w-[86px]",
                              "rounded-2xl overflow-hidden",
                              "ring-1 ring-border/60 bg-muted/30"
                            )}
                          >
                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span
                                  className="text-2xl font-extrabold"
                                  style={{ color: "#042623" }}
                                >
                                  {user?.fullName?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                            )}

                            {isEditing && (
                              <label className="absolute inset-0 bg-black/45 flex items-center justify-center text-[11px] text-white cursor-pointer">
                                {t("change")}
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleProfileImageChange(
                                      e.target.files?.[0]
                                    )
                                  }
                                />
                              </label>
                            )}
                          </div>

                          {/* soft brand glow */}
                          <div
                            className="absolute -inset-1 -z-10 rounded-3xl blur-xl opacity-40"
                            style={{
                              background:
                                "radial-gradient(60px 60px at 30% 30%, rgba(4,38,35,0.35), transparent 60%)",
                            }}
                          />
                        </div>
                      </div>

                      {/* ===== NAME + META (FLUID) ===== */}
                      <div className="min-w-0">
                        {!isEditing ? (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-lg sm:text-2xl font-extrabold tracking-tight truncate">
                                {user?.fullName}
                              </p>

                              {isInvestor && (
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1",
                                    "px-2.5 py-1 rounded-full text-[11px] font-semibold",
                                    "ring-1"
                                  )}
                                  style={{
                                    backgroundColor: "rgba(4,38,35,0.08)",
                                    color: "#042623",
                                    borderColor: "rgba(4,38,35,0.25)",
                                  }}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  {t("investor")}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-1">
                              {t("member_since")}{" "}
                              {format(
                                user?.createdAt || Date.now(),
                                "MMM yyyy"
                              )}
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="truncate">{user?.email}</span>
                              <LtrValue className="text-xs text-muted-foreground">
                                {user?.phone}
                              </LtrValue>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2 max-w-sm">
                            <p className="text-xs text-muted-foreground">
                              {t("full_name")}
                            </p>
                            <Input
                              className="h-10 rounded-2xl bg-background/60 border-border/60"
                              value={editData.fullName}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  fullName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* ===== ACTIONS (FIXED WIDTH) ===== */}
                      <div
                        className={cn(
                          "flex items-center gap-2 justify-end",
                          "min-w-[220px]",
                          isMobile && "flex-col items-stretch"
                        )}
                      >
                        {isApplicant && reviewStatus === "draft" && (
                          <button
                            onClick={() => setOpenVerify(true)}
                            className={cn(
                              "h-10 px-4 rounded-xl text-sm font-semibold",
                              "inline-flex items-center gap-2",
                              "ring-1 transition"
                            )}
                            style={{
                              backgroundColor: "rgba(4,38,35,0.08)",
                              color: "#042623",
                              borderColor: "rgba(4,38,35,0.3)",
                            }}
                          >
                            <Verified className="w-4 h-4" />
                            {t("verify")}
                          </button>
                        )}

                        <button
                          onClick={
                            isEditing
                              ? handleSaveProfile
                              : () => setIsEditing(true)
                          }
                          disabled={isSaving}
                          className={cn(
                            "h-10 px-5 rounded-xl text-sm font-semibold",
                            "inline-flex items-center justify-center gap-2",
                            "ring-1 transition",
                            isSaving && "opacity-60 cursor-not-allowed"
                          )}
                          style={
                            isEditing
                              ? {
                                  backgroundColor: "#042623",
                                  color: "#fff",
                                  borderColor: "rgba(4,38,35,0.4)",
                                }
                              : {
                                  backgroundColor: "rgba(4,38,35,0.05)",
                                  color: "#042623",
                                  borderColor: "rgba(4,38,35,0.25)",
                                }
                          }
                        >
                          {isEditing ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              {t("save")}
                            </>
                          ) : (
                            <>
                              <PenBox className="w-4 h-4" />
                              {t("edit")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* PERSONAL INFO CARD */}
              <motion.div variants={itemVariants}>
                <Card
                  className={cn(
                    "border-border/60",
                    "bg-background/60 backdrop-blur-xl",
                    "rounded-3xl shadow-sm"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                        <User className="w-4 h-4 text-pr" />
                        {t("personal_info")}
                      </CardTitle>

                      <span
                        className={cn(
                          "sm:hidden text-[11px] px-2.5 py-1 rounded-full",
                          "ring-1 ring-border/60 bg-muted/20 text-muted-foreground"
                        )}
                      >
                        {t(reviewStatus)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 sm:space-y-5">
                    {/* INFO GRID */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* EMAIL */}
                      <div
                        className={cn(
                          "rounded-2xl p-3",
                          "ring-1 ring-border/50 bg-muted/15",
                          "hover:bg-muted/25 transition"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-2xl",
                              "ring-1 ring-border/60 bg-background/40",
                              "flex items-center justify-center"
                            )}
                          >
                            <Mail className="w-4 h-4 text-pr" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-muted-foreground">
                              {t("email")}
                            </p>
                            {!isEditing ? (
                              <p className="text-sm font-semibold text-foreground truncate">
                                {user?.email || "—"}
                              </p>
                            ) : (
                              <Input
                                className={cn(
                                  "h-9 text-sm rounded-2xl mt-1",
                                  "bg-background/60 border-border/60"
                                )}
                                value={editData.email}
                                onChange={(e) =>
                                  setEditData((p) => ({
                                    ...p,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* PHONE */}
                      <div
                        className={cn(
                          "rounded-2xl p-3",
                          "ring-1 ring-border/50 bg-muted/15",
                          "hover:bg-muted/25 transition"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-2xl",
                              "ring-1 ring-border/60 bg-background/40",
                              "flex items-center justify-center"
                            )}
                          >
                            <Phone className="w-4 h-4 text-pr" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-muted-foreground">
                              {t("phone")}
                            </p>
                            {!isEditing ? (
                              <p className="text-sm font-semibold text-foreground truncate">
                                <LtrValue className="text-xs text-muted-foreground">
                                  {user?.phone}
                                </LtrValue>
                              </p>
                            ) : (
                              <Input
                                className={cn(
                                  "h-9 text-sm rounded-2xl mt-1",
                                  "bg-background/60 border-border/60"
                                )}
                                value={editData.phone}
                                onChange={(e) =>
                                  setEditData((p) => ({
                                    ...p,
                                    phone: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* BIRTH DATE */}
                      <div
                        className={cn(
                          "rounded-2xl p-3",
                          "ring-1 ring-border/50 bg-muted/15",
                          "hover:bg-muted/25 transition"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-2xl",
                              "ring-1 ring-border/60 bg-background/40",
                              "flex items-center justify-center"
                            )}
                          >
                            <Calendar className="w-4 h-4 text-pr" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-muted-foreground">
                              {t("birth_date")}
                            </p>
                            {!isEditing ? (
                              <p className="text-sm font-semibold text-foreground truncate">
                                {user?.birthDate
                                  ? format(user?.birthDate, "MMM yyyy")
                                  : "—"}
                              </p>
                            ) : (
                              <Input
                                type="date"
                                className={cn(
                                  "h-9 text-sm rounded-2xl mt-1",
                                  "bg-background/60 border-border/60"
                                )}
                                value={editData.birthDate}
                                onChange={(e) =>
                                  setEditData((p) => ({
                                    ...p,
                                    birthDate: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* subtle hint */}
                    <div
                      className={cn(
                        "flex items-center gap-2 text-[11px] text-muted-foreground",
                        "rounded-2xl border border-border/50 bg-background/40 p-3"
                      )}
                    >
                      <Sparkles className="w-4 h-4 text-pr" />
                      <span>
                        {role === "investor"
                          ? t("profile_investor_hint") ??
                            "Keep your info updated for smoother transactions."
                          : t("profile_applicant_hint") ??
                            "Complete verification to unlock investing features."}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      <VerifyAccountModal
        isOpen={openVerify}
        onClose={handleClose}
        t={t}
        idNumber={idNumber}
        setIdNumber={setIdNumber}
        passportNumber={passportNumber}
        setPassportNumber={setPassportNumber}
        passportExpDate={passportExpDate}
        setPassportExpDate={setPassportExpDate}
        idPhoto={idPhoto}
        setIdPhoto={setIdPhoto}
        livePhoto={livePhoto}
        setLivePhoto={setLivePhoto}
        livePhotoPreview={livePhotoPreview}
        setLivePhotoPreview={setLivePhotoPreview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
};

export default Profile;
