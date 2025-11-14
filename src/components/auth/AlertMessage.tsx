// components/auth/AlertMessage.tsx
"use client";

type AlertMessageProps = {
  type: "error" | "success";
  message: string;
};

export default function AlertMessage({ type, message }: AlertMessageProps) {
  const styles =
    type === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";

  return (
    <div
      className={`mt-6 rounded-xl border px-4 py-3 text-sm ${styles}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {message}
    </div>
  );
}
