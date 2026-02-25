import { useMemo } from "react";
import { useGetOneEntityQuery } from "@/store/api/investmentEntityApi";
import { useGetShareNetInvestmentQuery } from "@/store/api/shares/shareTransactionsApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type RangeType = "24H" | "7D" | "1M" | "3M" | "1Y" | "ALL";

const useFundDetails = (range: RangeType) => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data, isLoading } = useGetOneEntityQuery({ id });

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case "24H":
        start.setHours(end.getHours() - 24);
        break;
      case "7D":
        start.setDate(end.getDate() - 7);
        break;
      case "1M":
        start.setMonth(end.getMonth() - 1);
        break;
      case "3M":
        start.setMonth(end.getMonth() - 3);
        break;
      case "1Y":
        start.setFullYear(end.getFullYear() - 1);
        break;
      case "ALL":
        return { startDate: undefined, endDate: undefined };
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [range]);

  const { data: netData, isLoading: netLoading } =
    useGetShareNetInvestmentQuery(
      {
        assetType: "InvestmentFund",
        assetId: id!,
        startDate,
        endDate,
      },
      {
        skip: !id,
      }
    );

  return {
    fund: data?.data,
    netTimeline: netData?.data || [],
    isLoading,
    netLoading,
    t,
  };
};

export default useFundDetails;
