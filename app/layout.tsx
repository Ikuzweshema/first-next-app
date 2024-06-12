import "@/app/ui/global.css"
import {inter} from "@/app/ui/fonts";
import {ReactNode} from "react";
import {Metadata} from "next";

export const metadata:Metadata={
  title:{
    template:"%s |Acme Dashboard",
    default:"Acme Dashboard"
  },
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase:new URL('https://next-learn-dashboard.vercel.sh')
}

export default function RootLayout({
  children,
}: {
  children:ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} >{children}</body>
    </html>
  );
}
