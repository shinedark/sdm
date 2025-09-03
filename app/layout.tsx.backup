import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AudioProvider } from "./context/audio-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHINE DARK MUSIC",
  description: "ALO SI BUENAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
