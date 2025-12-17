import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGetPurchaseHistoryQuery } from "@/store/api/stocksApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, TrendingUp, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: purchaseHistory, isLoading } = useGetPurchaseHistoryQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-muted-foreground">Premium Member</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(), "MMMM yyyy")}
                      </p>
                    </div>
                  </div>
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
                ) : purchaseHistory && purchaseHistory.length > 0 ? (
                  <div className="space-y-4">
                    {purchaseHistory.map((purchase, index) => (
                      <motion.div
                        key={purchase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">
                                {purchase.symbol}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {purchase.quantity} shares
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {purchase.stockName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-semibold text-foreground">
                            <DollarSign className="w-4 h-4" />
                            {purchase.totalAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(purchase.purchaseDate), "MMM dd, yyyy • HH:mm")}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No purchase history yet</p>
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
