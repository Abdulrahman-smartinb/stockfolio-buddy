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
  Cake,
} from "lucide-react";
import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";

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
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and view purchase history
            </p>
          </motion.div>

          {/* Personal Information Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardTitle
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <div
                        className="flex gap-2 items-center"
                        onClick={handleSaveProfile}
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Save Changes
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <PenBox className="w-5 h-5 text-primary" />
                        Update Profile
                      </div>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    {editData.profilePreview ? (
                      <img
                        src={editData.profilePreview}
                        alt="User picture"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-foreground">
                        {user?.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}

                    {isEditing && (
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer text-white text-xs opacity-0 hover:opacity-100 transition">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleProfileImageChange(e.target.files?.[0])
                          }
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    {!isEditing ? (
                      <h3 className="text-xl font-semibold text-foreground text-start">
                        {user?.fullName || "User"}
                        <div className="flex">
                          <span className="text-sm text-foreground">
                            Member Since:&nbsp;
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(user?.createdAt, "MMM yyyy")}
                          </span>
                        </div>
                      </h3>
                    ) : (
                      <Input
                        className="input w-full"
                        placeholder="Full name"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {!isEditing ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground text-start">
                          Email
                        </p>
                        <p className="font-medium text-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Mail className="w-5 h-5 text-primary" />
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground text-start">
                          Email
                        </p>
                        <Input
                          type="email"
                          className="input w-full"
                          placeholder="example@domain.com"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {!isEditing ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground text-start">
                          Phone number
                        </p>
                        <p className="font-medium text-foreground">
                          {user?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Phone className="w-5 h-5 text-primary" />
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground text-start">
                          Phone number
                        </p>
                        <Input
                          type="tel"
                          className="input w-full"
                          placeholder="905**********"
                          value={editData.phoneNumber}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {!isEditing ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground text-start">
                          Birth Date
                        </p>
                        <p className="font-medium text-foreground">
                          {user?.birthDate
                            ? format(user?.birthDate, "MMMM yyyy")
                            : "Not registered"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground text-start">
                          Birth Date
                        </p>
                        <Input
                          type="date"
                          className="input w-full"
                          placeholder="Birth Date"
                          value={editData.birthDate}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              birthDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Purchase History */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : purchaseHistory?.data &&
                  purchaseHistory?.data?.length > 0 ? (
                  <div className="space-y-4">
                    {purchaseHistory?.data?.map((purchase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${
                              purchase?.type === "buy"
                                ? "primary"
                                : "destructive"
                            }/20 to-${
                              purchase?.type === "buy"
                                ? "accent"
                                : "destructive"
                            }/20 flex items-center justify-center`}
                          >
                            {purchase?.type === "buy" ? (
                              <TrendingUp className="w-6 h-6 text-primary" />
                            ) : (
                              <TrendingDown className="w-6 h-6 text-destructive" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {purchase?.shares} shares
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-start">
                              {purchase?.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-semibold text-foreground">
                            <DollarSign className="w-4 h-4" />
                            {purchase?.purchaseValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(purchase?.createdAt),
                              "MMM dd, yyyy • HH:mm"
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      No purchase history yet
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Start trading to see your transactions here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Requests */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : purchaseRequests?.data &&
                  purchaseRequests?.data?.length > 0 ? (
                  <div className="space-y-4">
                    {purchaseRequests?.data?.map((purchase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${
                              purchase?.status === "pending"
                                ? "primary"
                                : "destructive"
                            }/20 to-${
                              purchase?.status === "pending"
                                ? "accent"
                                : "destructive"
                            }/20 flex items-center justify-center`}
                          >
                            {purchase?.status === "pending" ? (
                              <Clock className="w-6 h-6 text-primary" />
                            ) : (
                              <X className="w-6 h-6 text-destructive" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {purchase?.shares} shares
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-start">
                              {purchase?.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-semibold text-foreground">
                            <DollarSign className="w-4 h-4" />
                            {(
                              purchase?.shares * purchase?.sharePrice
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(purchase?.createdAt),
                              "MMM dd, yyyy • HH:mm"
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      No purchase history yet
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Start trading to see your transactions here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
