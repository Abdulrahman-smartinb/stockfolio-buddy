import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./use-toast";
import { isLoggedIn } from "./helpers";
import { useCreateShareTradeRequestMutation } from "@/store/api/shares/shareTradeRequestApi";

const useBuyModal = ({ stock, tradeType, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const loggedIn = isLoggedIn();
  const minQuantity = stock?.minInvestShare ?? 1;
  const user = JSON.parse(localStorage.getItem("profile") || "{}");
  console.log(`stock`, stock);

  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  const [createShareTradeRequest, { isLoading }] =
    useCreateShareTradeRequestMutation();

  const totalCost = stock?.sharePrice * quantity;

  useEffect(() => {
    if (stock) setQuantity(stock?.minInvestShare);
  }, [stock]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.min(1000, Math.max(minQuantity, q + delta)));
  };

  const handleQuantityInput = (value: string) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      setQuantity(Math.min(1000, Math.max(minQuantity, num)));
    }
  };

  const handleSubmit = async () => {
    if (!loggedIn) {
      toast({
        variant: "destructive",
        title: t("login_required"),
        description: t("login_msg"),
      });
      return;
    }

    try {
      await createShareTradeRequest({
        data: {
          userId: user?._id,
          tradeType: tradeType,
          sourceType: stock?.entityType,
          source: stock._id,
          numberOfShares: quantity,
          pricePerShare: stock.sharePrice,
          description,
          paymentStatus: "unpaid",
        },
      }).unwrap();

      toast({
        title: t("request_sent"),
        description: `${t("request_buy")} ${quantity} ${t(
          "shares_sent_success",
        )}`,
      });

      onClose();
      setQuantity(minQuantity);
      setDescription("");
    } catch {
      toast({
        variant: "destructive",
        title: t("order_failed"),
        description: t("try_again"),
      });
    }
  };

  return {
    t,
    minQuantity,
    isLoading,
    totalCost,
    handleQuantityChange,
    handleQuantityInput,
    handleSubmit,
    description,
    setDescription,
    quantity,
  };
};
export default useBuyModal;
