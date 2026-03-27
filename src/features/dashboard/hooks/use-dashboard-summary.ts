import { useQuery } from "@tanstack/react-query";

import {
  dashboardSummaryMockData,
  dashboardSummaryQueryKey,
} from "../types";

import type { DashboardSummary } from "../types";

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    initialData: dashboardSummaryMockData,
    queryFn: async () => dashboardSummaryMockData,
    queryKey: dashboardSummaryQueryKey,
  });
}
