// components/auth/SubmitButton.tsx
"use client";

type SubmitButtonProps = {
  isSubmitting: boolean;
  text: string;
  loadingText?: string;
};

export default function SubmitButton({
  isSubmitting,
  text,
  loadingText,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="group relative w-full bg-white text-black px-6 py-3 font-semibold text-sm tracking-wide hover:bg-white/90 transition-all duration-500 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <span className="relative z-10">
        {isSubmitting ? loadingText || `${text}...` : text}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}
