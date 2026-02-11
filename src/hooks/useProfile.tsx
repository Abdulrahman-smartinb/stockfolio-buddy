import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";
import { useResolvedRole } from "./useResolveRole";

import {
  useGetOneInvestorQuery,
  useUpdateInvestorMutation,
} from "@/store/api/investorApi";
import {
  useGetOneApplicantQuery,
  useUpdateApplicantProfileMutation,
} from "@/store/api/applicantApi";

import { compressImage } from "@/lib/utils";
import { UserData } from "@/interfaces/UserData";
import COUNTRIES from "@/data/countries.json";

export const useProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<UserData>();
  const [openVerify, setOpenVerify] = useState(false);

  // =========================
  // Resolve role
  // =========================
  const { resolvedRole, loadingRole, refetchRole } = useResolvedRole();

  const isInvestor = !!resolvedRole?.isInvestor;
  const isApplicant = !!resolvedRole?.isApplicant;
  const role = resolvedRole?.role;
  const reviewStatus = resolvedRole?.reviewStatus;
  const profileId = resolvedRole?.profileId;
  console.log(resolvedRole);
  // =========================
  // Queries
  // =========================
  const {
    data: applicant,
    isLoading: isLoadingApplicant,
    refetch: refetchApplicant,
  } = useGetOneApplicantQuery(
    { id: profileId },
    { skip: !isApplicant || !profileId },
  );

  const {
    data: investor,
    isLoading: isLoadingInvestor,
    refetch: refetchInvestor,
  } = useGetOneInvestorQuery(
    { id: profileId },
    { skip: !isInvestor || !profileId },
  );

  // Load correct profile
  useEffect(() => {
    if (isInvestor && investor?.data) setUser(investor.data);
    if (isApplicant && applicant?.data) setUser(applicant.data);
  }, [isInvestor, isApplicant, investor?.data, applicant?.data]);

  // =========================
  // Mutations
  // =========================
  const [updateInvestor, { isLoading: isSaving }] = useUpdateInvestorMutation();

  const [submit, { isLoading: isSubmitting, error: submitError }] =
    useUpdateApplicantProfileMutation();

  // =========================
  // Edit state
  // =========================
  const [editData, setEditData] = useState({
    fullName: "",
    birthDate: "",
    phone: "",
    countryCode: "SY",
    email: "",
    profileImageFile: null as File | null,
    profilePreview: "",
  });

  // Split E.164 phone when loading user
  useEffect(() => {
    if (!user) return;

    let detectedCountry = COUNTRIES.find((c) =>
      user.phone?.startsWith(c.dialCode),
    );

    let localPhone = user.phone || "";

    if (detectedCountry) {
      localPhone = user.phone.replace(detectedCountry.dialCode, "");
    }

    setEditData({
      fullName: user.fullName ?? "",
      birthDate: user.birthDate ?? "",
      phone: localPhone,
      countryCode: detectedCountry?.code || user.countryCode || "SY",
      email: user.email ?? "",
      profileImageFile: null,
      profilePreview: user.profileImage ? String(user.profileImage) : "",
    });
  }, [user]);

  // =========================
  // Redirect if not auth
  // =========================
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  // =========================
  // Image handler
  // =========================
  const handleProfileImageChange = (file?: File) => {
    if (!file) return;

    setEditData((prev) => ({
      ...prev,
      profileImageFile: file,
      profilePreview: URL.createObjectURL(file),
    }));
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const formData = new FormData();

      // Basic fields
      if (editData.fullName !== user.fullName)
        formData.append("fullName", editData.fullName);

      if (editData.birthDate) formData.append("birthDate", editData.birthDate);

      if (editData.email) formData.append("email", editData.email);

      if (editData.profileImageFile)
        formData.append("profileImage", editData.profileImageFile);

      // 🔥 Recombine E.164 phone
      if (editData.phone && editData.countryCode) {
        const selectedCountry = COUNTRIES.find(
          (c) => c.code === editData.countryCode,
        );

        if (selectedCountry) {
          const fullPhone = `${selectedCountry.dialCode}${editData.phone}`;

          formData.append("phone", fullPhone);
          formData.append("countryCode", editData.countryCode);
        }
      }

      if (role) formData.append("role", role);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      await updateInvestor({
        id: user.authUserId,
        data: formData,
      }).unwrap();

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

  // =========================
  // VERIFY SUBMIT
  // =========================
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [livePhotoPreview, setLivePhotoPreview] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpDate, setPassportExpDate] = useState<any>();

  const handleSubmit = async () => {
    if (!user) return;

    if (
      !idPhoto ||
      !livePhoto ||
      (!idNumber && (!passportNumber || !passportExpDate))
    ) {
      toast({
        title: t("auth.errors.fill_all"),
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();

      const compressedId = await compressImage(idPhoto);
      const compressedLive = await compressImage(livePhoto);

      formData.append("idPhoto", compressedId);
      formData.append("livePhoto", compressedLive);
      formData.append("passportNumber", passportNumber);
      formData.append("passportExpDate", passportExpDate);
      formData.append("email", email);
      formData.append("idNumber", idNumber);
      formData.append("reviewStatus", "pending");

      await submit({
        id: user.authUserId,
        data: formData,
      }).unwrap();

      handleClose();

      toast({
        title: t("profile.request_sent"),
        description: t("profile.profile_verify_request"),
      });
    } catch (error) {
      console.error(submitError || error);
      toast({
        title: t("profile.request_failed"),
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpenVerify(false);
    setIdNumber("");
    setPassportNumber("");
    setIdPhoto(null);
    setLivePhoto(null);
    setLivePhotoPreview(null);
  };

  // =========================
  // Animations
  // =========================
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

    role,
    refetchRole,
    isInvestor,
    isApplicant,
    reviewStatus,

    containerVariants,
    itemVariants,
  };
};
