import { baseApi } from "./baseApi";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  logo?: string;
}

export interface BuyStockRequest {
  stockId: string;
  quantity: number;
  price: number;
}

export interface BuyStockResponse {
  orderId: string;
  status: string;
  message: string;
}

// Dummy stock data for simulation
const dummyStocks: Stock[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", price: 178.52, change: 2.34, changePercent: 1.33, volume: 52847300, marketCap: "2.8T" },
  { id: "2", symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -1.23, changePercent: -0.86, volume: 21456700, marketCap: "1.8T" },
  { id: "3", symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 4.56, changePercent: 1.22, volume: 18234500, marketCap: "2.8T" },
  { id: "4", symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 3.21, changePercent: 1.84, volume: 45678900, marketCap: "1.9T" },
  { id: "5", symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 12.45, changePercent: 2.58, volume: 38234567, marketCap: "1.2T" },
  { id: "6", symbol: "META", name: "Meta Platforms", price: 505.95, change: -3.45, changePercent: -0.68, volume: 15678234, marketCap: "1.3T" },
  { id: "7", symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -8.72, changePercent: -3.39, volume: 98234567, marketCap: "790B" },
  { id: "8", symbol: "JPM", name: "JPMorgan Chase", price: 198.34, change: 1.89, changePercent: 0.96, volume: 8234567, marketCap: "572B" },
  { id: "9", symbol: "V", name: "Visa Inc.", price: 280.45, change: 2.12, changePercent: 0.76, volume: 6234567, marketCap: "574B" },
  { id: "10", symbol: "JNJ", name: "Johnson & Johnson", price: 156.78, change: -0.45, changePercent: -0.29, volume: 5234567, marketCap: "377B" },
];

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], void>({
      query: () => "/stocks",
      providesTags: ["Stocks"],
      // Transform response with dummy data for now
      transformResponse: () => dummyStocks,
    }),
    getStock: builder.query<Stock, string>({
      query: (id) => `/stocks/${id}`,
      providesTags: (result, error, id) => [{ type: "Stocks", id }],
      transformResponse: (_, __, id) => dummyStocks.find((s) => s.id === id) || dummyStocks[0],
    }),
    buyStock: builder.mutation<BuyStockResponse, BuyStockRequest>({
      query: (order) => ({
        url: "/orders/buy",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Portfolio"],
      // Simulate successful purchase
      transformResponse: (): BuyStockResponse => ({
        orderId: `ORD-${Date.now()}`,
        status: "completed",
        message: "Order executed successfully",
      }),
    }),
  }),
});

export const { useGetStocksQuery, useGetStockQuery, useBuyStockMutation } = stocksApi;
