import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./use-toast";
import { clamp, generateQuickShareOptions, isLoggedIn } from "./helpers";
import { useCreateShareTradeRequestMutation } from "@/store/api/shares/shareTradeRequestApi";

const useBuyModal = ({ stock, tradeType, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const loggedIn = isLoggedIn();
  const user = JSON.parse(localStorage.getItem("profile") || "{}");

  const minShares = Math.max(1, Number(stock?.minInvestShare || 1));
  const maxShares = Math.max(
    minShares,
    Number(stock?.maxInvestShare || minShares)
  );

  const [shares, setShares] = useState(minShares);
  const [note, setNote] = useState("");

  const [createTradeRequest, { isLoading }] =
    useCreateShareTradeRequestMutation();

  /** Reset when stock changes */
  useEffect(() => {
    setShares(minShares);
  }, [minShares]);

  /** Quick-select options (chips) */
  const quickShareOptions = useMemo(
    () => generateQuickShareOptions(minShares, maxShares, 4),
    [minShares, maxShares]
  );

  /** Quick option select */
  const selectQuickOption = (value: number) => {
    setShares(clamp(value, minShares, maxShares));
  };

  const totalCost = useMemo(
    () => Number(stock?.sharePrice || 0) * shares,
    [shares, stock]
  );

  /** Quantity controls */
  const increaseShares = () =>
    setShares((v) => clamp(v + minShares, minShares, maxShares));

  const decreaseShares = () =>
    setShares((v) => clamp(v - minShares, minShares, maxShares));

  const setSharesFromInput = (value: string) => {
    if (value === "") return;

    if (!/^\d+$/.test(value)) return;

    const parsed = Number(value);

    setShares(parsed);
  };

  /** Submit */
  const submitTradeRequest = async () => {
    if (!loggedIn) {
      toast({
        variant: "destructive",
        title: t("login_required"),
        description: t("login_msg"),
      });
      return;
    }

    try {
      await createTradeRequest({
        data: {
          userId: user?._id,
          tradeType,
          sourceType: stock?.entityType,
          source: stock?._id,
          numberOfShares: shares,
          pricePerShare: stock?.sharePrice,
          description: note,
          paymentStatus: "unpaid",
        },
      }).unwrap();

      toast({
        title: t("request_sent"),
        description: t("request_success"),
      });

      onClose();
      setShares(minShares);
      setNote("");
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
    shares,
    minShares,
    maxShares,
    quickShareOptions,
    totalCost,
    note,
    isLoading,

    setShares,
    setNote,
    increaseShares,
    decreaseShares,
    setSharesFromInput,
    selectQuickOption,
    submitTradeRequest,
  };
};

export default useBuyModal;
