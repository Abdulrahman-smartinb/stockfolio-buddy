import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Phone,
  TrendingDown,
  Clock,
  X,
  PenBox,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import TransactionHistory from "@/components/TransactionHistory";
import PendingRequests from "@/components/PendingRequests";

const Profile = () => {
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
  } = useProfile();

  return (
    <div className="min-h-screen bg-background">
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
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your account and view purchase history
            </p>
          </motion.div>

          {/* PERSONAL INFO */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </CardTitle>

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
                        Save
                      </>
                    ) : (
                      <>
                        <PenBox className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </button>
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
                        Change
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
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Member since {format(user?.createdAt, "MMM yyyy")}
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      {!isEditing ? (
                        <p className="text-sm font-medium">
                          {user?.phoneNumber}
                        </p>
                      ) : (
                        <Input
                          className="h-8 text-sm"
                          value={editData.phoneNumber}
                          onChange={(e) =>
                            setEditData((p) => ({
                              ...p,
                              phoneNumber: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* BIRTH DATE */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Birth Date
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
          <motion.div variants={itemVariants}>
            <TransactionHistory
              isLoading={isLoading}
              data={purchaseHistory?.data}
            />
          </motion.div>

          {/* PENDING REQUESTS */}
          <motion.div variants={itemVariants}>
            <PendingRequests
              isLoading={loadingRequests}
              data={purchaseRequests?.data}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
