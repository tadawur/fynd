import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.onboarded) redirect("/dashboard");

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id, name, region")
    .order("name");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, club_id")
    .order("name");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green" />
        <span className="font-display text-lg font-bold">Fynd</span>
      </div>
      <h1 className="mb-1 text-2xl font-semibold">Poď medzi nás</h1>
      <p className="mb-8 text-sm text-muted">
        Pár rýchlych otázok — a máš prístup ku kalendáru, chatu aj XP systému
        svojho klubu.
      </p>
      <OnboardingForm clubs={clubs ?? []} categories={categories ?? []} />
    </div>
  );
}
