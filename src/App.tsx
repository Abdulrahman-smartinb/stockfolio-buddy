import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import InvestorActivity from "./pages/InvestorActivity";
import MyShares from "./pages/Activity/MyShares";
import MyTransactions from "./pages/Activity/MyTransactions";
import MyTradeRequest from "./pages/Activity/MyTradeRequest";
import MyFundTransactions from "./pages/Activity/MyFundTransactions";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FundDetails from "./pages/FundDetails";
import "./App.css";
import { SessionExpiredModal } from "./components/SessionExpireModal";
import { PaymentComplete } from "./pages/PaymentComplete";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CompanyDetails from "./pages/CompanyDetails";
import { AppInstallPrompt } from "./components/AppInstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInstallPrompt />
            <SessionExpiredModal />
            <Routes>
              <Route path="/auth" element={<Auth />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/investorActivity"
                  element={<InvestorActivity />}
                />
                <Route path="/Activity/MyShares" element={<MyShares />} />
                <Route
                  path="/Activity/MyShares/:id"
                  element={<MyFundTransactions />}
                />
                <Route
                  path="/Activity/MyTransactions"
                  element={<MyTransactions />}
                />
                <Route
                  path="/Activity/MyTradeRequest"
                  element={<MyTradeRequest />}
                />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/fund-details/:id" element={<FundDetails />} />
                <Route
                  path="/company-details/:id"
                  element={<CompanyDetails />}
                />
                <Route
                  path="/project-details/:id"
                  element={<ProjectDetailsPage />}
                />
                <Route
                  path="/payment-complete/:orderId"
                  element={<PaymentComplete />}
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
