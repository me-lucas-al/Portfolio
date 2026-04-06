import { ToastContainer } from "react-toastify";
import "./globals.css";
import Provider from "@/components/auth/session-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucas Almeida | Portfolio",
  description: "Portfolio de Lucas Almeida - Desenvolvedor Full Stack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Provider>{children}</Provider>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          theme="colored"
        />
      </body>
    </html>
  );
}
