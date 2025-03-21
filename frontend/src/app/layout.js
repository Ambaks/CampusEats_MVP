// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext"; // adjust the path if needed
import { CartProvider } from "./context/CartContext"; // adjust the path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <main>{children}</main> {/* Page content goes here */}
            <Navbar /> {/* Fixed bottom navbar */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
