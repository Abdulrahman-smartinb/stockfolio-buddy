import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyPinMutation,
} from "@/store/api/authApi";
import { useTranslation } from "react-i18next";
import COUNTRIES from "@/data/countries.json";
import Cookies from "js-cookie";

type AuthMode = "login" | "register";

const normalizeDigits = (value: string) => value.replace(/\D/g, "");

const buildE164Phone = (dialCode: string, localPhone: string) => {
  const d = dialCode.startsWith("+") ? dialCode : `+${dialCode}`;
  const p = normalizeDigits(localPhone);
  return `${d}${p}`;
};

type LoginChallenge = {
  userId: string;
  challengeId: string;
};

export const useAuth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showWarn, setShowWarn] = useState(false);
  const [showLengthError, setShowLengthError] = useState(false);
  const [isPinRequired, setIsPinRequired] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [approveTerms, setApproveTerms] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [termsError, setTermsError] = useState(false);

  // Login challenge state for investor
  const [loginChallenge, setLoginChallenge] = useState<LoginChallenge | null>(
    null
  );

  const defaultCountry = COUNTRIES[0];
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: defaultCountry.code,
    dialCode: defaultCountry.dialCode,
    password: "",
    pinCode: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(Cookies.get("authToken"))
  );

  const profile = useMemo(() => {
    try {
      return JSON.parse(Cookies.get("profile") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [loginApi, { isLoading: loginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: registerLoading }] = useRegisterMutation();
  const [verifyApi, { isLoading: verifyPinLoading }] = useVerifyPinMutation();
  const [logoutApi] = useLogoutMutation();

  const isLoading = loginLoading || registerLoading || verifyPinLoading;

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === formData.country) || defaultCountry,
    [formData.country]
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
    setShowLengthError(length > 0 && (length < 6 || length > 14));
  };

  const validate = () => {
    let valid = true;

    if (formData.phone.length < 6) {
      toast({
        title: t("auth.errors.enter_valid_phone"),
        variant: "destructive",
        description: t("auth.errors.valid_phone"),
      });
      valid = false;
    }

    if (formData.pinCode.length < 6) {
      toast({
        title: t("auth.errors.enter_valid_pin"),
        variant: "destructive",
        description: t("auth.errors.valid_pin"),
      });
      valid = false;
    }

    if (mode === "register" && formData.password.trim().length < 8) {
      toast({
        title: t("auth.errors.enter_valid_pass"),
        variant: "destructive",
        description: t("auth.errors.valid_pass"),
      });
      valid = false;
    }

    if (showWarn || showLengthError) valid = false;

    if (mode === "register" && formData.fullName.trim().length < 2) {
      toast({
        title: t("auth.errors.enter_valid_name"),
        variant: "destructive",
        description: t("auth.errors.valid_name"),
      });
      valid = false;
    }

    return valid;
  };

  const finalizeLogin = (response) => {
    Cookies.set("authToken", response.token, { expires: 1 });
    Cookies.set("profile", JSON.stringify(response.profile), { expires: 1 });
    setIsAuthenticated(true);

    toast({
      title: t("auth.success.welcome_back"),
      description: t("auth.success.signed_in"),
    });

    navigate("/");
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
              pinCode: formData.pinCode,
            }).unwrap()
          : await registerApi({
              fullName: formData.fullName,
              phone: fullPhone,
              country: formData.country,
              pinCode: formData.pinCode,
              password: formData.password,
            }).unwrap();

      // Investor wait for PIN
      // if (response.requiresPin) {
      //   setLoginChallenge({
      //     userId: response.userId,
      //     challengeId: response.challengeId,
      //   });
      //   setIsPinRequired(true);
      //   return;
      // }

      // Applicant
      finalizeLogin(response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("auth.errors.auth_failed"),
        description: t("auth.errors.check_credits") || error?.data?.message,
        duration: 5000,
      });
    }
  };

  // PIN verification
  const verifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginChallenge) return;

    try {
      const response = await verifyApi({
        userId: loginChallenge.userId,
        challengeId: loginChallenge.challengeId,
        pin: pinCode,
      }).unwrap();

      setIsPinRequired(false);
      setLoginChallenge(null);
      setPinCode("");

      finalizeLogin(response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("auth.errors.verification_failed"),
        description: error?.data?.message || t("auth.errors.code_failed"),
        duration: 5000,
      });
    }
  };

  const logout = async () => {
    try {
      await logoutApi(profile?.authUserId).unwrap();
    } finally {
      Cookies.remove("authToken", { path: "/" });
      Cookies.remove("profile", { path: "/" });
      setIsAuthenticated(false);
      navigate("/auth");
    }
  };

  return {
    // ui
    mode,
    setMode,
    showPassword,
    setShowPassword,
    showWarn,
    showLengthError,
    isPinRequired,
    showPin,
    setShowPin,

    // data
    formData,
    setFormData,
    pinCode,
    setPinCode,
    isAuthenticated,
    isLoading,

    // country
    COUNTRIES,
    selectedCountry,
    handleCountryChange,
    handlePhoneNumberChange,

    // actions
    handleSubmit,
    verifyPin,
    logout,

    // terms
    openTerms,
    setOpenTerms,
    approveTerms,
    setApproveTerms,
    termsError,
    setTermsError,
  };
};
