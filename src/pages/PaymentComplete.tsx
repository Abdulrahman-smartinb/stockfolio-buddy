import { motion } from "framer-motion";
import {
  CheckCircle2,
  ReceiptText,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const PaymentComplete = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { orderId } = useParams();

  const isRtl = i18n.language === "ar";
  const finalOrderId = orderId ?? "15f6q1f6a5w1q65f1";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header />

      <main className="container mx-auto px-4 py-10 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl"
        >
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border bg-card/95 shadow-xl backdrop-blur"
          >
            {/* top glow / accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600" />

            <div className="p-6 md:p-10">
              <div className="flex flex-col items-center text-center">
                {/* success icon */}
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                  <CheckCircle2 className="h-14 w-14 text-emerald-600" />
                </div>

                <motion.h1
                  variants={itemVariants}
                  className="text-2xl font-bold tracking-tight md:text-4xl"
                >
                  {t("payments.success_title")}
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base"
                >
                  {t("payments.success_desc")}
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="mt-8 w-full rounded-2xl border bg-muted/40 p-4 md:p-5"
                >
                  <div className="flex items-center justify-center gap-3 text-sm md:text-base">
                    <ReceiptText className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">
                      {t("payments.order_id")}:
                    </span>
                    <span className="font-semibold break-all">
                      {finalOrderId}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
                >
                  <button
                    onClick={() => navigate(`/Activity/MyTradeRequest`)}
                    className="capitalize inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    <ReceiptText className="h-4 w-4" />
                    {t("payments.see_details")}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="capitalize inline-flex items-center justify-center gap-2 rounded-2xl border bg-background px-6 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {t("payments.continue_browsing")}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
