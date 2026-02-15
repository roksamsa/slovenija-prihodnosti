import { PrismaClient } from "@prisma/client";
import {
  parties,
  policyStatements,
  getStanceForParty,
  nationalSegments,
  nationalNeedsBySegment,
} from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database slovenija_prihodnosti...");

  // Clear existing data (order matters for FKs)
  await prisma.pollData.deleteMany();
  await prisma.partyPolicyStance.deleteMany();
  await prisma.partyProgram.deleteMany();
  await prisma.policyComparison.deleteMany();
  await prisma.nationalNeed.deleteMany();
  await prisma.nationalSegment.deleteMany();
  await prisma.party.deleteMany();

  // 1. Create parties
  const partyRecords = await Promise.all(
    parties.map((p) => {
      const row = p as typeof p & { programUrl?: string | null };
      return prisma.party.create({
        data: {
          name: p.name,
          abbreviation: p.abbreviation,
          slug: p.slug,
          color: p.color,
          logoUrl: (p as typeof p & { logoUrl?: string }).logoUrl ?? undefined,
          leaderName: p.leaderName,
          foundedYear: p.foundedYear,
          ideology: p.ideology,
          previousSeats: p.previousSeats ?? 0,
          website: p.website ?? undefined,
          programUrl: row.programUrl ?? undefined,
          description: p.description,
        },
      });
    })
  );
  console.log(`  Created ${partyRecords.length} parties.`);

  // 2. Create policy comparisons (150+)
  let orderIndex = 0;
  const policyMeta: { id: string; catIdx: number; qIdx: number; orderIndex: number }[] = [];
  let catIdx = 0;
  for (const cat of policyStatements) {
    for (let qIdx = 0; qIdx < cat.questions.length; qIdx++) {
      const rec = await prisma.policyComparison.create({
        data: { category: cat.category, question: cat.questions[qIdx], orderIndex: orderIndex++ },
      });
      policyMeta.push({ id: rec.id, catIdx, qIdx, orderIndex: rec.orderIndex });
    }
    catIdx++;
  }
  console.log(`  Created ${policyMeta.length} policy comparison statements.`);

  // 3. Create party policy stances (batch)
  const stanceData: { partyId: string; policyId: string; value: boolean | null }[] = [];
  for (const party of partyRecords) {
    for (const meta of policyMeta) {
      const value = getStanceForParty(party.slug, meta.catIdx, meta.qIdx, meta.orderIndex);
      stanceData.push({ partyId: party.id, policyId: meta.id, value });
    }
  }
  await prisma.partyPolicyStance.createMany({ data: stanceData });
  console.log(`  Created ${stanceData.length} party policy stances.`);

  // 4. Party program placeholders (one section per party)
  for (const party of partyRecords) {
    const pData = parties.find((p) => p.slug === party.slug) as (typeof parties)[0] & { programUrl?: string };
    const programLink = pData?.programUrl
      ? `\n\n**Uradni program:** [Povezava do programa](${pData.programUrl})`
      : "";
    await prisma.partyProgram.create({
      data: {
        partyId: party.id,
        sectionTitle: "Program stranke",
        content: programLink
          ? `Stranka ima uradni program na voljo na spodnji povezavi.${programLink}`
          : `[Program za stranko **${party.name}** še ni vnešen. Dodajte URL programa ali vsebino ročno.]`,
        orderIndex: 0,
      },
    });
  }
  console.log("  Created party program placeholders.");

  // 5. National segments and needs
  for (const seg of nationalSegments) {
    const created = await prisma.nationalSegment.create({
      data: {
        name: seg.name,
        slug: seg.slug,
        icon: seg.icon,
        description: seg.description,
        orderIndex: seg.orderIndex,
      },
    });
    const needs = nationalNeedsBySegment[seg.slug];
    if (needs) {
      for (let i = 0; i < needs.length; i++) {
        await prisma.nationalNeed.create({
          data: {
            segmentId: created.id,
            title: needs[i].title,
            description: needs[i].description,
            priority: needs[i].priority,
            orderIndex: i,
          },
        });
      }
    }
  }
  console.log(`  Created ${nationalSegments.length} national segments with needs.`);

  // 6. Site settings
  const settings = [
    {
      key: "disclaimer",
      value:
        "Povzetki temeljijo na javno dostopnih programih, statutih in drugih uradnih virih političnih strank. Vsebina je pripravljena z avtomatizirano obdelavo, zato so možne poenostavitve ali nenamerne netočnosti. Stran ni uradni predstavnik nobene stranke in ne izraža njihovih stališč; namen je zgolj informiranje, ne politično nagovarjanje. Za popolno in zavezujočo razlago vedno preverite izvirne dokumente.",
    },
    {
      key: "beta_note",
      value:
        "Aplikacija je v verziji 0.0.1 (beta). Vsi obiskovalci trenutno nastopajo kot preizkuševalci; aplikacija gostuje na Vercelu, vsebine so povzete s pomočjo Claude AI, uredniški del pa je pripravljen v Cursor/Vibe Coding. Hvala za razumevanje.",
    },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("  Created site settings.");

  // 7. Poll data (realistic placeholder - "vzorčni podatki")
  const pollDate = new Date("2026-02-01");
  const samplePercentages = [24, 22, 18, 12, 6, 4, 3, 2.5, 2, 1.8, 1.5, 1.2]; // sum ~97
  for (let i = 0; i < partyRecords.length; i++) {
    await prisma.pollData.create({
      data: {
        partyId: partyRecords[i].id,
        percentage: samplePercentages[i] ?? 1,
        pollSource: "Vzorčni podatki (placeholder)",
        pollDate,
        sampleSize: 1000,
      },
    });
  }
  console.log("  Created poll data (placeholder).");

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
