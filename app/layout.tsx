"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";
import { Hub } from "aws-amplify/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>{children}</Authenticator.Provider>
      </body>
    </html>
  );
}
