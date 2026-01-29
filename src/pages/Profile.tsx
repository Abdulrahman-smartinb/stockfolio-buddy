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
import GlobalModal from "@/components/GlobalModal";
import { useRef, useState } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
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
    setIdPhoto,
    livePhoto,
    setLivePhoto,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    handleSubmit,
    isSubmitting,
    handleClose,
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
    },
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
  const [openCamera, setOpenCamera] = useState(false);

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

      <GlobalModal
        isOpen={openVerify}
        onSubmit={handleSubmit}
        title={t("verify")}
        content={
          <div className="max-h-[60vh] overflow-y-auto">
            <p className="mx-auto p-1 bg-warning/30 rounded-sm text-center">
              <span className="text-destructive">*</span> indicates required
              fields
            </p>
            <div className="flex items-center gap-3 p-3">
              <div className="flex w-full items-center">
                <p className="text-sm text-muted-foreground ms-2 w-[20%]">
                  {t("id_number")} <span className="text-destructive">*</span>
                </p>
                <Input
                  type="number"
                  className="h-8 text-sm w-[80%]"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="flex w-full items-center">
                <p className="text-sm text-muted-foreground ms-2 w-[20%]">
                  {t("passport_number")}{" "}
                  <span className="text-destructive">*</span>
                </p>
                <Input
                  type="number"
                  className="h-8 text-sm w-[80%]"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="flex w-full items-center">
                <p className="text-sm text-muted-foreground ms-2 w-[20%]">
                  {t("id_photo")} <span className="text-destructive">*</span>
                </p>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="h-10 text-sm w-[80%]"
                  onChange={(e) => setIdPhoto(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="flex w-full items-center">
                <p className="text-sm text-muted-foreground ms-2 w-[20%]">
                  {t("live_photo")} <span className="text-destructive">*</span>
                </p>
                {isMobile && (
                  <Input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => setLivePhoto(e.target.files?.[0] ?? null)}
                  />
                )}

                {!isMobile && !openCamera && !livePhoto && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="shrink-0 flex items-center justify-center gap-2"
                    onClick={() => setOpenCamera(true)}
                  >
                    <Camera />
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
                  <div className="gap-2 mt-2 w-[70%] ps-2">
                    <p>
                      {t("photo_preview")}:{" "}
                      {!isMobile && (
                        <span
                          className="text-[#0060aa] cursor-pointer"
                          onClick={() => setOpenCamera(true)}
                        >
                          Retake
                        </span>
                      )}
                    </p>
                    <img className="rounded-lg" src={livePhotoPreview} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 pt-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground ms-2">
                  {t("payment_method")}{" "}
                  <span className="text-destructive">*</span>
                </p>
                <select
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">{t("pls_select")}</option>
                  <option value="bank">{t("bank_transfer")}</option>
                  <option value="shamcash">{t("sham_cash")}</option>
                  <option value="usdt">{t("usdt")}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              {paymentMethod === "bank" && (
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("beneficiary_full_name")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={bankData?.beneficiaryFullName ?? ""}
                      onChange={(e) =>
                        setBankData({
                          ...bankData,
                          beneficiaryFullName: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("beneficiary_address")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={bankData?.beneficiaryAddress ?? ""}
                      onChange={(e) =>
                        setBankData({
                          ...bankData,
                          beneficiaryAddress: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("bank_name")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={bankData?.bankName ?? ""}
                      onChange={(e) =>
                        setBankData({
                          ...bankData,
                          bankName: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("account_number")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={bankData?.accountNumber ?? ""}
                      onChange={(e) =>
                        setBankData({
                          ...bankData,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "shamcash" && (
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("account_number")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={shamCashData?.accountNumber ?? ""}
                      onChange={(e) =>
                        setShamCashData({
                          ...shamCashData,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("qr_code_optional")}
                    </p>
                    <Input
                      type="file"
                      className="h-8 text-sm"
                      onChange={(e) =>
                        setShamCashData({
                          ...shamCashData,
                          qrCode: e.target.files[0],
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("beneficiary_full_name")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={shamCashData?.beneficiaryName}
                      onChange={(e) =>
                        setShamCashData({
                          ...shamCashData,
                          beneficiaryName: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("beneficiary_address")}
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={shamCashData?.beneficiaryAddress}
                      onChange={(e) =>
                        setShamCashData({
                          ...shamCashData,
                          beneficiaryAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "usdt" && (
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("transfer_network")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <select
                      onChange={(e) => {
                        const value = e.target.value;

                        setUsdtData((prev) => ({
                          ...prev,
                          transferNetwork: value === "other" ? "" : value,
                          otherNetwork: value === "other" ? "" : undefined,
                        }));
                      }}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                    >
                      <option value="">{t("pls_select")}</option>
                      <option value="TRC20">TRC20</option>
                      <option value="ERC20">ERC20</option>
                      <option value="BEP20">BEP20</option>
                      <option value="other">{t("other")}</option>
                    </select>
                    {usdtData?.otherNetwork !== undefined && (
                      <>
                        <p className="text-sm text-muted-foreground ms-2 mt-2">
                          {t("transfer_network")}{" "}
                          <span className="text-destructive">*</span>
                        </p>
                        <Input
                          type="text"
                          className="h-8 text-sm"
                          value={usdtData.otherNetwork}
                          onChange={(e) =>
                            setUsdtData((prev) => ({
                              ...prev,
                              otherNetwork: e.target.value,
                              transferNetwork: e.target.value,
                            }))
                          }
                        />
                      </>
                    )}

                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("wallet_address")}{" "}
                      <span className="text-destructive">*</span>
                    </p>
                    <Input
                      type="string"
                      className="h-8 text-sm"
                      value={usdtData?.walletAddress ?? ""}
                      onChange={(e) =>
                        setUsdtData({
                          ...usdtData,
                          walletAddress: e.target.value,
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground ms-2 mt-2">
                      {t("wallet_qr")}
                    </p>
                    <Input
                      type="file"
                      className="h-8 text-sm"
                      onChange={(e) =>
                        setUsdtData({
                          ...usdtData,
                          walletQr: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        isLoading={isSubmitting}
        onClose={handleClose}
      />

      <Footer />
    </div>
  );
};

export default Profile;
