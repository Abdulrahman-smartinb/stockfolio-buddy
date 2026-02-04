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
import { useTranslation } from "react-i18next";
import { BankTranfer, ShamCash, Usdt, UserData } from "@/interfaces/UserData";
import {
  useGetOneApplicantQuery,
  useUpdateApplicantProfileMutation,
} from "@/store/api/applicantApi";
import { useGetShareHolderStaticsQuery } from "@/store/api/shares/shareHoldersApi";
import { compressImage } from "@/lib/utils";

export const useProfile = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [user, setUser] = useState<UserData>();

  const [openVerify, setOpenVerify] = useState(false);
  const [idPhoto, setIdPhoto] = useState<File | null>();
  const [livePhoto, setLivePhoto] = useState<File | null>();
  const [livePhotoPreview, setLivePhotoPreview] = useState<any>();
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpDate, setPassportExpDate] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankData, setBankData] = useState<BankTranfer>();
  const [shamCashData, setShamCashData] = useState<ShamCash>();
  const [usdtData, setUsdtData] = useState<Usdt>();

  const {
    data: applicant,
    isLoading: isLoadingUser,
    refetch: refetchApplicant,
  } = useGetOneApplicantQuery(
    { id: profile?.authUserId },
    { skip: profile?.role !== "applicant" },
  );
  const {
    data: investor,
    isLoading: isLoadingInvestor,
    refetch: refetchInvestor,
  } = useGetOneInvestorQuery(
    { id: profile?.authUserId },
    { skip: profile?.role !== "investor" },
  );

  // const { data: SharesData, isLoading: LoadingShares } =
  //   useGetShareHolderStaticsQuery(
  //     { holderId: profile?.authUserId, holderType: "investors" },
  //     { skip: role === "applicant" },
  //   );

  useEffect(() => {
    if (profile?.role === "investor" && investor?.data) {
      setUser(investor?.data);
    }
    if (profile?.role === "applicant" && applicant?.data) {
      setUser(applicant?.data);
    }
  }, [investor, applicant]);

  // const { data: purchaseHistory, isLoading } = useGetPurchaseHistoryQuery({
  //   id: user?._id,
  //   page,
  //   limit,
  // });

  const {
    data: purchaseRequests,
    isLoading: loadingRequests,
    refetch: refetchRequests,
  } = useGetInvestorPurchaseRequestsQuery(user?._id, {
    skip: !user?._id,
  });

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
      formData.append("role", profile?.role);

      await updateInvestor({
        id: user.authUserId,
        data: formData,
      }).unwrap();
      if (profile?.role === "applicant") refetchApplicant();
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

  const isBankTransferValid = (data?: BankTranfer) => {
    if (!data) return false;

    const { beneficiaryFullName, beneficiaryAddress, bankName, accountNumber } =
      data;

    return (
      beneficiaryFullName?.trim() &&
      beneficiaryAddress?.trim() &&
      bankName?.trim() &&
      accountNumber?.trim()
    );
  };

  const isShamCashValid = (data?: ShamCash) => {
    if (!data) return false;

    const { accountNumber, beneficiaryName } = data;

    return accountNumber?.trim() && beneficiaryName?.trim();
  };

  const isUsdtValid = (data?: Usdt) => {
    if (!data) return false;

    const { transferNetwork, walletAddress } = data;

    return transferNetwork?.trim() && walletAddress?.trim();
  };

  const isPaymentDataValid = () => {
    switch (paymentMethod) {
      case "bank":
        return isBankTransferValid(bankData);

      case "shamCash":
        return isShamCashValid(shamCashData);

      case "usdt":
        return isUsdtValid(usdtData);

      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (
      !idPhoto ||
      !livePhoto ||
      (!idNumber && (!passportNumber || !passportExpDate))
    ) {
      toast({ title: t("fill_all"), variant: "destructive", duration: 3000 });
      return;
    }
    // if (!paymentMethod || isPaymentDataValid()) {
    //   toast({
    //     title: t("payment_method_required"),
    //     variant: "destructive",
    //     duration: 3000,
    //   });
    //   return;
    // }
    try {
      const formData = new FormData();

      const compressedIdPhoto = await compressImage(idPhoto);
      const compressedLivePhoto = await compressImage(livePhoto);

      formData.append("idPhoto", compressedIdPhoto);
      formData.append("livePhoto", compressedLivePhoto);
      formData.append("passportNumber", passportNumber);
      if (passportNumber?.trim()?.length > 0)
        formData.append("passportExpDate", passportExpDate);
      formData.append("idNumber", idNumber);
      formData.append("reviewStatus", "pending");
      // formData.append("paymentMethod", paymentMethod);

      // if (paymentMethod === "bank") {
      //   formData.append("bankTransfer", JSON.stringify(bankData));
      // }
      // if (paymentMethod === "shamcash") {
      //   const { qrCode, ...rest } = shamCashData!;
      //   formData.append("shamcash", JSON.stringify(rest));

      //   if (qrCode) {
      //     formData.append("qrCode", qrCode);
      //   }
      // }

      // if (paymentMethod === "usdt") {
      //   const { walletQr, ...rest } = usdtData!;
      //   formData.append("usdt", JSON.stringify(rest));

      //   if (walletQr) {
      //     formData.append("walletQr", walletQr);
      //   }
      // }

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
  };

  const REVIEW_STATUS_STYLES = {
    draft: "badge badge-outline text-gray-500 border-gray-300",
    pending: "badge badge-outline text-blue-600 border-blue-600",
    rejected: "badge badge-outline text-red-600 border-red-600",
    approved: "badge badge-outline text-green-600 border-green-600",
  };

  return {
    loadingUser: isLoadingUser || isLoadingInvestor,
    user,
    // purchaseHistory,
    // isLoading,
    purchaseRequests,
    loadingRequests,
    refetchRequests,
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
    role: profile?.role,
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
    passportExpDate,
    setPassportExpDate,
    handleSubmit,
    isSubmitting,
    handleClose,
    livePhotoPreview,
    setLivePhotoPreview,
    REVIEW_STATUS_STYLES,
    paymentMethod,
    setPaymentMethod,
    bankData,
    setBankData,
    shamCashData,
    setShamCashData,
    usdtData,
    setUsdtData,
  };
};
