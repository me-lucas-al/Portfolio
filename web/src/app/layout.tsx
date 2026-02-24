import { ToastContainer } from "react-toastify";
import "./globals.css";
import Provider from "@/components/auth/session-provider";

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
