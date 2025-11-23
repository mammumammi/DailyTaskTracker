import type { Metadata } from "next";
import { Saira} from "next/font/google";
import "./globals.css";

const oswald = Saira({
  weight: ["500"]
})



export const metadata: Metadata = {
  title: "TaskTracker",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.className} `}
      >
        {children}
      </body>
    </html>
  );
}
