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

**Testikattavuus:** 36 testiä (13 yksikkötestiä, 23 integraatiotestiä)

- **Business logic -testit** (`business-logic.test.ts`): Testaavat liiketoimintalogiikkaa (aika-validointi, päällekkäisyydet)
- **API-integraatiotestit** (`routes.test.ts`): Testaavat koko HTTP-flow:ta (reititys, validointi, virhekäsittely)

## API-dokumentaatio

### 1. Luo varaus

**POST** `/rooms/:roomId/bookings`

Luo uuden varauksen tietylle huoneelle.

**Parametrit:**
- `roomId` (string): Huoneen tunnus (A, B tai C)

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
  - Zod-validointivirheet sisältävät `details`-kentän, joka listaa virheelliset kentät
- `404 Not Found` - Tuntematon huone
- `409 Conflict` - Varaus menee päällekkäin olemassa olevan varauksen kanssa

### 2. Hae huoneen varaukset

**GET** `/rooms/:roomId/bookings`

Hakee kaikki tietyn huoneen varaukset.

**Parametrit:**
- `roomId` (string): Huoneen tunnus (A, B tai C)

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

Kaikki virheet noudattavat yhtenäistä `ErrorResponse`-rakennetta:

### Perusmuoto

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Booking cannot be in the past"
}
```

### Zod-validointivirheet (sisältää details-kentän)

Kun request body -validointi epäonnistuu, vastaus sisältää `details`-kentän, joka listaa kaikki virheelliset kentät:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request body",
  "details": [
    {
      "field": "start",
      "message": "Invalid datetime"
    }
  ]
}
```

Tämä auttaa frontend-kehittäjiä näyttämään kentäkohtaisia virheviestejä lomakkeissa.

### Odottamattomat virheet (500)

Kaikki odottamattomat virheet käsitellään globaalilla error handlerilla:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

Virheet logitetaan palvelimen puolella, mutta stack trace ei vuoda asiakkaalle.

## HTTP-statuskoodit

- `200 OK` - Onnistunut GET-pyyntö
- `201 Created` - Varaus luotu onnistuneesti
- `204 No Content` - Varaus poistettu onnistuneesti
- `400 Bad Request` - Virheellinen pyyntö (esim. menneisyys, virheellinen aikamuoto)
- `404 Not Found` - Resurssia ei löydy (tuntematon huone tai varaus)
- `409 Conflict` - Päällekkäinen varaus
- `500 Internal Server Error` - Odottamaton palvelinvirhe

## Huoneet

Käytössä on kiinteä huonelista: **A**, **B**, **C**

Mikä tahansa muu huonetunnus palauttaa `404 Not Found`.

## Aikaleimat

- Aikaleimat ovat ISO-8601-muodossa (esim. `2026-02-01T10:00:00Z`)
- Käsittely tapahtuu UTC-aikana
- Zod validoi automaattisesti aikaleiman muodon

## Projektin rakenne

```
src/
├── index.ts              # Sovelluksen käynnistyspiste
├── server.ts             # Fastify-palvelimen rakentaminen + globaali error handler
├── routes.ts             # API-reitit, preHandler-hookit ja käsittelijät
├── types.ts              # TypeScript-tyyppimäärittelyt (Booking, ErrorResponse)
├── validation.ts         # Zod-validointischeemat
├── store.ts              # In-memory data store (Map-pohjainen)
├── business-logic.ts     # Liiketoimintalogiikka ja validoinnit
├── business-logic.test.ts # Yksikkötestit (13 testiä)
└── routes.test.ts        # Integraatiotestit (23 testiä)
```

## Arkkitehtuuri

Projekti noudattaa **kerrosarkkitehtuuria** (layered architecture):

1. **Presentation Layer** (`routes.ts`, `server.ts`)
   - HTTP-pyyntöjen käsittely
   - Zod-validointi (request body, URL-parametrit)
   - Virheenkäsittely ja HTTP-statuskoodi -mappaus
   - Fastify preHandler -hookit (DRY-periaate)

2. **Domain Layer** (`business-logic.ts`)
   - Liiketoimintasäännöt (overlap-tarkistus, aika-validointi)
   - Domain-virheet (`BookingError`)
   - HTTP-riippumaton logiikka

3. **Data Layer** (`store.ts`)
   - CRUD-operaatiot
   - In-memory Map-pohjainen tallennusratkaisu
   - Ei liiketoimintalogiikkaa

## Ominaisuudet

### Virheenkäsittely
-  Yhtenäinen `ErrorResponse`-muoto kaikille virheille
-  Zod-validointivirheet sisältävät `details`-kentän (kehittäjäystävällinen)
-  Globaali error handler (500 Internal Server Error)
-  Virheet logitetaan, mutta stack tracet eivät vuoda

### Validointi
-  Zod-scheemat runtime-validointiin
-  TypeScript type-safety
-  Fastify preHandler -hookit (roomId, bookingId)
-  ISO-8601 datetime-validointi

### Testaus
-  36 testiä (100% kriittisten polkujen kattavuus)
-  Yksikkötestit domain-logiikalle
-  Integraatiotestit API-reiteille
-  Edge case -testit (adjacent bookings, overlap-skenaariot)

## Tunnetut rajoitukset

- **Race conditions**: In-memory store ei käsittele samanaikaisia pyyntöjä lukituksilla. Single-threaded Node.js-ympäristössä tämä ei ole ongelma, mutta jos siirtyisit tietokantaan ja useaan instanssiin, tarvittaisiin transaktioita tai lukituksia.
- **Datan pysyvyys**: Kaikki data katoaa palvelimen uudelleenkäynnistyksessä (in-memory store).
- **Skaalautuvuus**: Single-instance deployment. Horizontal scaling vaatisi jaetun tilan (Redis, PostgreSQL, jne.).
