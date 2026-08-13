import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import Provider from "@/components/auth/session-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lucasalmeidasouza.com"),
  title: "Lucas Almeida | Programador Next.js, Node.js e React",
  description: "Portfólio de Lucas Almeida. Programador Next.js, Programador Node.js e Programador React. Desenvolvedor Full Stack especializado no ecossistema JavaScript e Java (Spring Boot). Experiência real em performance e sistemas B2B.",
  keywords: [
    "Lucas Almeida",
    "Lucas Almeida de Souza",
    "programador next",
    "programador node",
    "programador react",
    "programador next.js",
    "programador node.js",
    "Lucas Almeida dev",
    "Lucas Almeida desenvolvedor full stack",
    "Portfolio Lucas Almeida",
    "Desenvolvedor Full Stack",
    "Engenheiro de Software",
    "Next.js",
    "Node.js",
    "React",
    "Desenvolvedor Frontend",
    "Desenvolvedor Backend",
    "Desenvolvedor Web",
    "Java Spring Boot",
    "IFSP Bragança Paulista",
    "Lucas Almeida Bragança Paulista",
    "Bragança Paulista",
    "IFSP",
    "Instituto Federal",
    "Instituto Federal Bragança Paulista",
  ],
  authors: [{ name: "Lucas Almeida" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Lucas Almeida | Programador Next.js, Node.js e React",
    description: "Programador Next.js, Programador Node.js e Programador React. Construção de sistemas B2B escaláveis e aplicações web de alta performance.",
    url: "https://www.lucasalmeidasouza.com",
    siteName: "Lucas Almeida Portfolio",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://www.lucasalmeidasouza.com",
  },
  verification: {
    google: "LpBoXhM1B2rujPMRatGl3DuQvxfswfWKKRtwWJ7J0PQ",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>  
        <Provider>{children}</Provider>
        <ToastContainer position="bottom-right" autoClose={2500} theme="colored" aria-label="Toast container" />
      </body>
    </html>
  )
}