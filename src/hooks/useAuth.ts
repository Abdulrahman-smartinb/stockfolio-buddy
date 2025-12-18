import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi";
import { companyId } from "@/api/GlobalData";

type AuthMode = "login" | "register";

export const useAuth = () => {
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
        title: "Please enter a valid phone number",
        variant: "destructive",
        description: "A valid phone number must be longer than 7 digits",
      });
      valid = false;
    }
    if (formData.password?.length < 6) {
      toast({
        title: "Please enter a valid password",
        variant: "destructive",
        description: "A valid password must be longer than 6 charachters",
      });
      valid = false;
    }
    if (showLengthError) {
      toast({
        title: "Please enter a valid phone number",
        variant: "destructive",
        description:
          "A valid phone number must be between 10 and 14 digits, including country code",
      });
      valid = false;
    }
    if (showWarn) {
      toast({
        title: "Please enter a valid phone number",
        variant: "destructive",
        description: "Only numbers are allowed",
      });
      valid = false;
    }
    if (mode === "register") {
      if (formData.fullName?.length < 2) {
        toast({
          title: "Please enter a valid name",
          variant: "destructive",
          description: "A valid name must be longer than 2 charachters",
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
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description: `Signed in as ${response.user.fullName}`,
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description:
          error?.data?.message ||
          "Please check your credentials and try again.",
      });
    }
  };

  const logout = () => {
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
