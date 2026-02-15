import { prisma } from "@/lib/db";
import { AdminSuggestionList } from "@/components/admin/AdminSuggestionList";
import { AdminSiteSettingForm } from "@/components/admin/AdminSiteSettingForm";

export const dynamic = "force-dynamic";

async function getSuggestions() {
  return prisma.needSuggestion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      segment: { select: { id: true, name: true, slug: true } },
    },
  });
}

export default async function AdminPage() {
  const suggestions = await getSuggestions();
  const pending = suggestions.filter((s) => s.status === "PENDING");
  const approved = suggestions.filter((s) => s.status === "APPROVED");
  const rejected = suggestions.filter((s) => s.status === "REJECTED");
  const [disclaimerSetting, betaSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "disclaimer" } }),
    prisma.siteSetting.findUnique({ where: { key: "beta_note" } }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Upravljanje vsebin</h1>
      <p className="mb-6 text-slate-600">
        Odobrite ali zavrnite predloge. Samo odobreni so prikazani na strani Kaj potrebujemo.
      </p>
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Omejitev odgovornosti (prikazana na vseh straneh)</h2>
        <AdminSiteSettingForm
          settingKey="disclaimer"
          initialValue={disclaimerSetting?.value ?? ""}
          placeholder="Besedilo izjave o omejitvi odgovornosti…"
        />
      </section>
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Beta obvestilo (nad nogo)</h2>
        <AdminSiteSettingForm
          settingKey="beta_note"
          initialValue={
            betaSetting?.value ??
            "Ta aplikacija je v verziji 0.0.1 (beta). Vsi obiskovalci trenutno nastopajo kot preizkuševalci; vsebina je pripravljena z uporabo Vercel strežnika, Claude AI in urejena s Cursor/Vibe Coding. Hvala za razumevanje."
          }
          placeholder="Besedilo beta obvestila…"
          helper="Prikazano tik nad nogo (footer) na vseh straneh."
        />
      </section>
      <AdminSuggestionList
        pending={pending}
        approved={approved}
        rejected={rejected}
      />
    </div>
  );
}
