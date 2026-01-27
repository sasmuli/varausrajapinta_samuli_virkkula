# Kokoushuone API

REST API kokoushuoneiden varauksille, toteutettu Node.js + TypeScript + Fastify -arkkitehtuurilla.

## Teknologiat

- **Node.js** – ajoympäristö
- **TypeScript** – pääkieli
- **Fastify** – HTTP-palvelin ja reititys
- **Zod** – request-validointi ja skeemat
- **Vitest** – testaus (unit- ja integraatiotestit)
- **In-memory data store** – ei ulkoista tietokantaa

## Asennus

```bash
npm install
```

## Käynnistys

### Kehitystila (hot reload)

```bash
npm run dev
```

### Tuotanto

```bash
npm run build
npm start
```

Palvelin käynnistyy oletuksena osoitteeseen `http://localhost:3000`

## Testit

```bash
# Aja testit kerran
npm test

# Aja testit watch-tilassa
npm run test:watch
```

## API-dokumentaatio

### 1. Luo varaus

**POST** `/rooms/:roomId/bookings`

Luo uuden varauksen tietylle huoneelle.

**Parametrit:**
- `roomId` (string): Huoneen tunnus (A, B, C, D tai E)

**Request body:**
```json
{
  "start": "2026-02-01T10:00:00Z",
  "end": "2026-02-01T11:00:00Z"
}
```

**Onnistunut vastaus (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "roomId": "A",
  "start": "2026-02-01T10:00:00Z",
  "end": "2026-02-01T11:00:00Z"
}
```

**Esimerkkikutsu:**
```bash
curl -X POST http://localhost:3000/rooms/A/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "start": "2026-02-01T10:00:00Z",
    "end": "2026-02-01T11:00:00Z"
  }'
```

**Virhetilanteet:**
- `400 Bad Request` - Virheellinen aikamuoto, varaus menneisyydessä tai aloitusaika >= lopetusaika
- `404 Not Found` - Tuntematon huone
- `409 Conflict` - Varaus menee päällekkäin olemassa olevan varauksen kanssa

### 2. Hae huoneen varaukset

**GET** `/rooms/:roomId/bookings`

Hakee kaikki tietyn huoneen varaukset.

**Parametrit:**
- `roomId` (string): Huoneen tunnus (A, B, C, D tai E)

**Onnistunut vastaus (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "roomId": "A",
    "start": "2026-02-01T10:00:00Z",
    "end": "2026-02-01T11:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "roomId": "A",
    "start": "2026-02-01T14:00:00Z",
    "end": "2026-02-01T15:00:00Z"
  }
]
```

**Esimerkkikutsu:**
```bash
curl http://localhost:3000/rooms/A/bookings
```

**Virhetilanteet:**
- `404 Not Found` - Tuntematon huone

### 3. Poista varaus

**DELETE** `/bookings/:bookingId`

Poistaa olemassa olevan varauksen.

**Parametrit:**
- `bookingId` (string): Varauksen UUID-tunnus

**Onnistunut vastaus (204 No Content):**
Tyhjä vastaus

**Esimerkkikutsu:**
```bash
curl -X DELETE http://localhost:3000/bookings/550e8400-e29b-41d4-a716-446655440000
```

**Virhetilanteet:**
- `404 Not Found` - Varausta ei löydy tai virheellinen ID-muoto

## Business Rules

1. **Ei päällekkäisiä varauksia**: Varaukset eivät saa mennä päällekkäin samassa huoneessa
2. **Ei menneisyyttä**: Varaus ei saa olla menneisyydessä
3. **Aloitus ennen lopetusta**: Aloitusajan täytyy olla ennen lopetusaikaa
4. **Adjacent varaukset sallittu**: Varaus, jossa `end === nextStart`, on sallittu (ei päällekkäisyyttä)

## Virhevastauksien muoto

Kaikki virheet palauttavat yhtenäisen muodon:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Booking cannot be in the past"
}
```

## HTTP-statuskoodit

- `200 OK` - Onnistunut GET-pyyntö
- `201 Created` - Varaus luotu onnistuneesti
- `204 No Content` - Varaus poistettu onnistuneesti
- `400 Bad Request` - Virheellinen pyyntö (esim. menneisyys, virheellinen aikamuoto)
- `404 Not Found` - Resurssia ei löydy (tuntematon huone tai varaus)
- `409 Conflict` - Päällekkäinen varaus

## Huoneet

Käytössä on kiinteä huonelista: **A**, **B**, **C**, **D**, **E**

Mikä tahansa muu huonetunnus palauttaa `404 Not Found`.

## Aikaleimat

- Aikaleimat ovat ISO-8601-muodossa (esim. `2026-02-01T10:00:00Z`)
- Käsittely tapahtuu UTC-aikana
- Zod validoi automaattisesti aikaleiman muodon

## Projektin rakenne

```
src/
├── index.ts              # Sovelluksen käynnistyspiste
├── server.ts             # Fastify-palvelimen rakentaminen
├── routes.ts             # API-reitit ja käsittelijät
├── types.ts              # TypeScript-tyyppimäärittelyt
├── validation.ts         # Zod-validointischeemat
├── store.ts              # In-memory data store
├── business-logic.ts     # Liiketoimintalogiikka ja validoinnit
├── business-logic.test.ts # Business logic -testit
└── routes.test.ts        # API-reittien integraatiotestit
```
