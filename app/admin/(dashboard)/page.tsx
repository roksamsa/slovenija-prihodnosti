import { prisma } from "@/lib/db";
import { AdminSuggestionList } from "@/components/admin/AdminSuggestionList";

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

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Predlogi obiskovalcev</h1>
      <p className="mb-6 text-slate-600">
        Odobrite ali zavrnite predloge. Samo odobreni so prikazani na strani Kaj potrebujemo.
      </p>
      <AdminSuggestionList
        pending={pending}
        approved={approved}
        rejected={rejected}
      />
    </div>
  );
}
