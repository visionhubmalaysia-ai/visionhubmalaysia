import { redirect } from "next/navigation";

export default function CancelRedirect() {
  redirect("/status");
}
