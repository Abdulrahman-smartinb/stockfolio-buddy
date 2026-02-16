import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { VerifyAccountModal } from "@/components/VerifyAccountModal";
import { EditProfileModal } from "@/components/EditProfileModal";

import {
  User,
  Mail,
  Calendar,
  Phone,
  LogOut,
  RefreshCcw,
  PenBox,
  CircleCheckBig,
} from "lucide-react";

import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { base_url } from "@/api/GlobalData";
import { RingLoader } from "react-spinners";
import { CSSProperties, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
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
    email,
    setEmail,
  } = useProfile();

  const [openEditModal, setOpenEditModal] = useState(false);

  const statusKey = reviewStatus?.toLowerCase() ?? "draft";

  const avatarSrc = useMemo(() => {
    if (!user?.profileImage) return "";
    return `${base_url}/Investor/${user.profileImage}`;
  }, [user?.profileImage]);

  return (
    <div className="min-h-screen bg-background " dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container text-foreground mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {loadingUser ? (
            <div className="py-16">
              <RingLoader
                color={"#072522"}
                loading={loadingUser}
                cssOverride={override}
                size={120}
              />
            </div>
          ) : (
            <>
              {/* ================= HERO ================= */}
              <motion.div variants={itemVariants}>
                <div className="relative rounded-3xl border border-border/60 bg-background shadow-sm p-5 sm:p-6">
                  {/* ===== Actions ===== */}
                  <div
                    className={cn(
                      "absolute top-4 flex gap-2",
                      isRtl ? "left-4" : "right-4"
                    )}
                  >
                    <button
                      onClick={refetchRole}
                      className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 rounded-xl ring-1 ring-border/60 bg-muted/30 hover:bg-muted/50 transition flex items-center justify-center"
                    >
                      <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {isApplicant && (
                      <button
                        onClick={() => {
                          if (reviewStatus === "draft") {
                            setOpenVerify(true);
                          }
                        }}
                        disabled={reviewStatus === "pending"}
                        className={`
                              h-9
                              px-3 sm:px-4
                              rounded-xl
                              ring-1
                              transition
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              whitespace-nowrap
                              ${
                                reviewStatus === "draft"
                                  ? "ring-primary/30 bg-primary/10 text-text-foreground hover:bg-primary/20"
                                  : "ring-muted bg-muted text-muted-foreground cursor-not-allowed"
                              }
                            `}
                      >
                        <CircleCheckBig className="w-4 h-4 shrink-0" />

                        <span className="font-semibold text-sm leading-none">
                          {reviewStatus === "draft"
                            ? t("verification.verify")
                            : t("verification.verification_in_progress")}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => setOpenEditModal(true)}
                      className="h-8 w-8 sm:w-auto sm:px-3 rounded-xl ring-1 ring-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition inline-flex items-center justify-center sm:gap-2"
                    >
                      <PenBox className="w-4 h-4 " />
                      <span className="hidden sm:inline font-bold text-sm">
                        {t("profile.edit")}
                      </span>
                    </button>

                    <button
                      onClick={logout}
                      className="h-8 w-8 sm:w-auto sm:px-3 rounded-xl ring-1 ring-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition inline-flex items-center justify-center sm:gap-2"
                    >
                      <LogOut className="w-4 h-4 " />
                      <span className="hidden sm:inline font-bold text-sm">
                        {t("nav.logout")}
                      </span>
                    </button>
                  </div>

                  {/* ===== Content ===== */}
                  <div className="pt-12 md:pt-6 flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="h-28 w-28 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden ring-1 ring-border bg-muted/30 flex items-center justify-center shrink-0">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl md:text-4xl font-extrabold text-primary">
                          {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>

                    {/* Text */}
                    <div
                      className={cn(
                        "flex-1 text-center sm:text-start",
                        isRtl && "sm:text-right"
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-3",
                          "justify-center sm:justify-start"
                        )}
                      >
                        <h2 className="text-xl md:text-xl lg:text-2xl font-extrabold tracking-tight">
                          {user?.fullName}
                        </h2>

                        {isInvestor && (
                          <span className="px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30">
                            {t("profile.investor")}
                          </span>
                        )}

                        {/* {isApplicant && (
                          <span className="px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30">
                            {t("profile.applicant")}
                          </span>
                        )} */}
                      </div>

                      {/* <p className="text-sm md:text-lg text-muted-foreground mt-2">
                        {t("profile.member_since")}{" "}
                        {format(user?.createdAt || Date.now(), "MMM yyyy")}
                      </p> */}

                      {/* ===== Role ===== */}

                      <div className="mt-4 space-y-1 text-sm md:text-lg text-muted-foreground font-google">
                        <div>{user?.email}</div>
                        <div>
                          <LtrValue>{user?.phone}</LtrValue>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ================= PERSONAL INFO ================= */}
              <motion.div variants={itemVariants}>
                <Card className="rounded-3xl border-border/60 bg-background shadow-sm">
                  <CardHeader className="flex-row items-center justify-between gap-3 pb-4">
                    {/* LEFT SIDE: Title */}
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl font-extrabold">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>

                      <span>{t("profile.personal_info")}</span>
                    </CardTitle>

                    {/* RIGHT SIDE: Status Badge */}
                    {isApplicant && (
                      <span className="self-start sm:self-auto px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-primary/10 text-primary ring-1 ring-primary/30">
                        {t(`profile.${statusKey}`)}
                      </span>
                    )}
                  </CardHeader>

                  <CardContent className="grid gap-4 sm:grid-cols-3 ">
                    <InfoBlock
                      icon={
                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      }
                      label={t("profile.email")}
                      value={user?.email}
                    />
                    <InfoBlock
                      icon={
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      }
                      label={t("profile.phone")}
                      value={<LtrValue>{user?.phone}</LtrValue>}
                    />
                    <InfoBlock
                      icon={
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      }
                      label={t("profile.birth_date")}
                      value={
                        user?.birthDate
                          ? format(user?.birthDate, "MMM yyyy")
                          : "—"
                      }
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={() => {
          handleSaveProfile();
          setOpenEditModal(false);
        }}
        isSaving={isSaving}
        handleProfileImageChange={handleProfileImageChange}
        avatarPreview={avatarSrc}
      />

      {/* Verify Modal */}
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
        email={email}
        setEmail={setEmail}
      />

      <Footer />
    </div>
  );
};

export default Profile;

/* ================= INFO BLOCK ================= */

const InfoBlock = ({ icon, label, value }: any) => (
  <div className="rounded-2xl p-4 md:p-5 ring-1 ring-border/50 bg-muted/10 hover:bg-muted/20 transition">
    <div className="flex items-center gap-3 md:gap-4">
      <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-background ring-1 ring-border flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
        <p className="text-sm md:text-lg font-semibold font-google">
          {value || "—"}
        </p>
      </div>
    </div>
  </div>
);
