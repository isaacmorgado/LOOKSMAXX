import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Results - LOOKSMAXX",
  description: "Detailed facial analysis results and recommendations",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
