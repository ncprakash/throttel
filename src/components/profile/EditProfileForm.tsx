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
  user: any; // keep as `any` for now; replace with a concrete User type when available
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
    <div className="mt-4 p-4 rounded-lg bg-white/4">
      <h4 className="text-sm font-semibold mb-2">Edit profile</h4>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="p-3 rounded bg-white/5 outline-none"
          placeholder="First"
          value={value.first_name}
          onChange={handleChange("first_name")}
        />
        <input
          className="p-3 rounded bg-white/5 outline-none"
          placeholder="Last"
          value={value.last_name}
          onChange={handleChange("last_name")}
        />
      </div>

      <input
        className="p-3 rounded bg-white/5 outline-none mt-3"
        placeholder="Phone"
        value={value.phone}
        onChange={handleChange("phone")}
      />

      <div className="flex gap-2 mt-3">
        <button
          className="px-4 py-2 rounded bg-white/10"
          onClick={() => void onSave()}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          className="px-4 py-2 rounded bg-transparent border"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
