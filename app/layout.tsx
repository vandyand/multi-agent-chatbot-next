import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DemoNav from "./DemoNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wellness Crew Chat",
  description:
    "Multi-agent wellness chatbot with 4 AI characters — Coach, Chef, Sage, and Doc. Built with OpenAI structured output and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}><DemoNav current="wellness" />{children}</body>
    </html>
  );
}
