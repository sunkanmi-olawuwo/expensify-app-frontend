"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { formatCompactCurrency, formatCurrency } from "../utils";

import type { DashboardSummary } from "../types";

type MonthlyPerformanceChartProps = {
  summary: DashboardSummary;
};

type ChartPoint = {
  expensesY: number;
  month: string;
  x: number;
  incomeY: number;
};

const chartWidth = 640;
const chartHeight = 280;
const padding = {
  bottom: 42,
  left: 52,
  right: 20,
  top: 20,
};

function buildLinePath(
  points: ChartPoint[],
  series: "income" | "expenses",
) {
  return points
    .map((point, index) => {
      const y = series === "income" ? point.incomeY : point.expensesY;

      return `${index === 0 ? "M" : "L"} ${point.x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  points: ChartPoint[],
  series: "income" | "expenses",
) {
  const baseline = chartHeight - padding.bottom;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (!firstPoint || !lastPoint) {
    return "";
  }

  return `${buildLinePath(points, series)} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;
}

export function MonthlyPerformanceChart({
  summary,
}: MonthlyPerformanceChartProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(summary.monthlyPerformance.length - 1, 0),
  );
  const chartCurrency = summary.monthlyIncome.currency;

  const { areaPaths, linePaths, maxValue, points, yAxisLabels } = useMemo(() => {
    const baseline = chartHeight - padding.bottom;
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const maxSeriesValue = Math.max(
      ...summary.monthlyPerformance.flatMap((point) => [
        point.expenses,
        point.income,
      ]),
    );
    const domainMax = Math.ceil(maxSeriesValue / 1000) * 1000;

    const chartPoints = summary.monthlyPerformance.map((point, index) => {
      const x =
        padding.left +
        (index * innerWidth) / (summary.monthlyPerformance.length - 1);

      return {
        expensesY: baseline - (point.expenses / domainMax) * innerHeight,
        incomeY: baseline - (point.income / domainMax) * innerHeight,
        month: point.month,
        x,
      };
    });

    return {
      areaPaths: {
        expenses: buildAreaPath(chartPoints, "expenses"),
        income: buildAreaPath(chartPoints, "income"),
      },
      linePaths: {
        expenses: buildLinePath(chartPoints, "expenses"),
        income: buildLinePath(chartPoints, "income"),
      },
      maxValue: domainMax,
      points: chartPoints,
      yAxisLabels: [domainMax, domainMax / 2, 0],
    };
  }, [summary.monthlyPerformance]);

  const activeData = summary.monthlyPerformance[activeIndex];
  const activePoint = points[activeIndex];
  const baseline = chartHeight - padding.bottom;

  if (summary.monthlyPerformance.length === 0 || !activeData || !activePoint) {
    return null;
  }

  return (
    <SurfaceCard
      action={<Badge variant="outline">Last 6 months</Badge>}
      className="shadow-ambient-md"
      description="Income and expenses over time"
      eyebrow="Monthly Performance"
      title="Cash flow trend"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 text-body-md text-muted-foreground">
            <svg aria-hidden="true" height="10" width="18">
              <line
                stroke="var(--secondary)"
                strokeWidth="2.5"
                x1="0"
                x2="18"
                y1="5"
                y2="5"
              />
              <circle cx="9" cy="5" fill="var(--secondary)" r="3" />
            </svg>
            Income
          </span>
          <span className="inline-flex items-center gap-2 text-body-md text-muted-foreground">
            <svg aria-hidden="true" height="10" width="18">
              <line
                stroke="var(--destructive)"
                strokeDasharray="4 2"
                strokeWidth="2.5"
                x1="0"
                x2="18"
                y1="5"
                y2="5"
              />
              <rect
                fill="var(--destructive)"
                height="6"
                rx="1"
                width="6"
                x="6"
                y="2"
              />
            </svg>
            Expenses
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[calc(var(--radius-shell)-0.45rem)] bg-surface-bright p-4">
          <svg
            aria-labelledby="monthly-performance-title"
            className="h-auto w-full"
            role="img"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <title id="monthly-performance-title">
              Monthly performance chart
            </title>
            <defs>
              <linearGradient id="income-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--secondary)"
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor="var(--secondary)"
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="expenses-gradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--destructive)"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="var(--destructive)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {yAxisLabels.map((value) => {
              const y =
                padding.top +
                ((maxValue - value) / maxValue) *
                  (chartHeight - padding.top - padding.bottom);

              return (
                <g key={value}>
                  <line
                    stroke="var(--outline-variant)"
                    strokeOpacity="0.35"
                    strokeDasharray="4 8"
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                  />
                  <text
                    className="fill-muted-foreground text-[11px]"
                    x={padding.left - 12}
                    y={y + 4}
                  >
                    {formatCompactCurrency(value, chartCurrency)}
                  </text>
                </g>
              );
            })}

            <path d={areaPaths.income} fill="url(#income-gradient)" />
            <path d={areaPaths.expenses} fill="url(#expenses-gradient)" />
            <path
              d={linePaths.income}
              fill="none"
              stroke="var(--secondary)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d={linePaths.expenses}
              fill="none"
              stroke="var(--destructive)"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <line
              stroke="var(--outline-variant)"
              strokeOpacity="0.45"
              strokeDasharray="4 8"
              x1={activePoint.x}
              x2={activePoint.x}
              y1={padding.top}
              y2={baseline}
            />

            {points.map((point, index) => {
              const previousPoint = points[index - 1];
              const nextPoint = points[index + 1];
              const leftEdge = previousPoint
                ? (previousPoint.x + point.x) / 2
                : padding.left;
              const rightEdge = nextPoint
                ? (nextPoint.x + point.x) / 2
                : chartWidth - padding.right;

              return (
                <rect
                  key={`${point.month}-hover-target`}
                  aria-label={`${point.month} monthly performance`}
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  fill="transparent"
                  height={baseline - padding.top}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="button"
                  tabIndex={0}
                  width={rightEdge - leftEdge}
                  x={leftEdge}
                  y={padding.top}
                />
              );
            })}

            {points.map((point, index) => (
              <g key={point.month}>
                <circle
                  cx={point.x}
                  cy={point.incomeY}
                  fill="var(--secondary)"
                  r={index === activeIndex ? 6 : 4}
                />
                <circle
                  cx={point.x}
                  cy={point.expensesY}
                  fill="var(--destructive)"
                  r={index === activeIndex ? 6 : 4}
                />
                <text
                  className={cn(
                    "fill-muted-foreground text-[11px]",
                    index === activeIndex && "fill-foreground",
                  )}
                  textAnchor="middle"
                  x={point.x}
                  y={chartHeight - 12}
                >
                  {point.month}
                </text>
              </g>
            ))}
          </svg>

          <div
            aria-controls="chart-tooltip"
            className="bg-popover shadow-ambient-sm pointer-events-none absolute top-5 z-10 rounded-[1rem] p-3"
            id="chart-tooltip"
            role="tooltip"
            style={{
              left: `clamp(1rem, ${((activePoint.x - 70) / chartWidth) * 100}%, calc(100% - 11rem))`,
            }}
          >
            <p className="text-label-sm text-muted-foreground">
              {activeData.month}
            </p>
            <p className="text-body-md text-foreground mt-1">
              Income {formatCurrency(activeData.income, chartCurrency)}
            </p>
            <p className="text-body-md text-foreground">
              Expenses {formatCurrency(activeData.expenses, chartCurrency)}
            </p>
          </div>

          <div aria-live="polite" className="sr-only">
            {activeData.month}: income{" "}
            {formatCurrency(activeData.income, chartCurrency)}, expenses{" "}
            {formatCurrency(activeData.expenses, chartCurrency)}
          </div>

          <p className="text-body-md text-muted-foreground mt-4">
            Select or hover over a month column to inspect income and expenses.
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
