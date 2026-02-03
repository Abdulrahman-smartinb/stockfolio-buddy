import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "@/store/api/authApi";
import { useTranslation } from "react-i18next";
import COUNTRIES from "@/data/countries.json";

type AuthMode = "login" | "register";

const normalizeDigits = (value: string) => value.replace(/\D/g, "");

const buildE164Phone = (dialCode: string, localPhone: string) => {
  const d = dialCode.startsWith("+") ? dialCode : `+${dialCode}`;
  const p = normalizeDigits(localPhone);
  return `${d}${p}`;
};

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showWarn, setShowWarn] = useState(false);
  const [showLengthError, setShowLengthError] = useState(false);

  const defaultCountry = COUNTRIES[0]; // Syria default
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: defaultCountry.code,
    dialCode: defaultCountry.dialCode,
    password: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken")),
  );

  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("profile") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [loginApi, { isLoading: loginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: registerLoading }] = useRegisterMutation();
  const [logoutApi] = useLogoutMutation();

  const isLoading = loginLoading || registerLoading;

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === formData.country) || defaultCountry,
    [formData.country],
  );

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (!country) return;

    setFormData((prev) => ({
      ...prev,
      country: country.code,
      dialCode: country.dialCode,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = normalizeDigits(rawValue);

    setFormData((prev) => ({
      ...prev,
      phone: numericValue,
    }));

    setShowWarn(rawValue !== numericValue);

    const length = numericValue.length;
    const MIN_LENGTH = 6;
    const MAX_LENGTH = 14;

    setShowLengthError(
      length > 0 && (length < MIN_LENGTH || length > MAX_LENGTH),
    );
  };

  const validate = () => {
    let valid = true;

    const localPhone = normalizeDigits(formData.phone);
    if (localPhone.length < 6) {
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
      if (formData.fullName?.trim().length < 2) {
        toast({
          title: t("enter_valid_name"),
          variant: "destructive",
          description: t("valid_name"),
        });
        valid = false;
      }
      if (!formData.country) {
        toast({
          title: t("auth_failed"),
          variant: "destructive",
          description: t("pls_select"),
        });
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fullPhone = buildE164Phone(formData.dialCode, formData.phone);

    try {
      const response =
        mode === "login"
          ? await loginApi({
              phone: fullPhone,
              password: formData.password,
            }).unwrap()
          : await registerApi({
              fullName: formData.fullName,
              phone: fullPhone,
              country: formData.country,
              password: formData.password,
            }).unwrap();

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("profile", JSON.stringify(response.profile));
      localStorage.setItem("role", response.role);

      setIsAuthenticated(true);

      toast({
        title: mode === "login" ? t("welcome") : t("account_created"),
        description: t("signed_in"),
        duration: 1000,
      });

      navigate("/");
    } catch (error: any) {
      const message = error?.data?.message;
      if (message === "Already logged in") {
        toast({
          variant: "destructive",
          title: t("already_logged_in"),
          description: t("pls_logout"),
          duration: 10000,
        });
      } else {
        toast({
          variant: "destructive",
          title: t("auth_failed"),
          description: error?.data?.message || t("check_credits"),
        });
      }
    }
  };

  const logout = async () => {
    try {
      await logoutApi(profile?.authUserId).unwrap();
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/auth");
    }
  };

  return {
    // ui state
    mode,
    setMode,
    showPassword,
    setShowPassword,
    showWarn,
    showLengthError,

    // data
    formData,
    setFormData,
    isLoading,
    isAuthenticated,

    // country support
    COUNTRIES,
    selectedCountry,
    handleCountryChange,

    // actions
    handleSubmit,
    logout,
    handlePhoneNumberChange,
  };
};
