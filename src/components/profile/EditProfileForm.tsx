// components/EditProfileForm.tsx
"use client";
import React from "react";

type ProfileForm = {
  first_name: string;
  last_name: string;
  phone: string;
};

type EditProfileFormProps = {
  open: boolean;
  user: any;
  value: ProfileForm;
  setValue: React.Dispatch<React.SetStateAction<ProfileForm>>;
  onSave: () => void | Promise<void>;
  onClose: () => void;
  saving?: boolean;
};

export default function EditProfileForm({
  open,
  user,
  value,
  setValue,
  onSave,
  onClose,
  saving = false,
}: EditProfileFormProps) {
  if (!open) return null;

  const handleChange =
    (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-white/80">
        Edit profile
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="
            p-3 rounded-lg bg-white/5 border border-white/10 text-white 
            placeholder-white/40 outline-none 
            focus:bg-white/10 focus:border-white/30 transition
          "
          placeholder="First name"
          value={value.first_name}
          onChange={handleChange("first_name")}
        />
        <input
          className="
            p-3 rounded-lg bg-white/5 border border-white/10 text-white
            placeholder-white/40 outline-none 
            focus:bg-white/10 focus:border-white/30 transition
          "
          placeholder="Last name"
          value={value.last_name}
          onChange={handleChange("last_name")}
        />
      </div>

      <input
        className="
          p-3 rounded-lg bg-white/5 border border-white/10 text-white
          placeholder-white/40 outline-none mt-3 
          focus:bg-white/10 focus:border-white/30 transition
        "
        placeholder="Phone"
        value={value.phone}
        onChange={handleChange("phone")}
      />

      <div className="flex gap-2 mt-4">
        <button
          className="
            px-4 py-2 rounded-lg bg-white/10 text-white
            hover:bg-white/20 transition 
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          onClick={() => void onSave()}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          className="
            px-4 py-2 rounded-lg border border-white/20 text-white/80
            hover:bg-white/10 hover:text-white transition
          "
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
