"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname} from "next/navigation";
import { useEffect, useState } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  const [showSidebar,setShowSidebar] = useState(false)
  const pathname = usePathname()
  useEffect(()=> {
 if (pathname !== undefined ){
  setShowSidebar(pathname !== "/")
 }
  },[pathname])
  return (
    <html lang="en">
       <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          {showSidebar && <div className="w-16"><Sidebar /></div>}
          
          <main className="flex-1 bg-gray-50 h-screen font-sans">
            {children}
            <ToastContainer position="bottom-right" autoClose={3000} />

            </main>
        </div>
      </body>
    </html>
  );
}
