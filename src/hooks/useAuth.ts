import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
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
    phone: "905384171534",
    password: "000000",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken")),
  );

  const userData = JSON.parse(localStorage.getItem("user") || "{}");

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
      phone: numericValue,
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
    if (formData.phone?.length < 7) {
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
              phone: formData.phone,
              password: formData.password,
            }).unwrap()
          : await registerApi({
              fullName: formData.fullName,
              phone: formData.phone,
              password: formData.password,
            }).unwrap();

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("profile", JSON.stringify(response.profile));
      localStorage.setItem("role", JSON.stringify(response.role));
      setIsAuthenticated(true);

      toast({
        title: mode === "login" ? t("welcome") : t("account_created"),
        description: t("signed_in"),
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
    await logoutApi(userData?._id).unwrap();
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
