import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Przenieśliśmy Navbar z powrotem tutaj

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Necrotic Threads",
  description: "Dark-themed horror fashion store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <Navbar /> {/* Navbar jest tutaj, nie w osobnym pliku */}
        {children}
      </body>
    </html>
  );
}
