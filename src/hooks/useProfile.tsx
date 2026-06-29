import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";
import { useResolvedRole } from "./useResolveRole";
import Cookies from "js-cookie";

import {
  useGetOneInvestorQuery,
  useUpdateInvestorMutation,
} from "@/store/api/investorApi";
import {
  useGetOneApplicantQuery,
  useUpdateApplicantProfileMutation,
} from "@/store/api/applicantApi";
import {
  useSendEmailVerificationMutation,
  useVerifyEmailMutation,
} from "@/store/api/authApi";

import { compressImage } from "@/lib/utils";
import { UserData } from "@/interfaces/UserData";
import COUNTRIES from "@/data/countries.json";
import {
  findCityByValue,
  findCountryByValue,
} from "@/lib/countryCityUtils";

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() || "";

export const useProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<UserData>();
  const [openVerify, setOpenVerify] = useState(false);
  const [openInstructions, setOpenInstructions] = useState(false);

  // Resolve role
  const { resolvedRole, loadingRole, fetchingRole, refetchRole } =
    useResolvedRole();

  const isInvestor = !!resolvedRole?.isInvestor;
  const isApplicant = !!resolvedRole?.isApplicant;
  const role = resolvedRole?.role;
  const reviewStatus = resolvedRole?.reviewStatus;
  const profileId = resolvedRole?.profileId;

  // Queries
  const {
    data: applicant,
    isLoading: isLoadingApplicant,
    refetch: refetchApplicant,
    isFetching: isFetchingApplicant,
  } = useGetOneApplicantQuery(
    { id: profileId },
    { skip: !isApplicant || !profileId },
  );

  const {
    data: investor,
    isLoading: isLoadingInvestor,
    refetch: refetchInvestor,
    isFetching: isFetchingInvestor,
  } = useGetOneInvestorQuery(
    { id: profileId },
    { skip: !isInvestor || !profileId },
  );

  // Load correct profile
  useEffect(() => {
    if (isInvestor && investor?.data) setUser(investor.data);
    if (isApplicant && applicant?.data) {
      setUser(applicant.data);
    }
  }, [isInvestor, isApplicant, investor?.data, applicant?.data]);

  // Mutations
  const [updateInvestor, { isLoading: isSaving }] = useUpdateInvestorMutation();
  const [sendEmailVerification, { isLoading: isSendingEmailCode }] =
    useSendEmailVerificationMutation();
  const [verifyEmailMutation, { isLoading: isVerifyingEmail }] =
    useVerifyEmailMutation();

  const [submit, { isLoading: isSubmitting, error: submitError }] =
    useUpdateApplicantProfileMutation();

  // Edit state
  const [editData, setEditData] = useState({
    fullName: "",
    birthDate: "",
    phone: "",
    secondaryPhone: "",
    countryCode: "SY",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profileImageFile: null as File | null,
    profilePreview: "",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const isEmailChanged = (nextEmail?: string) =>
    normalizeEmail(nextEmail) !== normalizeEmail(user?.email);

  const isEmailVerified = (nextEmail?: string) =>
    !isEmailChanged(nextEmail) ||
    normalizeEmail(nextEmail) === normalizeEmail(verifiedEmail);

  const sendVerificationCode = async (targetEmail: string) => {
    const normalized = normalizeEmail(targetEmail);

    if (!normalized || !normalized.includes("@")) {
      toast({
        title: t("auth.errors.invalid_email"),
        description: t("auth.errors.invalid_email_desc"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await sendEmailVerification({ email: normalized }).unwrap();
      setEmailOtp("");
      setVerifiedEmail(response?.verificationRequired ? "" : normalized);
      toast({
        title: response?.verificationRequired
          ? t("auth.success.code_sent")
          : t("profile.email_verified"),
        description: response?.message || t("auth.success.check_email"),
      });
    } catch (error: any) {
      toast({
        title: t("profile.email_verification_failed"),
        description: error?.data?.message,
        variant: "destructive",
      });
    }
  };

  const verifyEmailCode = async (targetEmail: string) => {
    const normalized = normalizeEmail(targetEmail);

    if (!emailOtp.trim()) {
      toast({
        title: t("auth.verification_code"),
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyEmailMutation({
        email: normalized,
        otp: emailOtp.trim(),
      }).unwrap();

      setVerifiedEmail(normalized);
      setEmailOtp("");

      toast({
        title: t("profile.email_verified"),
        description: t("profile.email_verified_desc"),
      });
    } catch (error: any) {
      toast({
        title: t("profile.email_verification_failed"),
        description: error?.data?.message,
        variant: "destructive",
      });
    }
  };

  // Split E.164 phone when loading user
  useEffect(() => {
    if (!user) return;

    let detectedCountry = COUNTRIES.find((c) =>
      user.phone?.startsWith(c.dialCode),
    );

    let localPhone = user.phone || "";
    let localSecondaryPhone = user.secondaryPhone || "";
    const normalizedCountry = findCountryByValue(user.country);
    const normalizedCity = findCityByValue(user.country, user.city);

    if (detectedCountry) {
      localPhone = user.phone.replace(detectedCountry.dialCode, "");
      localSecondaryPhone = localSecondaryPhone.replace(
        detectedCountry.dialCode,
        "",
      );
    }

    setEditData({
      fullName: user.fullName ?? "",
      birthDate: user.birthDate ?? "",
      phone: localPhone,
      secondaryPhone: localSecondaryPhone,
      countryCode: detectedCountry?.code || user.countryCode || "SY",
      email: user.email ?? "",
      country: normalizedCountry?.name || user?.country || "",
      address: user?.address ?? "",
      city: normalizedCity?.name || user?.city || "",
      state: user?.state ?? "",
      zipCode: user?.zipCode ?? "",
      profileImageFile: null,
      profilePreview: user.profileImage ? String(user.profileImage) : "",
    });
  }, [user]);

  // Redirect if not auth
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  // Image handler
  const handleProfileImageChange = (file?: File) => {
    if (!file) return;

    setEditData((prev) => ({
      ...prev,
      profileImageFile: file,
      profilePreview: URL.createObjectURL(file),
    }));
  };

  // SAVE PROFILE
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const formData = new FormData();

      // Basic fields
      if (editData.fullName !== user.fullName)
        formData.append("fullName", editData.fullName);

      if (editData.birthDate) formData.append("birthDate", editData.birthDate);

      if (editData.email) formData.append("email", editData.email);

      if (isEmailChanged(editData.email) && !isEmailVerified(editData.email)) {
        toast({
          title: t("profile.email_verification_required"),
          description: t("profile.email_verification_required_desc"),
          variant: "destructive",
        });
        return;
      }

      if (editData.country) formData.append("country", editData.country);
      if (editData.address) formData.append("address", editData.address);
      if (editData.city) formData.append("city", editData.city);
      if (editData.state) formData.append("state", editData.state);
      if (editData.zipCode) formData.append("zipCode", editData.zipCode);

      if (editData.profileImageFile)
        formData.append("profileImage", editData.profileImageFile);

      // Recombine phone with country code
      if (editData.phone && editData.countryCode) {
        const selectedCountry = COUNTRIES.find(
          (c) => c.code === editData.countryCode,
        );

        if (selectedCountry) {
          const fullPhone = `${selectedCountry.dialCode}${editData.phone}`;

          formData.append("phone", fullPhone);
          formData.append("countryCode", editData.countryCode);

          if (editData.secondaryPhone) {
            formData.append(
              "secondaryPhone",
              `${selectedCountry.dialCode}${editData.secondaryPhone}`,
            );
          }
        }
      }

      if (role) formData.append("role", role);
      const response = await updateInvestor({
        id: user.authUserId,
        data: formData,
      }).unwrap();

      if (response?.data) {
        setUser(response.data);
        Cookies.set("profile", JSON.stringify(response.data), { expires: 1 });
      }

      if (isApplicant) refetchApplicant();
      else refetchInvestor();

      toast({
        title: t("profile.update_success"),
        description: t("profile.info_updated"),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("profile.update_failed"),
        variant: "destructive",
        description: t("profile.error_while_updating"),
      });
    }
  };

  // VERIFY SUBMIT
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoBack, setIdPhotoBack] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<any>(null);
  const [livePhotoPreview, setLivePhotoPreview] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpDate, setPassportExpDate] = useState<any>();
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const [idPhotoBackPreview, setIdPhotoBackPreview] = useState<string | null>(
    null,
  );
  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (disableSubmit) {
      toast({
        title: t("auth.errors.fill_all"),
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      const formData = new FormData();

      if (idPhoto instanceof File) {
        const compressedId = await compressImage(idPhoto);
        formData.append("idPhoto", compressedId);
      }

      if (idPhotoBack instanceof File) {
        const compressedIdBack = await compressImage(idPhotoBack);
        formData.append("idPhotoBack", compressedIdBack);
      }

      if (livePhoto instanceof File) {
        const compressedLive = await compressImage(livePhoto);
        formData.append("livePhoto", compressedLive);
      }

      if (passportImage instanceof File) {
        const compressedPassport = await compressImage(passportImage);
        formData.append("passportImage", compressedPassport);
      }
      formData.append("passportNumber", passportNumber);
      formData.append("passportExpDate", passportExpDate);
      if (isEmailChanged(email) && !isEmailVerified(email)) {
        toast({
          title: t("profile.email_verification_required"),
          description: t("profile.email_verification_required_desc"),
          variant: "destructive",
        });
        return;
      }

      formData.append("email", email);
      formData.append("idNumber", idNumber);
      formData.append("reviewStatus", "pending");

      const response = await submit({
        id: user.authUserId,
        data: formData,
      }).unwrap();

      if (response?.data) {
        setUser(response.data);
        Cookies.set("profile", JSON.stringify(response.data), { expires: 1 });
      }

      handleClose();

      toast({
        title: t("profile.request_sent"),
        description: t("profile.profile_verify_request"),
      });
      refetchRole();
    } catch (error) {
      console.error(submitError || error);
      toast({
        title: t("profile.request_failed"),
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    setOpenVerify(false);
    setIdNumber("");
    setPassportNumber("");
    setIdPhoto(null);
    setIdPhotoBack(null);
    setLivePhoto(null);
    setLivePhotoPreview(null);
    setEmailOtp("");
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return {
    loadingUser: loadingRole || isLoadingApplicant || isLoadingInvestor,
    isFetching: isFetchingApplicant || isFetchingInvestor || fetchingRole,

    user,

    editData,
    setEditData,

    handleProfileImageChange,
    handleSaveProfile,

    openVerify,
    setOpenVerify,

    handleSubmit,
    handleClose,

    isSaving,
    isSubmitting,

    idPhoto,
    setIdPhoto,
    idPhotoBack,
    setIdPhotoBack,
    livePhoto,
    setLivePhoto,
    livePhotoPreview,
    setLivePhotoPreview,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    passportExpDate,
    setPassportExpDate,
    email,
    setEmail,
    openInstructions,
    setOpenInstructions,
    idPhotoPreview,
    setIdPhotoPreview,
    idPhotoBackPreview,
    setIdPhotoBackPreview,

    role,
    refetchRole,
    isInvestor,
    isApplicant,
    reviewStatus,

    containerVariants,
    itemVariants,
    passportImage,
    setPassportImage,
    setPassportPreview,
    passportPreview,
    disableSubmit,
    setDisableSubmit,
    emailOtp,
    setEmailOtp,
    verifiedEmail,
    isEmailChanged,
    isEmailVerified,
    sendVerificationCode,
    verifyEmailCode,
    isSendingEmailCode,
    isVerifyingEmail,
  };
};
