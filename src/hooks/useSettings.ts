import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useGetCompanyInfoQuery } from "@/store/api/companyInfoApi";

const useSettings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openPaymentMethods, setOpenPaymentMethods] = useState(false);

  const isRtl = i18n.language === "ar";

  const { data, isLoading } = useGetCompanyInfoQuery(null);
  console.log(`data`, data?.paymentMethods);

  return {
    t,
    i18n,
    navigate,
    logout,
    isRtl,
    openPaymentMethods,
    setOpenPaymentMethods,
    data: data?.paymentMethods,
  };
};

export default useSettings;
