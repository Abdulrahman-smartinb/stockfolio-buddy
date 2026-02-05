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
    purchaseRequests,
    loadingRequests,
    refetchRequests,

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
    REVIEW_STATUS_STYLES,
  } = useProfile();

  const avatarSrc = useMemo(() => {
    const p = editData?.profilePreview;
    if (!p) return "";
    // if preview is blob url => use it directly
    if (String(p).startsWith("blob:")) return p;
    // otherwise it’s server filename/path
    return `${base_url}/Investor/${p}`;
  }, [editData?.profilePreview]);

  const canVerify =
    role !== "investor" &&
    !isEditing &&
    user?.reviewStatus !== "approved" &&
    user?.reviewStatus !== "pending";

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
          {/* PAGE TITLE */}
          <motion.div variants={itemVariants} className="relative">
            <div
              className={cn(
                "absolute -top-6 left-0 right-0 h-40 -z-10",
                "rounded-3xl blur-2xl opacity-60"
              )}
              style={{
                background:
                  "radial-gradient(900px 200px at 10% 10%, rgba(7,37,34,0.24), transparent 60%), radial-gradient(700px 220px at 70% 30%, rgba(7,37,34,0.14), transparent 55%)",
              }}
            />
            <div className="flex items-end justify-between gap-4">
              {/* Small badge */}
              {user?.reviewStatus && role !== "investor" && (
                <div
                  className={cn(
                    "hidden sm:inline-flex items-center gap-2",
                    "rounded-2xl px-3 py-2",
                    "border border-border/60 bg-background/60 backdrop-blur-xl shadow-sm"
                  )}
                >
                  <ShieldCheck className="w-4 h-4 text-pr" />
                  <span className="text-xs text-muted-foreground">
                    {t("status")}:
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      REVIEW_STATUS_STYLES[user.reviewStatus]
                    )}
                  >
                    {t(user.reviewStatus)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

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
                    "rounded-3xl border border-border/60",
                    "bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden"
                  )}
                >
                  {/* top accent */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #072522, rgba(7,37,34,0.35), transparent)",
                    }}
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left: Avatar + name */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={cn(
                              "h-[74px] w-[74px] sm:h-[86px] sm:w-[86px]",
                              "rounded-2xl overflow-hidden ring-1 ring-border/60",
                              "bg-muted/30"
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
                                <span className="text-2xl font-extrabold text-pr">
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
                                  className="hidden"
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

                          {/* tiny glow */}
                          <div
                            className="absolute -inset-1 -z-10 rounded-3xl blur-xl opacity-50"
                            style={{
                              background:
                                "radial-gradient(60px 60px at 30% 30%, rgba(7,37,34,0.35), transparent 60%)",
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          {!isEditing ? (
                            <>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground truncate">
                                  {user?.fullName}
                                </p>

                                {role === "investor" && (
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1",
                                      "px-2.5 py-1 rounded-full text-[11px] font-semibold",
                                      "bg-pr/10 text-pr ring-1 ring-pr/25"
                                    )}
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {t("investor") ?? "Investor"}
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
                                <span className="truncate">
                                  {user?.email || user?.phone || "—"}
                                </span>
                                <span className="opacity-40">•</span>
                                <span className="truncate">
                                  {role === "investor"
                                    ? t("verified_member") ?? "Verified member"
                                    : t("application_profile") ??
                                      "Application profile"}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                {t("full_name")}
                              </p>
                              <Input
                                className={cn(
                                  "h-10 text-sm rounded-2xl",
                                  "bg-background/60 border-border/60"
                                )}
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
                      </div>

                      {/* Right: actions */}
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          "justify-end",
                          isMobile && "flex-col items-stretch"
                        )}
                      >
                        {/* Verify */}
                        {canVerify && (
                          <button
                            onClick={() => setOpenVerify(true)}
                            className={cn(
                              "inline-flex items-center justify-center gap-2",
                              "h-10 px-4 rounded-xl text-sm font-semibold",
                              "ring-1 ring-pr/30 bg-pr/10 text-pr",
                              "hover:bg-pr/15 transition"
                            )}
                          >
                            <Verified className="w-4 h-4" />
                            {t("verify")}
                          </button>
                        )}

                        {/* Edit / Save */}
                        <button
                          onClick={
                            isEditing
                              ? handleSaveProfile
                              : () => setIsEditing(true)
                          }
                          disabled={isSaving}
                          className={cn(
                            "inline-flex items-center justify-center gap-2",
                            "h-10 px-5 rounded-xl text-sm font-semibold",
                            "ring-1 transition",
                            isEditing
                              ? "bg-pr text-white ring-pr/40 hover:opacity-95"
                              : "bg-background/60 ring-border/60 text-pr hover:bg-muted/40",
                            isSaving && "opacity-60 cursor-not-allowed"
                          )}
                          style={
                            isEditing
                              ? { backgroundColor: "#072522" }
                              : undefined
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

                        {/* Logout — SAME SIZE, RED */}
                        <button
                          onClick={logout}
                          className={cn(
                            "inline-flex items-center justify-center gap-2",
                            "h-10 px-5 rounded-xl text-sm font-semibold",
                            "ring-1 ring-red-500/30 text-red-600 bg-red-500/5",
                            "hover:bg-red-500/10 hover:ring-red-500/40 transition"
                          )}
                        >
                          <LogOut className="w-4 h-4" />
                          {t("logout")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* subtle bottom fade */}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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

                      {/* small status on mobile */}
                      {user?.reviewStatus && role !== "investor" && (
                        <span
                          className={cn(
                            "sm:hidden text-[11px] px-2.5 py-1 rounded-full",
                            "ring-1 ring-border/60 bg-muted/20 text-muted-foreground"
                          )}
                        >
                          {t(user.reviewStatus)}
                        </span>
                      )}
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
                                {user?.phone || "—"}
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

              {/* PENDING REQUESTS */}
              {role === "investor" && (
                <motion.div variants={itemVariants}>
                  <PendingRequests
                    isLoading={loadingRequests}
                    data={purchaseRequests}
                    refetch={refetchRequests}
                  />
                </motion.div>
              )}
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
