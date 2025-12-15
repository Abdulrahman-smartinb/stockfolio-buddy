import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dummy authentication - in real app, this would call the RTK Query mutation
    try {
      const userData = {
        id: `user-${Date.now()}`,
        name: mode === "register" ? formData.name : formData.email.split("@")[0],
        email: formData.email,
      };

      login(userData);
      
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description: `You're now signed in as ${userData.name}`,
      });

      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.15),transparent_50%)]" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Trade Smarter.<br />
              <span className="gradient-text">Grow Faster.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of investors using StockFlow to make informed trading decisions with real-time market data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            {[
              { label: "Active Traders", value: "50K+" },
              { label: "Daily Volume", value: "$2.5B" },
              { label: "Markets", value: "120+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-32 h-32 rounded-3xl glass-card glow-primary"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-32 w-20 h-20 rounded-2xl glass-card glow-accent"
        />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">StockFlow</span>
          </div>

          <div className="glass-card rounded-2xl p-8">
            {/* Tab Switcher */}
            <div className="flex bg-muted rounded-xl p-1 mb-8">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {mode === "register" && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
