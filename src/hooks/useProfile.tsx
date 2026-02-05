import { useEffect, useMemo, useState } from "react";
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
import { useGetInvestorPurchaseRequestsQuery } from "@/store/api/stocksApi";

import { compressImage } from "@/lib/utils";
import { UserData } from "@/interfaces/UserData";

export const useProfile = () => {
  // =========================
  // Core
  // =========================
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<UserData>();

  const [isEditing, setIsEditing] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  // Verification / files
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [livePhotoPreview, setLivePhotoPreview] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpDate, setPassportExpDate] = useState();

  // =========================
  // Resolve role (single source of truth)
  // =========================
  const { resolvedRole, loadingRole, refetchRole } = useResolvedRole();

  const isInvestor = !!resolvedRole?.isInvestor;
  const isApplicant = !!resolvedRole?.isApplicant;
  const role = resolvedRole?.role;
  const reviewStatus = resolvedRole?.reviewStatus;
  const profileId = resolvedRole?.profileId;

  // =========================
  // Queries: fetch profile data
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

  // Pick correct user model
  useEffect(() => {
    if (isInvestor && investor?.data) setUser(investor.data);
    if (isApplicant && applicant?.data) setUser(applicant.data);
  }, [isInvestor, isApplicant, investor?.data, applicant?.data]);

  // =========================
  // Queries: requests (only for investor)
  // =========================
  const {
    data: purchaseRequests,
    isLoading: loadingRequests,
    refetch: refetchRequests,
  } = useGetInvestorPurchaseRequestsQuery(user?._id, {
    skip: !user?._id || !isInvestor,
  });

  // =========================
  // Mutations
  // =========================
  const [updateInvestor, { isLoading: isSaving }] = useUpdateInvestorMutation();
  const [submit, { isLoading: isSubmitting, error: submitError }] =
    useUpdateApplicantProfileMutation();

  // =========================
  // Edit form state (derived from user)
  // =========================
  const [editData, setEditData] = useState({
    fullName: "",
    birthDate: "",
    phone: "",
    email: "",
    profileImageFile: null as File | null,
    profilePreview: "",
  });

  useEffect(() => {
    if (!user) return;

    setEditData({
      fullName: user.fullName ?? "",
      birthDate: user.birthDate ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
      profileImageFile: null,
      profilePreview: user.profileImage ? String(user.profileImage) : "",
    });
  }, [user]);

  // =========================
  // Auth redirect
  // =========================
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  // =========================
  // Handlers
  // =========================
  const handleProfileImageChange = (file?: File) => {
    if (!file) return;
    setEditData((prev) => ({
      ...prev,
      profileImageFile: file,
      profilePreview: URL.createObjectURL(file),
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const formData = new FormData();

      if (editData.fullName !== user.fullName)
        formData.append("fullName", editData.fullName);
      if (editData.birthDate) formData.append("birthDate", editData.birthDate);
      if (editData.profileImageFile)
        formData.append("profileImage", editData.profileImageFile);
      if (editData.phone) formData.append("phone", editData.phone);
      if (editData.email) formData.append("email", editData.email);

      // keep your backend behavior
      if (role) formData.append("role", role);

      await updateInvestor({ id: user.authUserId, data: formData }).unwrap();

      if (isApplicant) refetchApplicant();
      else refetchInvestor();

      setIsEditing(false);
      toast({
        title: t("update_success"),
        variant: "default",
        description: t("info_updated"),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("update_failed"),
        variant: "destructive",
        description: t("error_while_updating"),
        duration: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    console.log("here");
    if (
      !idPhoto ||
      !livePhoto ||
      (!idNumber && (!passportNumber || !passportExpDate))
    ) {
      toast({ title: t("fill_all"), variant: "destructive", duration: 3000 });
      return;
    }

    try {
      const formData = new FormData();

      const compressedIdPhoto = await compressImage(idPhoto);
      const compressedLivePhoto = await compressImage(livePhoto);

      formData.append("idPhoto", compressedIdPhoto);
      formData.append("livePhoto", compressedLivePhoto);

      formData.append("passportNumber", passportNumber);
      if (passportNumber?.trim()?.length > 0)
        formData.append("passportExpDate", passportExpDate);

      formData.append("email", email);
      formData.append("idNumber", idNumber);
      formData.append("reviewStatus", "pending");

      await submit({ id: user.authUserId, data: formData }).unwrap();

      handleClose();
      toast({
        title: t("request_sent"),
        variant: "default",
        description: t("profile_verify_request"),
      });
    } catch (error) {
      console.error(submitError || error);
      toast({
        title: t("request_failed"),
        variant: "destructive",
        description: t("error_while_saving"),
        duration: 3000,
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
  // Animations (kept)
  // =========================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // =========================
  // Return
  // =========================
  return {
    // loading
    loadingUser: loadingRole || isLoadingApplicant || isLoadingInvestor,

    // data
    user,
    purchaseRequests,

    // ui state
    isEditing,
    setIsEditing,
    openVerify,
    setOpenVerify,

    // form state
    editData,
    setEditData,

    // handlers
    handleProfileImageChange,
    handleSaveProfile,
    handleSubmit,
    handleClose,

    // statuses
    isSaving,
    isSubmitting,
    loadingRequests,
    refetchRequests,

    // verify inputs
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

    // role (single source of truth)
    role,
    refetchRole,
    isInvestor,
    isApplicant,
    reviewStatus,

    containerVariants,
    itemVariants,
  };
};
