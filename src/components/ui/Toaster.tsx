"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      closeButton
      toastOptions={{
        className: "bw-toast",
      }}
      richColors={false} // turn OFF color accents
    />
  );
}
