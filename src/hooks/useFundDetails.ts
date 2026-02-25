import { useGetOneEntityQuery } from "@/store/api/investmentEntityApi";
import { useGetFundTransactionsQuery } from "@/store/api/shares/shareTransactionsApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const useFundDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, isLoading } = useGetOneEntityQuery({ id });
  // const { data: transactions, isLoading: transactionsLoading } =
  //   useGetFundTransactionsQuery({});

  return { fund: data?.data, isLoading, t };
};
export default useFundDetails;
