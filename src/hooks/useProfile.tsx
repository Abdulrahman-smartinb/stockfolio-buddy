import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";
import {
  useGetInvestorPurchaseRequestsQuery,
  useGetPurchaseHistoryQuery,
} from "@/store/api/stocksApi";
import {
  useGetOneInvestorQuery,
  useUpdateInvestorMutation,
} from "@/store/api/investorApi";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { UserData } from "@/interfaces/UserData";
import {
  useGetOneApplicantQuery,
  useUpdateApplicantProfileMutation,
} from "@/store/api/applicantApi";

export const useProfile = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const role = JSON.parse(localStorage.getItem("role") || "");
  const authUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [user, setUser] = useState<UserData>();

  const [openVerify, setOpenVerify] = useState(false);
  const [idPhoto, setIdPhoto] = useState<File | null>();
  const [livePhoto, setLivePhoto] = useState<File | null>();
  const [livePhotoPreview, setLivePhotoPreview] = useState<any>();
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");

  const { data: applicant, isLoading: isLoadingUser } = useGetOneApplicantQuery(
    { id: authUser?._id },
    { skip: role === "investor" },
  );
  const { data: investor, isLoading: isLoadingInvestor } =
    useGetOneInvestorQuery(
      { id: authUser?._id },
      { skip: role === "applicant" },
    );

  useEffect(() => {
    if (role === "investor") {
      setUser(investor?.data);
    } else if (role === "applicant") {
      setUser(applicant?.data);
    }
  }, [applicant, investor]);

  const { data: purchaseHistory, isLoading } = useGetPurchaseHistoryQuery({
    id: user?._id,
    page,
    limit,
  });

  const { data: purchaseRequests, isLoading: loadingRequests } =
    useGetInvestorPurchaseRequestsQuery(user?._id);
  const [updateInvestor, { isLoading: isSaving }] = useUpdateInvestorMutation();
  const [submit, { isLoading: isSubmitting, error: submitError }] =
    useUpdateApplicantProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    birthDate: user?.birthDate || "",
    phone: user?.phone || "",
    email: user?.email || "",
    profileImageFile: null as File | null,
    profilePreview: user?.profileImage ? `${user.profileImage}` : "",
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleProfileImageChange = (file?: File) => {
    if (!file) return;
    setEditData((prev) => ({
      ...prev,
      profileImageFile: file,
      profilePreview: URL.createObjectURL(file),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      if (editData.fullName !== user.fullName) {
        formData.append("fullName", editData.fullName);
      }
      if (editData.birthDate) {
        formData.append("birthDate", editData.birthDate);
      }
      if (editData.profileImageFile) {
        formData.append("profileImage", editData.profileImageFile);
      }
      if (editData.phone) {
        formData.append("phone", editData.phone);
      }
      if (editData.email) {
        formData.append("email", editData.email);
      }
      formData.append("role", role);

      const res = await updateInvestor({
        id: user._id,
        data: formData,
      }).unwrap();

      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditing(false);
      toast({
        title: t("update_success"),
        variant: "default",
        description: t("info_updated"),
        action: (
          <Button
            onClick={logout}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 bg-background text-foreground shadow-sm`}
          >
            {t("logout")}
          </Button>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("update_failed"),
        variant: "destructive",
        description: t("error_while_updating"),
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async () => {
    if (!idPhoto || !livePhoto || !passportNumber || !idNumber) {
      toast({ title: t("fill_all"), variant: "destructive" });
      return;
    }
    try {
      const formData = new FormData();

      if (idPhoto) {
        formData.append("idPhoto", idPhoto);
      }
      if (livePhoto) {
        formData.append("livePhoto", livePhoto);
      }
      if (passportNumber) {
        formData.append("passportNumber", passportNumber);
      }
      if (idNumber) {
        formData.append("idNumber", idNumber);
      }
      formData.append("reviewStatus", "pending");

      await submit({
        id: user.authUserId,
        data: formData,
      }).unwrap();

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
      });
    }
  };

  const handleClose = () => {
    setOpenVerify(false);
    setIdNumber("");
    setPassportNumber("");
    setIdPhoto(null);
    setLivePhoto(null);
  };

  const REVIEW_STATUS_STYLES = {
    draft: "badge badge-outline text-gray-500 border-gray-300",
    pending: "badge badge-outline text-blue-600 border-blue-600",
    rejected: "badge badge-outline text-red-600 border-red-600",
    approved: "badge badge-outline text-green-600 border-green-600",
  };

  return {
    user,
    purchaseHistory,
    isLoading,
    purchaseRequests,
    loadingRequests,
    isEditing,
    setIsEditing,
    containerVariants,
    itemVariants,
    editData,
    setEditData,
    handleProfileImageChange,
    handleSaveProfile,
    isSaving,
    page,
    setPage,
    limit,
    setLimit,
    role,
    openVerify,
    setOpenVerify,
    idPhoto,
    setIdPhoto,
    livePhoto,
    setLivePhoto,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    handleSubmit,
    isSubmitting,
    handleClose,
    livePhotoPreview,
    setLivePhotoPreview,
    REVIEW_STATUS_STYLES,
  };
};
