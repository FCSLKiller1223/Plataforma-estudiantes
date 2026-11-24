import { createAlova } from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";

export const alova = createAlova({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  responded: (response) => response.json()
});
