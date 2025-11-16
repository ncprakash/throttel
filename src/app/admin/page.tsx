// app/admin/page.tsx (server)
import { redirect } from "next/navigation";

export default function AdminIndex() {
  // redirect to products subpage
  redirect("/admin/products");
}
