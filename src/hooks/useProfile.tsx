import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";
import { UserData } from "@/store/api/authApi";
import {
  useGetInvestorPurchaseRequestsQuery,
  useGetPurchaseHistoryQuery,
} from "@/store/api/stocksApi";
import { base_url } from "@/api/GlobalData";
import { useUpdateInvestorMutation } from "@/store/api/investorApi";
import { Button } from "@/components/ui/button";

export const useProfile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user] = useState<UserData>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const { data: purchaseHistory, isLoading } = useGetPurchaseHistoryQuery(
    user?._id
  );

  const { data: purchaseRequests, isLoading: loadingRequests } =
    useGetInvestorPurchaseRequestsQuery(user?._id);
  const [updateInvestor, { isLoading: isSaving }] = useUpdateInvestorMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    birthDate: user?.birthDate || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    profileImageFile: null as File | null,
    profilePreview: user?.profileImage
      ? `${base_url}/api/Investor/${user.profileImage}`
      : "",
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
      if (editData.phoneNumber) {
        formData.append("phoneNumber", editData.phoneNumber);
      }
      if (editData.email) {
        formData.append("email", editData.email);
      }

      const res = await updateInvestor({
        id: user._id,
        data: formData,
      }).unwrap();

      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditing(false);
      toast({
        title: "Update successful",
        variant: "default",
        description: "Profile information updated successfully",
        action: (
          <Button
            onClick={() => window.location.reload()}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 bg-background text-foreground shadow-sm`}
          >
            Refresh
          </Button>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        variant: "destructive",
        description: "Error occurred while updating profile information",
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
  };
};
