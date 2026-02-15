# 🇸🇮 Slovenija prihodnosti

Državljanska platforma za primerjavo strank in programov na **državnozborskih volitvah v Sloveniji 2026**.

## Tech stack

- **Next.js 14+** (App Router), **TypeScript**, **Tailwind CSS**
- **PostgreSQL** + **Prisma ORM**
- **Recharts** za grafe, **Lucide** ikone
- Pisava: **Playfair Display** (logotip), **DM Sans** (besedilo)

## Zahteve

- Node.js 20+
- PostgreSQL (lokalna namestitev)
- npm ali yarn

## Nastavitev

### 1. Odvisnosti

```bash
npm install
```

### 2. Baza podatkov

Ustvarite PostgreSQL bazo z imenom `slovenija_prihodnosti`:

```bash
# Z ukazno vrstico psql (ali pgAdmin):
createdb slovenija_prihodnosti

# ali v psql:
# CREATE DATABASE slovenija_prihodnosti;
```

### 3. Spremenljivke okolja

Kopirajte primer in nastavite povezavo do baze:

```bash
cp .env.example .env
```

V `.env` nastavite (prilagodite gostitelj/uporabnik/geslo):

```
DATABASE_URL="postgresql://localhost:5432/slovenija_prihodnosti?schema=public"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_SESSION_SECRET="min-16-char-secret-for-signing-session"
```

`ADMIN_PASSWORD` in `ADMIN_SESSION_SECRET` sta potrebna za stran **Admin** (odobritev predlogov na Kaj potrebujemo).

### 4. Shema in seed

Ustvari tabele in zagnaj seed (vsi podatki):

```bash
npm run db:push
npm run db:seed
```

Za ponastavitev baze in ponovni seed:

```bash
npm run db:reset
```

### 5. Zagon aplikacije

```bash
npm run dev
```

Odprite [http://localhost:3000](http://localhost:3000).

## Struktura

- **/** – Domov: anketa, povzetek strank
- **/primerjava** – Primerjava strank (matrika stališč, pritrjen prvi stolpec)
- **/stranke** – Seznam strank
- **/stranke/[slug]** – Podrobnosti stranke (enoten predlog za vse)
- **/kaj-potrebujemo** – Segmenti (zdravstvo, šolstvo, finance …) s potrebami; obrazec za predloge obiskovalcev (odobritev prek admina)
- **/admin** – Admin nadzor: odobritev/zavrnitev predlogov (zahtevana prijava)
- **/admin/login** – Prijava administratorja
- **/platforma** – Placeholder (v pripravi)

## Viri podatkov

- [Liste kandidatov 2026 (Wikipedia)](https://sl.wikipedia.org/wiki/Liste_kandidatov_za_državnozborske_volitve_v_Sloveniji_2026)
- Anketni podatki na domači strani so označeni kot vzorčni, dokler niso vneseni pravi podatki.

## Opombe

- Vsa besedila so v slovenščini.
- Stališča strank v primerjavi so delno iz raziskav, delno označena kot »ni podatka« (?).
- Programi strank: če programa ni v bazi, je prikazan placeholder z navodili za dodajanje.

## Skripte

| Ukaz | Opis |
|------|------|
| `npm run dev` | Razvojni strežnik |
| `npm run build` | Production build |
| `npm run db:push` | Posodobi shemo v bazi (brez migracij) |
| `npm run db:seed` | Zagon seed skripte |
| `npm run db:reset` | Force reset baze + seed |
