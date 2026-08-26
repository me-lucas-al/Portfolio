import type { Metadata, Viewport } from "next"
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google"
import { ToastContainer } from "react-toastify"
import Provider from "@/components/auth/session-provider"
import { getLocale } from "@/lib/locale"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-terminal",
})

export const viewport: Viewport = {
  themeColor: "#0d0b12",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lucasalmeidasouza.com"),
  title: "Lucas Almeida | Portfolio - Desenvolvedor Next.js, React e Node.js",
  description: "Portfólio oficial do Lucas Almeida. Desenvolvedor de software com forte expêriencia em Next.js, React e Node.js. Soluções web de alta performance e arquiteturas escaláveis.",
  keywords: [
    "Lucas Almeida",
    "lucas almeida de souza",
    "lucas almeida souza",
    "Lucas Almeida de Souza",
    "Lucas Almeida Souza",
    "lucas souza",
    "lucas almeida",
    "Lucas Almeida Dev",
    "lucas almeida dev",
    "Lucas Almeida Desenvolvedor",
    "lucas almeida desenvolvedor",
    "Lucas Almeida Programador",
    "lucas almeida programador",
    "Lucas Almeida Next",
    "lucas almeida next",
    "Lucas Almeida Next.js",
    "lucas almeida next.js",
    "Lucas Almeida React",
    "lucas almeida react",
    "Lucas Almeida Node",
    "lucas almeida node",
    "Lucas Almeida Node.js",
    "lucas almeida node.js",
    "Lucas Almeida de Souza",
    "Portfolio Lucas Almeida",
    "desenvolvedor next.js",
    "programador next.js",
    "programador react",
    "programador node.js",
    "desenvolvedor full stack lucas almeida",
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
  ],
  authors: [{ name: "Lucas Almeida", url: "https://www.lucasalmeidasouza.com" }],
  creator: "Lucas Almeida",
  publisher: "Lucas Almeida",
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
    title: "Lucas Almeida | Lucas Almeida Dev - Desenvolvedor Next.js, React e Node.js",
    description: "Portfólio oficial de Lucas Almeida (Lucas Almeida Dev). Desenvolvedor Next.js, React e Node.js. Sistemas B2B escaláveis e aplicações web de alta performance.",
    url: "https://www.lucasalmeidasouza.com",
    siteName: "Lucas Almeida Dev - Portfólio Oficial",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Almeida | Lucas Almeida Dev - Desenvolvedor Next.js, React e Node.js",
    description: "Portfólio oficial de Lucas Almeida. Desenvolvedor especialista em Next.js, React e Node.js.",
    creator: "@lucas_almeida",
  },
  alternates: {
    canonical: "https://www.lucasalmeidasouza.com",
  },
  verification: {
    google: "LpBoXhM1B2rujPMRatGl3DuQvxfswfWKKRtwWJ7J0PQ",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/icon.svg'],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html
      lang={locale === "en" ? "en" : "pt-BR"}
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>  
        <Provider>{children}</Provider>
        <ToastContainer position="bottom-right" autoClose={2500} theme="colored" aria-label="Toast container" />
      </body>
    </html>
  )
}