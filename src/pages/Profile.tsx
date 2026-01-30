import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Phone,
  PenBox,
  CheckCircle2,
  Verified,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import TransactionHistory from "@/components/TransactionHistory";
import PendingRequests from "@/components/PendingRequests";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { VerifyAccountModal } from "@/components/VerifyAccountModal";
import { isInvestor } from "@/hooks/helpers";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const canTrade = isInvestor();
  const {
    user,
    purchaseHistory,
    isLoading,
    purchaseRequests,
    loadingRequests,
    isEditing,
    setIsEditing,
    containerVariants,
    itemVariants,
    editData,
    setEditData,
    handleProfileImageChange,
    handleSaveProfile,
    isSaving,
    page,
    setPage,
    limit,
    setLimit,
    role,
    openVerify,
    setOpenVerify,
    handleClose,
    REVIEW_STATUS_STYLES,
  } = useProfile();

  const transactions = purchaseHistory?.data ?? [];

  const { ownedShares, investedValue } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === "buy") {
        acc.ownedShares += tx.shares;
        acc.investedValue += tx.purchaseValue;
      }

      if (tx.type === "sell") {
        acc.ownedShares -= tx.shares;
        acc.investedValue -= tx.purchaseValue;
      }

      return acc;
    },
    {
      ownedShares: 0,
      investedValue: 0,
    }
  );

  const stats = [
    {
      label: t("total_shares"),
      value: `${ownedShares} ${t("shares")}`,
      subValue: "NVDA",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },

    {
      label: t("shares_value"),
      value: `${investedValue} USD`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
          <motion.div variants={itemVariants}>
            <h1 className="text-xl sm:text-3xl font-bold gradient-text">
              {t("profile")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t("profile_letter")}
            </p>
          </motion.div>

          {/* Stats Grid */}
          {canTrade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t(stat.label)}
                      </p>
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      {stat.subValue && (
                        <p className="text-xs text-muted-foreground">
                          {stat.subValue}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PERSONAL INFO */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="w-4 h-4 text-primary" />
                    {t("personal_info")}
                  </CardTitle>

                  <div className={`flex ${isMobile && "flex-col"} gap-2`}>
                    {role !== "investor" &&
                      !isEditing &&
                      user?.reviewStatus !== "approved" &&
                      user?.reviewStatus !== "pending" && (
                        <button
                          onClick={() => setOpenVerify(true)}
                          style={{ color: "#0051ff" }}
                          className="flex items-center gap-1 text-xs sm:text-sm"
                        >
                          <Verified className="w-4 h-4" />
                          {t("verify")}
                        </button>
                      )}
                    <button
                      onClick={
                        isEditing ? handleSaveProfile : () => setIsEditing(true)
                      }
                      disabled={isSaving}
                      className="flex items-center gap-1 text-xs sm:text-sm text-primary"
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
              </CardHeader>

              <CardContent className="space-y-5">
                {/* AVATAR + NAME */}
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    {editData.profilePreview ? (
                      <img
                        src={editData.profilePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg sm:text-2xl font-bold text-white">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    )}

                    {isEditing && (
                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] text-white cursor-pointer">
                        {t("change")}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleProfileImageChange(e.target.files?.[0])
                          }
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <p className="text-sm sm:text-xl font-semibold">
                          {user?.fullName}
                          {role !== "investor" && (
                            <>
                              -{" "}
                              <span
                                className={
                                  REVIEW_STATUS_STYLES[user?.reviewStatus]
                                }
                              >
                                {t(user?.reviewStatus)}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("member_since")}{" "}
                          {format(user?.createdAt || Date.now(), "MMM yyyy")}
                        </p>
                      </>
                    ) : (
                      <Input
                        className="h-9 text-sm"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* EMAIL */}
                  <div className="flex items-center gap-3 p-3 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t("email")}
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium">{user?.email}</p>
                      ) : (
                        <Input
                          className="h-8 text-sm"
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

                  {/* PHONE */}
                  <div className="flex items-center gap-3 p-3 rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t("phone")}
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium">{user?.phone}</p>
                      ) : (
                        <Input
                          className="h-8 text-sm"
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

                  {/* BIRTH DATE */}
                  <div className="flex items-center gap-3 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t("birth_date")}
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium">
                          {user?.birthDate
                            ? format(user?.birthDate, "MMM yyyy")
                            : "—"}
                        </p>
                      ) : (
                        <Input
                          type="date"
                          className="h-8 text-sm"
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
              </CardContent>
            </Card>
          </motion.div>

          {/* TRANSACTION HISTORY */}
          {role === "investor" && (
            <motion.div variants={itemVariants}>
              <TransactionHistory
                isLoading={isLoading}
                data={purchaseHistory?.data}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                totalPages={purchaseHistory?.totalPages}
              />
            </motion.div>
          )}

          {/* PENDING REQUESTS */}
          {role === "investor" && (
            <motion.div variants={itemVariants}>
              <PendingRequests
                isLoading={loadingRequests}
                data={purchaseRequests?.data}
              />
            </motion.div>
          )}
        </motion.div>
      </main>

      <VerifyAccountModal
        isOpen={openVerify}
        onClose={handleClose}
        t={t}
        isMobile={isMobile}
      />

      <Footer />
    </div>
  );
};

export default Profile;
