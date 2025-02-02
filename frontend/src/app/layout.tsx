// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CryptoDaily Brief",
  description: "日々の暗号資産パーソナルブリーフィング",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body className={inter.className}>
        <header className="p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">CryptoDaily Brief</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="p-4 bg-gray-200 text-center">
          <p>&copy; 2025 CryptoDaily Brief</p>
        </footer>
      </body>
    </html>
  );
}
