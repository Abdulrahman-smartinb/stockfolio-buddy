import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
import { companyId } from "@/api/GlobalData";
import { useTranslation } from "react-i18next";

type AuthMode = "login" | "register";

export const useAuth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showWarn, setShowWarn] = useState(false);
  const [showLengthError, setShowLengthError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginApi, { isLoading: loginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: registerLoading }] = useRegisterMutation();
  const [logoutApi] = useLogoutMutation();

  const isLoading = loginLoading || registerLoading;

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const numericValue = rawValue.replace(/[^0-9]/g, "");

    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumber: numericValue,
    }));

    if (rawValue !== numericValue) {
      setShowWarn(true);
    } else {
      setShowWarn(false);
    }

    const length = numericValue.length;
    const MIN_LENGTH = 10;
    const MAX_LENGTH = 14;

    if (length > 0 && (length < MIN_LENGTH || length > MAX_LENGTH)) {
      setShowLengthError(true);
    } else {
      setShowLengthError(false);
    }
  };

  const validate = () => {
    let valid = true;
    if (formData.phoneNumber?.length < 7) {
      toast({
        title: t("enter_valid_phone"),
        variant: "destructive",
        description: t("valid_phone"),
      });
      valid = false;
    }
    if (formData.password?.length < 6) {
      toast({
        title: t("enter_valid_pass"),
        variant: "destructive",
        description: t("valid_pass"),
      });
      valid = false;
    }
    if (showLengthError) {
      toast({
        title: t("enter_valid_phone"),
        variant: "destructive",
        description: t("valid_phone"),
      });
      valid = false;
    }
    if (showWarn) {
      toast({
        title: t("enter_valid_phone"),
        variant: "destructive",
        description: t("only_numbers"),
      });
      valid = false;
    }
    if (mode === "register") {
      if (formData.fullName?.length < 2) {
        toast({
          title: t("enter_valid_name"),
          variant: "destructive",
          description: t("valid_name"),
        });
        valid = false;
      }
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response =
        mode === "login"
          ? await loginApi({
              phoneNumber: formData.phoneNumber,
              password: formData.password,
            }).unwrap()
          : await registerApi({
              fullName: formData.fullName,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
              companyId: companyId,
            }).unwrap();

      // ✅ Save auth data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setIsAuthenticated(true);

      toast({
        title: mode === "login" ? t("welcome") : t("account_created"),
        description: `${t("signed_in_as")} ${response.user.fullName}`,
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("auth_failed"),
        description: error?.data?.message || t("check_credits"),
      });
    }
  };

  const logout = async () => {
    await logoutApi().unwrap();
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/auth");
  };

  return {
    mode,
    setMode,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    isLoading,
    handleSubmit,
    isAuthenticated,
    logout,
    handlePhoneNumberChange,
    showWarn,
    showLengthError,
  };
};
