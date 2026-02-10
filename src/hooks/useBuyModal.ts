import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./use-toast";
import { clamp, generateQuickShareOptions } from "./helpers";
import { useCreateShareTradeRequestMutation } from "@/store/api/shares/shareTradeRequestApi";
import { useResolvedRole } from "./useResolveRole";

const useBuyModal = ({ stock, tradeType, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { resolvedRole } = useResolvedRole();
  const profileId = resolvedRole?.profileId;

  const pricePerShare = Number(stock?.sharePrice || 0);

  const minShares = Math.max(1, Number(stock?.minInvestShare || 1));
  const maxShares = Math.max(
    minShares,
    Number(stock?.maxInvestShare || minShares),
  );

  const [shares, setShares] = useState(minShares);
  const [totalInput, setTotalInput] = useState("");
  const [note, setNote] = useState("");

  const [createTradeRequest, { isLoading }] =
    useCreateShareTradeRequestMutation();

  /** Reset when stock changes */
  useEffect(() => {
    setShares(minShares);
    setTotalInput("");
    setNote("");
  }, [minShares]);

  /** Quick-select options */
  const quickShareOptions = useMemo(
    () => generateQuickShareOptions(minShares, maxShares, 5),
    [minShares, maxShares],
  );

  /** Total cost (derived, numeric) */
  const totalCost = useMemo(() => {
    if (!pricePerShare) return 0;
    return shares * pricePerShare;
  }, [shares, pricePerShare]);

  /** Quantity controls */
  const increaseShares = () =>
    setShares((v) => clamp(v + minShares, minShares, maxShares));

  const decreaseShares = () =>
    setShares((v) => clamp(v - minShares, minShares, maxShares));

  /** Manual shares input (ONLY integers) */
  const setSharesFromInput = (value: string) => {
    if (value === "") return;
    if (!/^\d+$/.test(value)) return;

    const parsed = Number(value);
    setShares(clamp(parsed, minShares, maxShares));
  };

  /** Manual total input → derive shares (NO fractions) */
  const setSharesFromTotal = (value: string) => {
    // allow typing freely
    if (!/^\d*\.?\d*$/.test(value)) return;
    setTotalInput(value);

    if (!pricePerShare || value === "") return;

    const total = Number(value);
    if (!Number.isFinite(total)) return;

    const calculatedShares = Math.floor(total / pricePerShare);
    setShares(clamp(calculatedShares, minShares, maxShares));
  };

  /** Quick option select */
  const selectQuickOption = (value: number) => {
    setShares(clamp(value, minShares, maxShares));
  };

  /** Submit */
  const submitTradeRequest = async () => {
    try {
      await createTradeRequest({
        data: {
          userId: profileId,
          tradeType,
          sourceType: stock?.entityType,
          source: stock?._id,
          numberOfShares: shares,
          pricePerShare,
          description: note,
          paymentStatus: "unpaid",
        },
      }).unwrap();

      toast({
        title: t("request_sent"),
        description: `${t("request_buy")} ${t("shares_sent_success")}`,
      });

      onClose();
      setShares(minShares);
      setTotalInput("");
      setNote("");
    } catch {
      toast({
        variant: "destructive",
        title: t("order_failed"),
        description: t("try_again"),
        duration: 3000,
      });
    }
  };

  return {
    t,

    // state
    shares,
    minShares,
    maxShares,
    totalInput,
    totalCost,
    note,
    isLoading,

    // actions
    setNote,
    increaseShares,
    decreaseShares,
    setSharesFromInput,
    setSharesFromTotal,
    selectQuickOption,
    submitTradeRequest,
    setTotalInput,

    // ui helpers
    quickShareOptions,
  };
};

export default useBuyModal;
