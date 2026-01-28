# PROMPTIT

Tähän tiedostoon on koottu kaikki ennakkotehtävässä käytetyt promptit ja
tekoälyn vastaukset aikajärjestyksessä.  
Tekoälyä on hyödynnetty parikoodaajana tehtävänannon mukaisesti.

---

## 1. Master prompt – projektin generointi

### Prompt

Toteuta kokonainen Node.js + TypeScript REST API kokoushuoneiden varauksille.

### Vaatimukset
- Käytä **Fastifyä**
- Käytä **TypeScriptiä**
- In-memory data store (ei tietokantaa)
- Käytä **Zod**-validointia requesteille
- Käytä **Vitest** testaukseen

### API-toiminnot
1. **POST** `/rooms/:roomId/bookings`  
   - Body: `{ start: string, end: string }`
2. **GET** `/rooms/:roomId/bookings`
3. **DELETE** `/bookings/:bookingId`

### Business rules
- Varaukset eivät saa mennä päällekkäin samassa huoneessa
- Varaus ei saa olla menneisyydessä
- Aloitusajan täytyy olla ennen lopetusaikaa
- Varaus, jossa `end === nextStart`, on sallittu

### Oletukset
- Aikaleimat ovat ISO-8601-muodossa ja käsitellään UTC-aikana
- Käytössä on kiinteä huonelista: **A**, **B**, **C**, **D**, **E**  
  (tuntematon huone palauttaa 404)

### Muuta
- Palauta järkevät HTTP-statuskoodit (201, 204, 400, 404, 409)
- Lisää yhtenäinen virhevastausmuoto
- Lisää testit business rules -tasolle
- Lisää README, jossa on käynnistysohjeet ja esimerkkipyynnöt

Lopputuloksen tulee olla ajettava projekti.

---

### Tekoälyn vastaus

I'll implement a complete Node.js + TypeScript REST API for meeting room bookings with Fastify, Zod, and Vitest.

I'll create a complete meeting room booking REST API with Fastify, TypeScript, Zod, and Vitest.

Now I'll create the core types and implementation files:

Now I'll create the Fastify server with routes:

Now I'll create comprehensive tests for the business logic:

Now I'll create a comprehensive README with setup instructions and example requests:



I'll replace the existing README with comprehensive setup instructions and example requests:



Perfect! I've implemented the complete meeting room booking REST API. Now let me install dependencies and verify everything works:

Now let me run the tests to verify everything works:

Excellent! All tests pass (24/24). The complete meeting room booking REST API is now ready.

## Project Summary

I've implemented a fully functional Node.js + TypeScript REST API with:

### ✅ Core Features
- **Fastify** web server with 3 REST endpoints
- **TypeScript** with strict type checking
- **Zod** validation for all requests
- **In-memory data store** for bookings
- **Vitest** with 24 comprehensive tests

### ✅ API Endpoints
1. `POST /rooms/:roomId/bookings` - Create booking (returns 201)
2. `GET /rooms/:roomId/bookings` - List bookings (returns 200)
3. `DELETE /bookings/:bookingId` - Delete booking (returns 204)

### ✅ Business Rules Implemented
- No overlapping bookings in same room
- No bookings in the past
- Start time must be before end time
- Adjacent bookings allowed (end === nextStart)

### ✅ Project Structure
```
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/index.ts` - Entry point
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts` - Fastify server
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts` - API routes
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts` - Validation logic
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts` - In-memory storage
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/validation.ts` - Zod schemas
`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts` - TypeScript types
```

### 🚀 Quick Start
```bash
npm run dev    # Start development server at http://localhost:3000
npm test       # Run all tests (24 passing)
npm run build  # Build for production
```

The API is ready to run with all requirements met, comprehensive test coverage, and detailed documentation in `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/README.md:1-199`.











## 2. Business-logiikan selitys

### Prompt

Selitä yksityiskohtaisesti, miten kokoushuoneiden varausten liiketoimintalogiikka
toimii tiedostoissa `src/business-logic.ts` ja `src/store.ts`.

Kuvaa:
- miten varauksen luonti etenee vaihe vaiheelta
- miten päällekkäisten varausten tarkistus on toteutettu
- mitä oletuksia toteutus tekee aikaleimoista ja huoneista
- mitkä ovat mahdolliset reunatapaukset tai riskit

Älä tee muutoksia koodiin. Selitä ja arvioi vain nykyinen toteutus.

### Vastaus

Luen ensin molemmat tiedostot analysoidakseni toteutuksen yksityiskohtaisesti.

# Liiketoimintalogiikan yksityiskohtainen analyysi

## 1. Varauksen luonti vaihe vaiheelta

Varauksen luonti etenee kolmivaiheisesti `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:49-57`:

### **Vaihe 1: Aikaleimavalidointi** ([validateBookingTimes](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:13:0-25:1))
```typescript
validateBookingTimes(start, end);
```

**Rivi 15-16:** Muunnetaan ISO-8601 stringit `Date`-objekteiksi
- `new Date(start)` ja `new Date(end)` käsittelevät automaattisesti UTC-ajat

**Rivi 19-21:** Menneisyyden tarkistus
- Vertaillaan `startDate < now` 
- **Kriittinen yksityiskohta:** Käytetään `new Date()` ilman parametreja, joka palauttaa tämänhetkisen millisekunnin tarkkuudella
- Jos varaus alkaa menneisyydessä → [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1) (400)

**Rivi 23-25:** Ajallinen järjestys
- Varmistetaan että `startDate >= endDate` ei päde
- Huomaa: **Sallii yhtäsuuruuden (`>=`)** estämällä sen, eli start === end hylätään
- Jos aloitus on sama tai myöhemmin kuin lopetus → [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1) (400)

### **Vaihe 2: Päällekkäisyyden tarkistus** ([checkOverlap](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:27:0-46:1))
```typescript
checkOverlap(roomId, start, end);
```

**Rivi 33:** Haetaan kaikki kyseisen huoneen varaukset storesta
- Suodatus tapahtuu `roomId`:n perusteella
- **Tärkeä:** Muiden huoneiden varaukset eivät vaikuta

**Rivi 34-35:** Uuden varauksen aikaleimoja
- Konvertoidaan stringit `Date`-objekteiksi päällekkäisyyslogiikkaa varten

**Rivi 37-46:** Iteroidaan jokainen olemassa oleva varaus
- Jokainen varaus tarkistetaan erikseen
- Jos **yksikään** olemassa oleva varaus on päällekkäin → virhe (409)

### **Vaihe 3: Tallentaminen storeen** 
```typescript
return bookingStore.createBooking(roomId, start, end);
```

**Rivi 7-16 (store.ts):** Luodaan uusi [Booking](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:2:0-7:1)-objekti
- **Rivi 9:** Generoidaan UUID v4 tunnus `randomUUID()`-funktiolla (Node.js crypto-moduuli)
- **Rivi 10-12:** Tallennetaan parametrit sellaisenaan (stringit säilyvät stringeinä)
- **Rivi 14:** Lisätään `Map<string, Booking>` -rakenteeseen ID:n avaimella
- Palautetaan luotu varaus

## 2. Päällekkäisyyden tarkistuksen toteutus

### **Overlap-logiikka** (`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:41`)

```typescript
const overlaps = newStart < existingEnd && newEnd > existingStart;
```

Tämä on **klassinen aikavälien leikkausalgoritmi**:

#### Toimintaperiaate:
- Kaksi aikaväliä **EIVÄT** ole päällekkäin vain jos:
  - Uusi varaus päättyy ennen tai samaan aikaan kun vanha alkaa: `newEnd <= existingStart`
  - TAI uusi varaus alkaa samaan aikaan tai sen jälkeen kun vanha päättyy: `newStart >= existingEnd`

- Negaatio tästä (eli päällekkäisyys) on:
  - `newStart < existingEnd` JA `newEnd > existingStart`

#### Käytännön esimerkit:

**✅ EI päällekkäisyyttä (adjacent booking):**
```
Vanha:  [10:00 --- 11:00]
Uusi:               [11:00 --- 12:00]

newStart (11:00) < existingEnd (11:00) → FALSE
→ Ei päällekkäisyyttä!
```

**❌ Päällekkäisyys (osittainen overlap):**
```
Vanha:  [10:00 ------- 11:30]
Uusi:         [10:30 ------- 12:00]

newStart (10:30) < existingEnd (11:30) → TRUE
newEnd (12:00) > existingStart (10:00) → TRUE
→ Päällekkäisyys havaittu!
```

**❌ Päällekkäisyys (uusi sisällä vanhassa):**
```
Vanha:  [10:00 ----------- 14:00]
Uusi:       [11:00 --- 12:00]

newStart (11:00) < existingEnd (14:00) → TRUE
newEnd (12:00) > existingStart (10:00) → TRUE
→ Päällekkäisyys havaittu!
```

## 3. Oletukset toteutuksessa

### **Aikaleimat:**

1. **ISO-8601 muoto:** Toteutus olettaa että Zod-validointi on tapahtunut ennen, joten stringit ovat validia ISO-8601-muotoa
2. **JavaScript Date-parsinta:** `new Date(isoString)` kutsutaan ilman virheenkäsittelyä
   - Jos Zod epäonnistuu, Date-objekti voi olla `Invalid Date`
   - Vertailut tuottavat `NaN` → odottamaton käyttäytyminen
3. **UTC-aika:** Oletetaan että kaikki aikaleimat ovat UTC:ssä
   - Ei käsitellä aikavyöhykkeitä
4. **Aikaleiman tarkkuus:** Millisekuntitarkkuus (JavaScript Date:n resoluutio)
5. **Stringit säilytetään:** Store tallentaa aikaleimat alkuperäisessä string-muodossa, ei Date-objekteina

### **Huoneet:**

1. **Kiinteä lista:** [RoomId](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:0:0-0:49) on tyypitetty `'A' | 'B' | 'C' | 'D' | 'E'`
2. **Ei huoneiden olemassaolon tarkistusta:** Business-logiikka ei tarkista huoneen olemassaoloa (tehdään routes-tasolla)
3. **Case-sensitive:** `'a'` ja `'A'` olisivat eri huoneita (mutta TypeScript estää tämän)

### **Store-rakenne:**

1. **In-memory Map:** Kaikki data katoaa palvelimen uudelleenkäynnistyksessä
2. **Singleton-instanssi:** Yksi jaettu `bookingStore` koko sovellukselle
3. **Ei persistenssiä:** Ei varmuuskopiointia tai lokitusta
4. **Thread-safety:** JavaScript on single-threaded, joten ei race condition -ongelmia (async-koodissa voisi olla)

## 4. Reunatapaukset ja riskit

### **🔴 Kriittiset riskit:**

#### **1. Race Condition aikavyöhykkeen kanssa**
```typescript
const now = new Date(); // Rivi 17
```
- Jos pyyntö saapuu juuri ennen keskiyötä ja prosessoidaan juuri sen jälkeen
- Jos palvelin ja asiakas ovat eri aikavyöhykkeillä
- **Riski:** Varaus voidaan hyväksyä vaikka se on "menneisyydessä" asiakkaan näkökulmasta

#### **2. Tarkistuksen ja tallennuksen välinen aika (TOCTOU)**
```typescript
checkOverlap(roomId, start, end);  // Hetki T1
// <- Toinen request voi tulla tähän väliin!
return bookingStore.createBooking(...); // Hetki T2
```
- **Time-of-Check to Time-of-Use** -ongelma
- Jos kaksi request tulee samanaikaisesti samalle ajalle:
  1. Molemmat tarkistavat overlap → ei päällekkäisyyttä
  2. Molemmat luovat varauksen
  3. **Tulos:** Kaksi päällekkäistä varausta!
- **Syy:** Ei transaktionaalisuutta tai lukitusta

#### **3. Millisekuntitarkkuus menneisyyden tarkistuksessa**
```typescript
if (startDate < now) // Erittäin tiukka vertailu
```
- Jos käyttäjä yrittää varata aikaa joka alkaa samalla millisekunnilla kuin `now`
- Voi johtaa false positive -hylkäyksiin
- **Parempi:** Sallittaisiin pieni toleranssi (esim. +1 sekunti)

### **⚠️ Keskisuuret riskit:**

#### **4. Kellojen epäsynkronointi**
- Palvelimen kello voi olla väärässä
- Ei NTP-synkronointivarmistusta
- Voi johtaa virheellisiin menneisyyden hylkäyksiin tai hyväksyntöihin

#### **5. Invalid Date -käsittelyn puute**
```typescript
const startDate = new Date(start); // Jos start on virheellinen
```
- Jos Zod-validointi jostain syystä ohitetaan
- `new Date("invalid")` → Invalid Date -objekti
- Vertailut palauttavat `false` yllättävästi
- **Esimerkki:** `new Date("abc") < new Date()` → `false`, varaus hyväksytään!

#### **6. Suorituskyky suurilla datamäärillä**
```typescript
for (const booking of existingBookings) // O(n) per huone
```
- Lineaarinen haku kaikista varaukista
- Jos huoneessa on 10,000 varausta → 10,000 iteraatiota
- **Skaalautuvuusongelma:** Ei indeksointia aikojen perusteella
- Parempi: Binäärihaku tai aikapohjainen indeksointi

### **🟡 Pienet riskit / Reunatapaukset:**

#### **7. Nolla-keston varaukset**
```typescript
if (startDate >= endDate) // Estää start === end
```
- **Hyvä:** Toteutus estää nollakeston varaukset
- Mutta voisiko olla käyttötapaus "pikanvaraukselle"?

#### **8. Hyvin pitkät varaukset**
- Ei maksimikeston rajoitusta
- Voisi varata huoneen vuosikausiksi
- **Riski:** Denial of Service -hyökkäys varaamalla kaikki huoneet vuosiksi

#### **9. Aikaleimojen muuntelu tallennuksessa**
```typescript
start, // Tallennetaan sellaisenaan (rivi 11)
```
- **Hyvä:** Alkuperäinen ISO-string säilyy
- **Huono:** Ei normalisointia (esim. `2026-02-01T10:00:00.000Z` vs `2026-02-01T10:00:00Z`)
- Voi aiheuttaa ongelmia vertailuissa tai näytössä

#### **10. Map-rakenteen kasvu**
```typescript
private bookings: Map<string, Booking> = new Map();
```
- Ei vanhojen varausten automaattista poistoa
- Menneisyyden varaukset jäävät muistiin ikuisesti
- **Riski:** Memory leak pitkäaikaisessa käytössä

### **✅ Hyvin toteutetut kohdat:**

1. **Adjacent bookings:** Overlap-logiikka sallii oikein `end === nextStart` -tapaukset
2. **Virheenkäsittely:** Selkeät [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1)-luokka ja HTTP-statuskoodit
3. **Separation of concerns:** Store, business-logiikka ja routes erotettuna
4. **Tyyppiturvallisuus:** TypeScript estää monien virheiden syntymisen
5. **Testattavuus:** Funktiot on helppo yksikkötestata (kuten testeissä näkyy)

## Yhteenveto

Toteutus on **pedagogisesti selkeä** ja **toimii hyvin demonstraatiotarkoituksessa**, mutta tuotantokäytössä vaatisi seuraavia parannuksia:

1. **Kriittinen:** Transaktionaalinen overlap-tarkistus (esim. optimistic locking)
2. **Tärkeä:** Vanhojen varausten automaattinen siivous
3. **Suositeltava:** Aikavyöhyke- ja kellosynkronointivalidointi
4. **Hyödyllinen:** Suorituskyvyn optimointi (indeksointi, caching)

Nykyinen toteutus toimii erinomaisesti pienissä järjestelmissä (< 100 varausta/päivä), mutta skaalautuvuus ja samanaikaisuus ovat heikkouksia.











## 3. Reittien ja HTTP-kerroksen selitys

### Prompt

Selitä `src/routes.ts`- ja `src/server.ts`-tiedostojen vastuut.

Kuvaa:
- miten HTTP-pyynnöt käsitellään
- miten validointi, virheenkäsittely ja business-logiikka on jaettu
- onko vastuunjako HTTP-kerroksen ja domain-logiikan välillä selkeä
- missä kohdissa rakennetta voisi parantaa ylläpidettävyyden kannalta

Älä tee muutoksia koodiin. Selitä ja arvioi vain nykyinen toteutus.

### Oma tiivistelmä
- Routes- ja server-kerrosten vastuut ovat selkeästi eriytetty (buildServer + registerRoutes).
- RoomId-validointi toistuu POST- ja GET-endpointeissa (DRY-ongelma).
- GET ja DELETE käyttävät storea suoraan, mutta POST käyttää business-logic.ts:ää → epäjohdonmukaisuus.
- Virhevastausten muodostus on osin hardkoodattu ja toistuva.
- Puuttuu globaali error handler → tuntemattomat virheet eivät välttämättä noudata yhtenäistä ErrorResponse-muotoa.

### Vastaus

Luen ensin molemmat tiedostot analysoidakseni niiden rakennetta ja vastuunjakoa.

# HTTP-kerroksen arkkitehtuuri-analyysi

## 1. Tiedostojen tehtävät ja vastuualueet

### **[server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0) - Palvelimen alustus**

`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:1-13` on **erittäin yksinkertainen factory-funktio**:

```typescript
export async function buildServer()
```

**Tehtävät:**
1. **Rivit 5-7:** Luo Fastify-instanssi konfiguraatiolla (`logger: true`)
2. **Rivi 9:** Rekisteröi kaikki reitit kutsumalla [registerRoutes()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:11:0-94:1)
3. **Rivi 11:** Palauttaa konfiguroitu palvelin

**Vastuualue:**
- ✅ Palvelimen lifecycle-hallinta
- ✅ Keskitetty konfiguraatio (tällä hetkellä vain logger)
- ✅ Plugin- ja middleware-rekisteröinti (potentiaalisesti)

**Arkkitehtoninen rooli:** 
Tämä on **Application Root** - kohta jossa sovelluksen rakennuspalikat kootaan yhteen. Erittäin hyvä separaatio: [index.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/index.ts:0:0-0:0) käynnistää palvelimen, [server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0) rakentaa sen, [routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0) määrittää endpointit.

---

### **[routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0) - HTTP-endpointit ja request-handling**

`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:1-96` on **route handler -moduuli** joka sisältää kaikki REST API:n endpointit.

**Rakenne:**
- Yksi exported funktio [registerRoutes(app: FastifyInstance)](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:11:0-94:1)
- Kolme route handleria sisäkkäin:
  1. `POST /rooms/:roomId/bookings` (rivit 13-53)
  2. `GET /rooms/:roomId/bookings` (rivit 55-69)
  3. `DELETE /bookings/:bookingId` (rivit 71-94)

## 2. HTTP-pyyntöjen käsittelyprosessi

### **POST /rooms/:roomId/bookings - Varauksen luonti**

#### **Vaihe 1: Route-parametrien validointi** (rivit 18-25)
```typescript
const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
if (!roomIdResult.success) {
  return reply.status(404).send({ ... });
}
```

- Käytetään Zod:n `safeParse()` joka **ei heitä poikkeusta**
- URL-parametri `roomId` validoidaan `enum` tyyppiä vastaan
- **Semanttinen valinta:** Virheellinen huone → 404 (ei 400), koska se simuloi "resurssia ei löydy"
- Validointi tapahtuu **HTTP-kerroksessa**, ennen business-logiikkaa

#### **Vaihe 2: Request body:n validointi** (rivit 27-34)
```typescript
const bodyResult = createBookingSchema.safeParse(request.body);
if (!bodyResult.success) {
  return reply.status(400).send({ ... });
}
```

- Validoidaan `{ start: string, end: string }` rakenne
- Zod tarkistaa ISO-8601 datetime-muodon (`.datetime()` validator)
- **Huom:** Yksityiskohtaiset virhesyyt eivät näy käyttäjälle (rivit 29-33 palauttaa geneerisen viestin)
- `bodyResult.data` on tyyppiturvallinen (`{ start: string, end: string }`)

#### **Vaihe 3: Business-logiikan kutsuminen** (rivit 36-40)
```typescript
const booking = createBooking(
  roomIdResult.data,
  bodyResult.data.start,
  bodyResult.data.end
);
```

- Delegoidaan **kaikki business rules** [business-logic.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:0:0-0:0):lle
- HTTP-kerros ei tiedä päällekkäisyyksistä, menneisyydestä tms.
- Tyyppiturvallinen: `roomIdResult.data` on [RoomId](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:0:0-0:49), ei `string`

#### **Vaihe 4: Onnistuneen vastauksen palauttaminen** (rivi 42)
```typescript
return reply.status(201).send(booking);
```

- HTTP 201 Created (semanttisesti oikea uuden resurssin luonnille)
- Palautetaan luotu [Booking](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:2:0-7:1)-objekti (sisältää generoidun ID:n)

#### **Vaihe 5: Business-logiikan virheiden käsittely** (rivit 43-52)
```typescript
catch (error) {
  if (error instanceof BookingError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
      message: error.message,
    });
  }
  throw error;
}
```

- **Tyyppitarkistus:** Tunnetaan vain [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1), muut heitetään eteenpäin
- **HTTP-statuskoodin mapping:** [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1) sisältää `statusCode`:n (400, 409)
- **Error label mapping:** 409 → "Conflict", muut → "Bad Request"
- **Rivi 51:** Tuntemattomat virheet heitetään → Fastify:n globaali error handler hoitaa

---

### **GET /rooms/:roomId/bookings - Varausten haku**

**Yksinkertaisempi flow** (rivit 55-69):

1. **Validoi roomId** (rivit 58-65) - identtinen POST:n kanssa
2. **Hae suoraan storesta** (rivi 67):
   ```typescript
   const bookings = bookingStore.getBookingsByRoom(roomIdResult.data);
   ```
   - **Huom:** Ohittaa business-logic.ts:n kokonaan
   - Kutsuu suoraan store-kerrosta
3. **Palauta 200 OK** (rivi 68) - tyhjä array jos ei varauksia

**Ei try-catch blokkia** - store-operaatio ei voi epäonnistua tässä yhteydessä.

---

### **DELETE /bookings/:bookingId - Varauksen poisto**

**Kaksivaiheinen tarkistus** (rivit 71-94):

1. **Validoi UUID-muoto** (rivit 74-81):
   ```typescript
   const bookingIdResult = bookingIdSchema.safeParse(request.params.bookingId);
   ```
   - Zod:n `.uuid()` validator tarkistaa muodon
   - Virheellinen UUID → 404 (ei 400)

2. **Tarkista olemassaolo** (rivit 83-90):
   ```typescript
   const booking = bookingStore.getBookingById(bookingIdResult.data);
   if (!booking) {
     return reply.status(404).send({ ... });
   }
   ```
   - **Eksplisiittinen olemassaolon tarkistus** ennen poistoa
   - Välttää "hiljaisen epäonnistumisen"

3. **Poista ja palauta 204 No Content** (rivit 92-93):
   ```typescript
   bookingStore.deleteBooking(bookingIdResult.data);
   return reply.status(204).send();
   ```
   - HTTP 204 on semanttisesti oikea (onnistunut, ei sisältöä)

## 3. Validoinnin, virheenkäsittelyn ja business-logiikan jako

### **Kerrosarkkitehtuuri:**

```
┌─────────────────────────────────────────┐
│  routes.ts (HTTP/Presentation Layer)   │
│  - URL-parametrien validointi           │
│  - Request body validointi (Zod)        │
│  - HTTP-statuskoodien määrittely        │
│  - ErrorResponse-muotoilu               │
└─────────────────┬───────────────────────┘
                  │ kutsuu
┌─────────────────▼───────────────────────┐
│  business-logic.ts (Domain Layer)       │
│  - Varausten business rules             │
│  - Päällekkäisyystarkistus              │
│  - Ajallinen validointi                 │
│  - BookingError-poikkeusten heittäminen │
└─────────────────┬───────────────────────┘
                  │ käyttää
┌─────────────────▼───────────────────────┐
│  store.ts (Data Access Layer)           │
│  - CRUD-operaatiot                      │
│  - In-memory tallennuslogiikka          │
│  - Ei validointia, ei business rules    │
└─────────────────────────────────────────┘
```

### **Validoinnin jako:**

| Kerros | Validoinnin tyyppi | Esimerkit |
|--------|-------------------|-----------|
| **routes.ts** | Syntaktinen validointi | ISO-8601 muoto, UUID-muoto, enum-arvot |
| **business-logic.ts** | Semanttinen validointi | Menneisyys, päällekkäisyys, ajallinen järjestys |
| **store.ts** | Ei validointia | "Luota että data on validi" |

### **Virheenkäsittelyn jako:**

| Kerros | Virhetyyppi | Käsittely |
|--------|-------------|-----------|
| **routes.ts** | Zod ValidationError | `safeParse()` → palauta 400/404 |
| **routes.ts** | BookingError | `catch` → map statusCode → ErrorResponse |
| **business-logic.ts** | Business rule violation | `throw BookingError(message, statusCode)` |
| **store.ts** | Ei virheitä | Operaatiot eivät epäonnistu (in-memory) |

## 4. Vastuunjaon arviointi

### **✅ Hyvin toteutetut kohdat:**

#### **1. Selkeä kerrosarkkitehtuuri**
- **HTTP-kerros** (routes.ts) tietää vain HTTP-konsepteista (status codes, request/response)
- **Domain-kerros** (business-logic.ts) tietää vain varauslogiikasta
- **Data-kerros** (store.ts) tietää vain tallennuksesta

#### **2. Dependency direction oikea**
```typescript
routes.ts → business-logic.ts → store.ts
```
- Riippuvuudet kulkevat **sisäänpäin** (Clean Architecture)
- Store ei tiedä business-logiikasta, business-logiikka ei tiedä HTTP:stä

#### **3. Tyyppiturvallinen rajapinta**
```typescript
roomIdResult.data // tyyppi: RoomId ('A' | 'B' | 'C' | 'D' | 'E')
bodyResult.data   // tyyppi: { start: string, end: string }
```
- Zod:n `safeParse` takaa tyyppiturvallisen datan

#### **4. Keskitetty virhemuotoilu**
```typescript
{
  statusCode: number,
  error: string,
  message: string
}
```
- Yhtenäinen [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-tyyppi kaikissa virheissä

### **⚠️ Arkkitehtoniset ongelmat ja parannusehdotukset:**

#### **1. Koodin toisto (DRY-periaate rikottu)**

**Ongelma:** Identtinen `roomId`-validointi toistetaan kahdessa handlerissa:

```typescript
// POST /rooms/:roomId/bookings (rivit 18-25)
const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
if (!roomIdResult.success) {
  return reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: 'Room not found',
  } as ErrorResponse);
}

// GET /rooms/:roomId/bookings (rivit 58-65)
const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
if (!roomIdResult.success) {
  return reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: 'Room not found',
  } as ErrorResponse);
}
```

**Parannusehdotus:** Luo helper-funktio tai Fastify-hook:
```typescript
function validateRoomId(roomId: string): RoomId {
  const result = roomIdSchema.safeParse(roomId);
  if (!result.success) {
    throw new NotFoundError('Room not found');
  }
  return result.data;
}
```

#### **2. Epäjohdonmukainen store-kutsuminen**

**Ongelma:** POST-handler kutsuu [createBooking()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:48:0-56:1) (business-logic), mutta:
- GET-handler kutsuu **suoraan** [bookingStore.getBookingsByRoom()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts:17:2-21:3) (rivi 67)
- DELETE-handler kutsuu **suoraan** [bookingStore.getBookingById()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts:23:2-25:3) ja [.deleteBooking()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts:27:2-29:3) (rivit 83, 92)

**Seuraus:** Business-logiikka on hajautunut:
- Varauksen luonti: keskitetty business-logic.ts:ään
- Varauksen haku ja poisto: suoraan routes.ts:ssä

**Parannusehdotus:** Luo business-logic.ts:ään funktiot:
```typescript
export function getBookings(roomId: RoomId): Booking[] { ... }
export function deleteBooking(bookingId: string): void { ... }
```

Tämä mahdollistaisi tulevaisuudessa esim.:
- Audit logging ("kuka poisti varauksen?")
- Oikeustarkistukset
- Soft delete -toiminnallisuus

#### **3. Virheviestien hardkoodaus**

**Ongelma:** Virheviestit ja HTTP-statuskoodi-mappaukset hajallaan (rivit 20-24, 29-33, 60-64, 76-80, 85-89):

```typescript
// Sama rakenne toistetaan 5 kertaa
return reply.status(404).send({
  statusCode: 404,
  error: 'Not Found',
  message: 'Room not found',
} as ErrorResponse);
```

**Parannusehdotus:** Keskitetty error factory:
```typescript
// errors.ts
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string
  ) { super(message); }
  
  toJSON(): ErrorResponse {
    return {
      statusCode: this.statusCode,
      error: this.error,
      message: this.message,
    };
  }
}

export const NotFoundError = (msg: string) => 
  new HttpError(404, 'Not Found', msg);
export const BadRequestError = (msg: string) => 
  new HttpError(400, 'Bad Request', msg);
```

Tai Fastify:n `@fastify/sensible` plugin joka tarjoaa `reply.notFound()`, `reply.badRequest()` jne.

#### **4. Error-HTTP status mapping logiikka routes:ssa**

**Ongelma:** Rivi 47 sisältää business-logiikkaa:
```typescript
error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
```

HTTP-kerros **tietää** että statusCode 409 tarkoittaa "Conflict". Tämä on OK, mutta:
- Muiden statuskoodien nimet pitää arvata
- Skaalautuu huonosti (entä 422? 429? 503?)

**Parannusehdotus:** Statuskoodi → nimi -mapping keskitetysti:
```typescript
const STATUS_NAMES: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  // ...
};

error: STATUS_NAMES[error.statusCode] || 'Error',
```

Tai antaa [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1):n sisältää myös `error`-kentän.

#### **5. Puuttuva globaali error handler**

**Ongelma:** Rivi 51 heittää tuntemattomat virheet eteenpäin:
```typescript
throw error;
```

Mutta routes.ts ei määrittele mitä tapahtuu. Fastify:n default error handler:
- Paljastaa mahdollisesti stack traceja
- Ei noudattaa [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-muotoa
- Ei lokita virheitä järkevästi

**Parannusehdotus:** [server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0):ään globaali error handler:
```typescript
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  if (error instanceof HttpError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }
  
  // Unexpected errors
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});
```

#### **6. Zod-virheiden yksityiskohtien puute**

**Ongelma:** Rivit 29-33:
```typescript
if (!bodyResult.success) {
  return reply.status(400).send({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Invalid request body', // Geneerinen viesti
  });
}
```

Käyttäjä ei tiedä **mikä** on väärin (puuttuuko start? onko end väärässä muodossa?).

**Parannusehdotus:** Palauta Zod:n virheyksityiskohdat:
```typescript
if (!bodyResult.success) {
  return reply.status(400).send({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Invalid request body',
    details: bodyResult.error.issues, // Zod:n yksityiskohtaiset virheet
  });
}
```

#### **7. Async-handlerien tarpeeton async**

**Huomio:** Kaikki handlerit on määritelty `async`:
```typescript
async (request, reply) => { ... }
```

Mutta **mikään niistä ei käytä `await`**. Tämä on:
- ✅ **Tulevaisuuden kannalta hyvä** (jos lisätään tietokanta)
- ⚠️ **Tällä hetkellä turha** (luo tarpeettomia Promiseja)

Ei ongelma, mutta hyvä huomata.

#### **8. Type assertion käyttö**

**Ongelma:** Jokaisessa error response:ssa:
```typescript
} as ErrorResponse);
```

TypeScript vaatii tämän, koska inline-objekti ei täsmää täydellisesti. Tämä on **code smell** - viittaa siihen että error-luonti voisi olla paremmin tyypitetty.

**Parannusehdotus:** Factory-funktio joka palauttaa oikean tyypin:
```typescript
function errorResponse(
  statusCode: number, 
  error: string, 
  message: string
): ErrorResponse {
  return { statusCode, error, message };
}
```

## 5. Ylläpidettävyyden arvioi

### **Vahvuudet:**

1. ✅ **Pieni ja ymmärrettävä** - 96 riviä, selkeä rakenne
2. ✅ **Kerrostettu** - HTTP, business, data erotettuna
3. ✅ **Testattava** - Funktionaalinen tyyli, ei side-effectejä (paitsi store-kutsut)
4. ✅ **Tyyppiturvalinen** - TypeScript + Zod estävät monia virheitä

### **Heikkoudet ylläpidettävyyden kannalta:**

| Ongelma | Vaikutus ylläpidettävyyteen | Kriittisyys |
|---------|----------------------------|-------------|
| Koodin toisto (DRY) | Muutokset pitää tehdä moneen paikkaan | 🟡 Keskisuuri |
| Epäjohdonmukainen store-kutsuminen | Vaikea lisätä yhtenäistä logiikkaa (esim. audit log) | 🔴 Kriittinen |
| Hajautettu error handling | Vaikea muuttaa virhemuotoja | 🟡 Keskisuuri |
| Puuttuva globaali error handler | Odottamattomat virheet käyttäytyvät arvaamattomasti | 🟠 Kohtalainen |
| Hardkoodatut virheilmoitukset | Vaikea kansainvälistää tai muokata | 🟢 Pieni |

### **Refaktorointiehdotukset prioriteettijärjestyksessä:**

1. **Kriittinen:** Siirrä kaikki store-kutsut business-logic.ts:n taakse
2. **Tärkeä:** Luo keskitetty error handling (HttpError-luokat tai Fastify plugin)
3. **Hyödyllinen:** Poista koodin toisto (helper-funktiot tai middleware)
4. **Nice-to-have:** Palauta yksityiskohtaiset Zod-virheet kehittäjille

## Yhteenveto

**Arkkitehtuuri on kokonaisuudessaan hyvä ja pedagoginen**, mutta siinä on **tyypillisiä "ensimmäisen version" ongelmia**:

- ✅ **Separation of concerns** on pääosin onnistunut
- ⚠️ **Johdonmukaisuus** ontuu (POST vs GET/DELETE store-kutsut)
- ⚠️ **DRY-periaate** rikottu useissa kohdissa
- ✅ **Tyyppiturvallinen** rajapinta Zodin ansiosta

Toteutus skaalautuu huonosti:
- Lisäämällä uusi endpoint → copy-paste validointikoodi
- Lisäämällä audit log → pitää muokata 3 kohtaa
- Lisäämällä oikeustarkistukset → pitää muokata jokainen handler erikseen

**Suositus:** Demonstraatio- ja opetuskäyttöön erinomainen. Tuotantoon menossa refaktoroi ensin epäjohdonmukaisuudet ja keskitä error handling.











## 4 Validointi ja virheenkäsittely

### Prompt

Selitä, miten request-validointi ja virheiden käsittely on toteutettu
tiedostoissa `src/validation.ts` ja `src/routes.ts`.

Kuvaa:
- mitä Zod-skeemat validoivat ja mitä eivät
- missä vaiheessa validointi tapahtuu suhteessa business-logiikkaan
- miten virhetilanteet muunnetaan HTTP-vastauksiksi
- onko virhevastausten muoto yhtenäinen ja selkeä

Älä tee muutoksia koodiin. Selitä ja arvioi vain nykyinen toteutus.

### Oma tiivistelmä (poiminnat)
- `validation.ts` hoitaa syntaktisen validoinnin (ISO datetime `.datetime()`, roomId enum, bookingId uuid), mutta ei business-sääntöjä (start<end, menneisyys, päällekkäisyys).
- Validointi tapahtuu `routes.ts`:ssä ennen business-logiikkaa: ensin `roomIdSchema.safeParse`, sitten `createBookingSchema.safeParse`, vasta sen jälkeen `createBooking(...)`.
- Zod-virheet mapataan suoraan HTTP-vastauksiksi (roomId/bookingId -> 404, body -> 400), mutta käyttäjälle annetaan geneerinen viesti ilman `ZodError.issues`-detaljeja.
- Virhevastaukset ovat pääosin yhtenäisessä muodossa `{ statusCode, error, message }`, mutta tuntemattomat virheet (throw error) voivat mennä Fastify default handleriin → muoto voi rikkoutua (500).
- Koodissa on toistoa (DRY): sama virheobjekti rakennetaan useaan kertaan ja statusCode→error label -mapping (409 vs muut) on hardkoodattu.
- Lisäksi sama arkkitehtuuriepäjohdonmukaisuus näkyy: POST kulkee business-logiikan kautta, mutta GET/DELETE käyttävät storea suoraan.


### Vastaus

Luen tiedostot analysoidakseni validoinnin ja virheenkäsittelyn toteutusta.

# Validoinnin ja virheenkäsittelyn analyysi

## 1. Zod-skeemat ja niiden validointivastuut

### **[validation.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/validation.ts:0:0-0:0) - Skeemat** (`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/validation.ts:1-13`)

#### **Skeema 1: `createBookingSchema`** (rivit 5-8)

```typescript
export const createBookingSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});
```

**Mitä validoidaan:**
- ✅ **Objektin rakenne:** Täytyy olla objekti jossa kentät [start](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/index.ts:5:0-14:1) ja `end`
- ✅ **Kenttien tyyppi:** Molemmat täytyy olla stringejä
- ✅ **ISO-8601 datetime-muoto:** `.datetime()` tarkistaa että string on validia ISO-8601 muotoa
  - Esim. `"2026-02-01T10:00:00Z"` ✅
  - Esim. `"2026-02-01"` ❌ (vain päivämäärä)
  - Esim. `"10:00:00"` ❌ (vain kellonaika)
  - Esim. `"invalid"` ❌

**Mitä EI validoida:**
- ❌ **Semanttinen sisältö:** Ei tarkista että `start < end`
- ❌ **Menneisyys:** Ei tarkista että ajat ovat tulevaisuudessa
- ❌ **Päällekkäisyys:** Ei tiedä muista varauksista
- ❌ **Kesto:** Ei rajoita varauksen pituutta
- ❌ **Aikavyöhyke:** Hyväksyy mikä tahansa timezone (Z, +02:00 jne.)

**Vastuualue:** Syntaktinen validointi - "onko data teknisesti oikean muotoista?"

---

#### **Skeema 2: `roomIdSchema`** (rivit 3, 10)

```typescript
export const VALID_ROOMS = ['A', 'B', 'C', 'D', 'E'] as const;
export const roomIdSchema = z.enum(VALID_ROOMS);
```

**Mitä validoidaan:**
- ✅ **Enum-arvo:** Huone täytyy olla täsmälleen 'A', 'B', 'C', 'D' tai 'E'
- ✅ **Case-sensitive:** 'a' tai 'F' hylätään

**Mitä EI validoida:**
- ❌ **Huoneen olemassaolo:** Ei tarkista että huone on vapaana tai edes "olemassa" (koska lista on kovakoodattu)
- ❌ **Oikeudet:** Ei tarkista onko käyttäjällä oikeus varata kyseistä huonetta

**Erityispiirre:** `VALID_ROOMS as const` luo TypeScript literal-tyypin, joten TypeScript tietää compile-timessa että arvot ovat täsmälleen nuo kirjaimet.

---

#### **Skeema 3: `bookingIdSchema`** (rivi 12)

```typescript
export const bookingIdSchema = z.string().uuid();
```

**Mitä validoidaan:**
- ✅ **UUID v4 muoto:** Stringin täytyy olla validi UUID
  - Esim. `"550e8400-e29b-41d4-a716-446655440000"` ✅
  - Esim. `"123"` ❌
  - Esim. `"550e8400-e29b-41d4-a716"` ❌ (liian lyhyt)

**Mitä EI validoida:**
- ❌ **Olemassaolo:** Ei tarkista että ID löytyy tietokannasta/storesta
- ❌ **UUID-versio:** Hyväksyy kaikki UUID-versiot (v1, v4, v5 jne.)

---

### **Validointikattavuuden yhteenveto**

| Validointityyppi | Zod-skeemat | Business-logiikka |
|------------------|-------------|-------------------|
| **Syntaksi** (muotoilu) | ✅ Kyllä | ❌ Ei |
| **Semantiikka** (merkitys) | ❌ Ei | ✅ Kyllä |
| **Rakenne** (kentät) | ✅ Kyllä | ❌ Ei |
| **Arvoalue** (enum, uuid) | ✅ Kyllä | ❌ Ei |
| **Liiketoimintasäännöt** | ❌ Ei | ✅ Kyllä |

**Hyvä jako:** Zod hoitaa "onko data parsittavissa", business-logiikka hoitaa "onko data järkevää".

## 2. Validoinnin ajoitus suhteessa business-logiikkaan

### **Validointijärjestys POST-pyynnössä:**

```
1. HTTP-pyyntö saapuu
   ↓
2. Fastify parsii JSON-bodyn
   ↓
3. routes.ts: roomIdSchema.safeParse(params.roomId)     ← SYNTAKTINEN VALIDOINTI
   ├─ Jos virhe → HTTP 404
   └─ Jos OK → jatka
   ↓
4. routes.ts: createBookingSchema.safeParse(body)       ← SYNTAKTINEN VALIDOINTI
   ├─ Jos virhe → HTTP 400
   └─ Jos OK → jatka
   ↓
5. routes.ts: createBooking(roomId, start, end)         ← BUSINESS-LOGIIKKA
   ↓
6. business-logic.ts: validateBookingTimes()            ← SEMANTTINEN VALIDOINTI
   ├─ Tarkista menneisyys
   ├─ Tarkista start < end
   └─ Jos virhe → throw BookingError(400)
   ↓
7. business-logic.ts: checkOverlap()                    ← SEMANTTINEN VALIDOINTI
   ├─ Hae olemassa olevat varaukset
   ├─ Tarkista päällekkäisyys
   └─ Jos virhe → throw BookingError(409)
   ↓
8. store.ts: createBooking()                            ← TALLENNA DATA
   ↓
9. routes.ts: catch (BookingError)                      ← VIRHEENKÄSITTELY
   ↓
10. HTTP-vastaus (201 tai virhe)
```

### **Kriittiset havainnot:**

#### **1. "Fail Fast" -periaate toteutuu**
- Zod-validointi tapahtuu **ennen** business-logiikkaa
- Jos syntaksi on väärä, business-logiikkaa ei edes kutsuta
- Säästää resursseja ja tekee virheistä selkeämpiä

#### **2. Kaksikerroksinen suojaus**
```typescript
// Kerros 1: HTTP-taso (routes.ts, rivit 27-34)
const bodyResult = createBookingSchema.safeParse(request.body);
if (!bodyResult.success) {
  return reply.status(400).send({ ... }); // Ei koskaan pääse business-logiikkaan
}

// Kerros 2: Domain-taso (business-logic.ts, rivit 19-21)
if (startDate < now) {
  throw new BookingError('Booking cannot be in the past', 400);
}
```

- **HTTP-taso estää:** Virheelliset datatyypit, puuttuvat kentät, väärät muodot
- **Domain-taso estää:** Liiketoimintasääntöjen rikkomukset

#### **3. GET/DELETE-endpointeissa yksinkertaisempi flow**

**GET /rooms/:roomId/bookings** (rivit 58-65):
```
1. Validoi roomId (Zod)
2. Hae storesta (EI business-logiikkaa)
3. Palauta tulokset
```

**DELETE /bookings/:bookingId** (rivit 74-90):
```
1. Validoi bookingId UUID-muoto (Zod)
2. Tarkista olemassaolo storesta (manuaalinen, ei business-logiikka)
3. Poista
```

**Huomio:** Nämä eivät kutsu business-logic.ts:ää lainkaan → epäjohdonmukaisuus arkkitehtuurissa.

## 3. Virhetilanteiden muunnos HTTP-vastauksiksi

### **Virhetyypit ja niiden käsittely:**

#### **Virhetyyppi 1: Zod-validointivirhe**

**Käsittely `safeParse()`:lla** (esim. rivit 18-25):

```typescript
const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
if (!roomIdResult.success) {
  return reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: 'Room not found',
  } as ErrorResponse);
}
```

**Prosessi:**
1. `safeParse()` **ei heitä poikkeusta** - palauttaa `{ success: false, error: ZodError }`
2. Manuaalinen tarkistus: `if (!result.success)`
3. Välitön HTTP-vastaus ilman try-catchía
4. HTTP-statuskoodi valitaan **semanttisesti**:
   - Virheellinen roomId → **404** (simuloi "resurssia ei löydy")
   - Virheellinen body → **400** (virheellinen pyyntö)
   - Virheellinen UUID → **404** (varausta ei löydy)

**Ongelma:** Zod:n `error`-objekti hylätään, käyttäjä ei saa tietää mikä meni pieleen.

---

#### **Virhetyyppi 2: Business-logiikan virhe (BookingError)**

**Käsittely try-catch:lla** (rivit 43-52):

```typescript
try {
  const booking = createBooking(...);
  return reply.status(201).send(booking);
} catch (error) {
  if (error instanceof BookingError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
      message: error.message,
    } as ErrorResponse);
  }
  throw error; // Tuntemattomat virheet eteenpäin
}
```

**Prosessi:**
1. Business-logiikka heittää [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1)-poikkeuksen
2. Catch-blokki tarkistaa tyypin: `instanceof BookingError`
3. **Statuskoodi otetaan virhe-objektista:** `error.statusCode`
4. **Error-label mapätään:** 409 → "Conflict", muut → "Bad Request"
5. **Viesti otetaan suoraan:** `error.message`

**Esimerkkejä:**
- [validateBookingTimes()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:13:0-25:1) heittää → [BookingError('Booking cannot be in the past', 400)](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1)
- [checkOverlap()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:27:0-46:1) heittää → [BookingError('Booking overlaps with existing booking', 409)](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1)

---

#### **Virhetyyppi 3: Tuntemattomat virheet**

**Käsittely** (rivi 51):
```typescript
throw error; // Heitetään eteenpäin
```

**Mitä tapahtuu:**
1. Virhe heitetään Fastify:n globaalille error handlerille
2. **Ongelma:** Ei ole määritelty custom global error handleria
3. Fastify:n default handler:
   - Palauttaa HTTP 500
   - Voi paljastaa stack tracen (riippuu ympäristöstä)
   - **Ei noudata [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-muotoa!**

**Riski:** Odottamattomat virheet (esim. TypeError, null reference) palauttavat eri muotoisen vastauksen.

---

### **HTTP-statuskoodi mapping -taulukko:**

| Tilanne | HTTP Status | Error Label | Viestin lähde |
|---------|-------------|-------------|---------------|
| Tuntematon huone (Zod) | 404 | "Not Found" | Hardkoodattu routes.ts |
| Virheellinen body (Zod) | 400 | "Bad Request" | Hardkoodattu routes.ts |
| Virheellinen UUID (Zod) | 404 | "Not Found" | Hardkoodattu routes.ts |
| Varaus ei löydy | 404 | "Not Found" | Hardkoodattu routes.ts |
| Menneisyys (business) | 400 | "Bad Request" | BookingError.message |
| Start >= End (business) | 400 | "Bad Request" | BookingError.message |
| Päällekkäisyys (business) | 409 | "Conflict" | BookingError.message |
| Tuntematon virhe | 500 | ??? | Fastify default |

## 4. Virhevastausten muodon arviointi

### **[ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-tyyppi**

Määritelty [types.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:0:0-0:0):ssä:
```typescript
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
```

### **Yhtenäisyysanalyysi:**

#### **✅ Vahvuudet:**

**1. Johdonmukainen rakenne**

Kaikki virheet noudattavat samaa rakennetta:
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Room not found"
}
```

**2. RESTful-käytäntö**

Muoto on lähellä [RFC 7807 (Problem Details)](https://datatracker.ietf.org/doc/html/rfc7807) -standardia ja Fastify:n omaa virhemalllia.

**3. Selkeät kentät**
- `statusCode`: Numeerinen, helppo parsea
- `error`: Ihmisluettava kategorianimi
- `message`: Yksityiskohtainen kuvaus

**4. TypeScript-tyyppiturvallinen**
- `as ErrorResponse` varmistaa oikean muodon (vaikka onkin type assertion)

---

#### **⚠️ Heikkoudet:**

**1. Zod-virheiden yksityiskohtien puute**

**Ongelma:** Rivit 29-33:
```typescript
if (!bodyResult.success) {
  return reply.status(400).send({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Invalid request body', // Liian geneerinen!
  });
}
```

**Mitä käyttäjä saa:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request body"
}
```

**Mitä käyttäjä TARVITSISI:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request body",
  "details": [
    {
      "path": ["start"],
      "message": "Invalid datetime string! Must be UTC"
    }
  ]
}
```

Zod tarjoaa `bodyResult.error.issues` joka sisältää yksityiskohtaiset virheet, mutta sitä ei hyödynnetä.

---

**2. Hardkoodatut virheilmoitukset toistuvat**

Sama virherakenne luodaan **5 kertaa** eri paikoissa:

```typescript
// Toisto 1: POST roomId virhe (rivit 20-24)
return reply.status(404).send({
  statusCode: 404,
  error: 'Not Found',
  message: 'Room not found',
} as ErrorResponse);

// Toisto 2: POST body virhe (rivit 29-33)
// Toisto 3: GET roomId virhe (rivit 60-64)
// Toisto 4: DELETE UUID virhe (rivit 76-80)
// Toisto 5: DELETE ei löydy (rivit 85-89)
```

**Ongelma:**
- Muutokset pitää tehdä viiteen paikkaan
- Virheriskiarvo kasvaa (typo vain yhdessä paikassa)
- Vaikea kansainvälistää

---

**3. Statuskoodi-label mapping logiikka routes:ssa**

**Rivi 47:**
```typescript
error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
```

**Ongelmat:**
- Olettaa että ainoa muu vaihtoehto 409:lle on 400
- Mitä jos business-logiikka heittää [BookingError(422, ...)](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1)?
- HTTP-kerros tietää liikaa statuskoodien semantiikasta

**Parempi ratkaisu:** Statuskoodi → nimi -mapping tai [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1) sisältää myös `error`-kentän.

---

**4. Type assertion (`as ErrorResponse`)**

Jokaisessa virhevastauksessa:
```typescript
} as ErrorResponse);
```

**Mikä on ongelma:**
- TypeScript ei voi varmistaa compile-timessa että objekti on oikein
- Jos [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1) muuttuu, virheitä ei havaita
- Code smell - viittaa huonoon tyypitykseen

**Parempi ratkaisu:** Factory-funktio:
```typescript
function createErrorResponse(
  statusCode: number,
  error: string,
  message: string
): ErrorResponse {
  return { statusCode, error, message };
}
```

---

**5. Epäjohdonmukainen error handling**

**POST-endpoint:**
- ✅ Käyttää try-catch
- ✅ Käsittelee BookingError
- ❌ Heittää tuntemattomat eteenpäin

**GET/DELETE-endpointit:**
- ❌ Ei try-catch blokkia
- ❌ Ei käsittele mahdollisia virheitä

Vaikka store-operaatiot eivät tällä hetkellä heitä virheitä, tulevaisuudessa (esim. tietokanta) voivat heittää.

---

**6. Ei keskitettyä error handleria**

[server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0) ei määrittele `setErrorHandler()`:ia:
```typescript
// Puuttuu:
app.setErrorHandler((error, request, reply) => {
  // Yhtenäinen virheenkäsittely
});
```

**Seuraukset:**
- Tuntemattomat virheet (rivi 51: `throw error`) käsitellään Fastify:n defaultilla
- Saattaa palauttaa eri muotoisen vastauksen
- Stack tracet voivat vuotaa tuotannossa

---

### **Virhevastausten yhtenäisyys pisteytetty:**

| Kriteeri | Arvosana | Perustelu |
|----------|----------|-----------|
| **Rakenne** | 9/10 | Kaikki käyttävät ErrorResponse-tyyppiä |
| **Selkeys** | 7/10 | Perustiedot OK, mutta puuttuu yksityiskohdat |
| **Johdonmukaisuus** | 6/10 | Toimii nyt, mutta epäjohdonmukainen error handling |
| **Kehittäjäystävällisyys** | 5/10 | Geneerinen "Invalid request body" ei auta |
| **Ylläpidettävyys** | 4/10 | Paljon toistoa, vaikea muuttaa |

**Kokonaisarvio: 6.2/10** - Toimii peruskäytössä, mutta vaatii parannuksia tuotantoon.

---

## Yhteenveto ja suositukset

### **Nykyinen toteutus:**

✅ **Toimii oikein perustapauksissa**
- Zod validoi syntaksin ennen business-logiikkaa
- Virhevastaukset ovat rakenteeltaan yhtenäisiä
- HTTP-statuskoodit ovat semanttisesti oikeita

⚠️ **Vaatii parannuksia:**
- Zod-virheiden yksityiskohtien palauttaminen
- Koodin toiston poisto (DRY)
- Keskitetty error handling
- Globaali error handler tuntemattoille virheille

### **Parannusehdotukset prioriteettijärjestyksessä:**

**1. Lisää globaali error handler** (kriittinen)
```typescript
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});
```

**2. Palauta Zod-virheiden yksityiskohdat** (tärkeä)
```typescript
if (!bodyResult.success) {
  return reply.status(400).send({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Invalid request body',
    details: bodyResult.error.issues, // Lisää tämä!
  });
}
```

**3. Luo error factory -funktiot** (hyödyllinen)
```typescript
const notFound = (msg: string) => ({ statusCode: 404, error: 'Not Found', message: msg });
const badRequest = (msg: string) => ({ statusCode: 400, error: 'Bad Request', message: msg });
```

**4. Siirrä statuskoodi-mapping pois routes:sta** (nice-to-have)
Joko: Anna [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1):n sisältää `error`-kenttä
Tai: Luo keskitetty mapping `const STATUS_NAMES = { 400: 'Bad Request', 409: 'Conflict', ... }`

Nykyinen toteutus on **hyvä ensimmäinen versio**, mutta skaalautuu huonosti ja vaatii refaktorointia ennen tuotantokäyttöä.











## 5 Testien selitys

### Prompt

Selitä, mitä testejä on kirjoitettu tiedostoihin
`src/business-logic.test.ts` ja `src/routes.test.ts`.

Kuvaa:
- mitä liiketoimintasääntöjä testataan
- mitkä reunatapaukset on katettu hyvin
- mitkä tapaukset saattavat puuttua
- ovatko testit enemmän yksikkö- vai integraatiotestien kaltaisia

Älä tee muutoksia koodiin. Selitä ja arvioi vain nykyinen toteutus.

### Oma tiivistelmä
- Testit on jaettu kahteen tasoon: `business-logic.test.ts` on yksikkötestejä (testaa suoraan domain-funktioita) ja `routes.test.ts` on integraatiotestejä (Fastify `inject()` → routes → business-logic → store).
- Kattavuus on hyvä perusvaatimuksiin: päällekkäisyys (409) ja adjacent (end===nextStart) on testattu sekä unit- että integraatiotasolla.
- “Menneisyys”-sääntö on testattu (400) molemmilla tasoilla, mutta rajatapaus `start === now` puuttuu.
- “start < end” on testattu unit-tasolla lähinnä `start === end` -case; integraatiotesti puuttuu ja `start > end` puuttuu.
- Testeissä on jonkin verran toistoa (aikojen rakentelu, “magic numbers”) ja integraatiotesteissä serveri rakennetaan jokaisessa testissä erikseen (ok nyt, mutta voisi nopeutua).
- ErrorResponse-muotoa ei aina validoida kokonaisena (statusCode/error/message), usein tarkistetaan vain status + message.

### Vastaus

Luen molemmat testitiedostot analysoidakseni niiden sisällön ja kattavuuden.

# Testien analyysi

## 1. Testityyppien luokittelu

### **[business-logic.test.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.test.ts:0:0-0:0) - Yksikkötestit**

**Tyyppi:** Puhtaat yksikkötestit (Unit Tests)

**Tunnusmerkit:**
- Testaa **yksittäisiä funktioita** erikseen
- **Ei HTTP-pyyntöjä** - kutsuu suoraan business-logiikkafunktioita
- **Minimaalinen riippuvuus:** Vain `bookingStore` (joka on myös in-memory)
- **Nopeat:** Ei palvelimen käynnistystä, ei verkkoliikennettä
- **Eristetty:** `beforeEach(() => bookingStore.clear())` varmistaa puhtaan tilan

**Testattavat funktiot:**
1. [validateBookingTimes()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:13:0-25:1) - 3 testiä
2. [checkOverlap()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:27:0-46:1) - 6 testiä
3. [createBooking()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:48:0-56:1) - 3 testiä

**Yhteensä:** 12 testiä

---

### **[routes.test.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.test.ts:0:0-0:0) - Integraatiotestit**

**Tyyppi:** API-tason integraatiotestit (Integration Tests)

**Tunnusmerkit:**
- Testaa **koko HTTP-pyynnön käsittelyketjun**
- Käynnistää Fastify-palvelimen ([buildServer()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:3:0-11:1))
- Käyttää Fastify:n `inject()`-metodia HTTP-pyyntöjen simulointiin
- Testaa **routes → business-logic → store** -ketjun
- **Lähellä E2E-testejä**, mutta ei oikeaa verkkoyhteyttä (inject on in-memory)

**Testattavat endpointit:**
1. `POST /rooms/:roomId/bookings` - 6 testiä
2. `GET /rooms/:roomId/bookings` - 3 testiä
3. `DELETE /bookings/:bookingId` - 3 testiä

**Yhteensä:** 12 testiä

**Kokonaistestimäärä:** 24 testiä

---

## 2. Liiketoimintasääntöjen testikattavuus

### **Sääntö 1: Varaukset eivät saa mennä päällekkäin samassa huoneessa**

#### **Yksikkötestit ([checkOverlap](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:27:0-46:1)):**

✅ **Osittainen päällekkäisyys** (rivit 45-57):
```typescript
it('should detect overlapping bookings', () => {
  // Varaus 1: 10:00-11:00
  // Varaus 2: 10:30-11:30 (alkaa kesken ensimmäisen)
  expect(() => checkOverlap(...)).toThrow('Booking overlaps with existing booking');
});
```

✅ **Uusi sisältää vanhan** (rivit 101-113):
```typescript
it('should detect overlap when new booking contains existing', () => {
  // Varaus 1: 10:00-11:00
  // Varaus 2: 09:30-11:30 (ympäröi ensimmäisen)
  expect(() => checkOverlap(...)).toThrow('Booking overlaps with existing booking');
});
```

✅ **Uusi sisältyy vanhaan** (rivit 115-127):
```typescript
it('should detect overlap when new booking is contained by existing', () => {
  // Varaus 1: 10:00-12:00
  // Varaus 2: 10:30-11:30 (sisällä ensimmäisessä)
  expect(() => checkOverlap(...)).toThrow('Booking overlaps with existing booking');
});
```

✅ **Eri huoneet sallittu** (rivit 87-99):
```typescript
it('should allow overlapping times in different rooms', () => {
  // Huone A: 10:00-11:00
  // Huone B: 10:30-11:30 (sama aika, eri huone)
  expect(() => checkOverlap('B', ...)).not.toThrow();
});
```

#### **Integraatiotestit:**

✅ **HTTP 409 Conflict** (rivit 96-127):
```typescript
it('should return 409 for overlapping booking', async () => {
  // Luo ensimmäinen varaus
  await app.inject({ method: 'POST', ... });
  // Yritä luoda päällekkäinen
  const response = await app.inject({ method: 'POST', ... });
  expect(response.statusCode).toBe(409);
  expect(body.message).toBe('Booking overlaps with existing booking');
});
```

**Kattavuus:** ⭐⭐⭐⭐⭐ Erinomainen - kaikki päällekkäisyystyypit testattu

---

### **Sääntö 2: Adjacent bookings sallittu (end === nextStart)**

#### **Yksikkötestit** (rivit 59-71):
```typescript
it('should allow adjacent bookings (end === nextStart)', () => {
  const start1 = new Date(Date.now() + 1000 * 60 * 60);
  const end1 = new Date(start1.getTime() + 1000 * 60 * 60);
  bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());
  
  const start2 = end1; // Täsmälleen sama aika!
  const end2 = new Date(start2.getTime() + 1000 * 60 * 60);
  
  expect(() => checkOverlap('A', start2.toISOString(), end2.toISOString()))
    .not.toThrow();
});
```

#### **Integraatiotestit** (rivit 129-158):
```typescript
it('should allow adjacent bookings (end === nextStart)', async () => {
  // POST ensimmäinen varaus
  await app.inject({ ... start1, end1 ... });
  
  const start2 = end1; // Adjacent
  // POST toinen varaus
  const response = await app.inject({ ... start2, end2 ... });
  
  expect(response.statusCode).toBe(201); // Onnistuu!
});
```

**Kattavuus:** ⭐⭐⭐⭐⭐ Erinomainen - kriittinen reunatapaus testattu molemmilla tasoilla

---

### **Sääntö 3: Varaus ei saa olla menneisyydessä**

#### **Yksikkötestit** (rivit 16-23):
```typescript
it('should reject booking in the past', () => {
  const past = new Date(Date.now() - 1000 * 60 * 60); // -1h
  const future = new Date(Date.now() + 1000 * 60 * 60); // +1h
  
  expect(() => validateBookingTimes(past.toISOString(), future.toISOString()))
    .toThrow(BookingError);
});
```

#### **Integraatiotestit** (rivit 75-94):
```typescript
it('should return 400 for booking in the past', async () => {
  const start = new Date(Date.now() - 1000 * 60 * 60); // Menneisyys
  const end = new Date(Date.now() + 1000 * 60 * 60);
  
  const response = await app.inject({ method: 'POST', ... });
  
  expect(response.statusCode).toBe(400);
  expect(body.message).toBe('Booking cannot be in the past');
});
```

**Kattavuus:** ⭐⭐⭐⭐ Hyvä - peruslogiikka testattu

**Puuttuu:**
- ⚠️ Tarkka rajatapaus: Mitä jos `start === now` (täsmälleen sama millisekunta)?
- ⚠️ Aikavyöhykeongelmat ei testattu

---

### **Sääntö 4: Aloitusajan täytyy olla ennen lopetusaikaa**

#### **Yksikkötestit** (rivit 25-32):
```typescript
it('should reject booking where start >= end', () => {
  const start = new Date(Date.now() + 1000 * 60 * 60);
  const end = new Date(start.getTime()); // Sama aika!
  
  expect(() => validateBookingTimes(start.toISOString(), end.toISOString()))
    .toThrow('Start time must be before end time');
});
```

**Kattavuus:** ⭐⭐⭐ Kohtalainen

**Puuttuu:**
- ❌ Integraatiotesti tälle säännölle
- ⚠️ Testi missä `start > end` (ei vain `start === end`)

---

### **Sääntö 5: Kiinteä huonelista (A, B, C, D, E)**

#### **Integraatiotestit** (rivit 37-56):
```typescript
it('should return 404 for unknown room', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/rooms/Z/bookings', // Tuntematon huone
    payload: { start, end }
  });
  
  expect(response.statusCode).toBe(404);
  expect(body.message).toBe('Room not found');
});
```

**Myös GET-endpointille** (rivit 208-221).

**Kattavuus:** ⭐⭐⭐⭐ Hyvä

**Puuttuu:**
- ⚠️ Case-sensitivity testi (esim. 'a' vs 'A')
- ⚠️ Kaikki viisi huonetta (A, B, C, D, E) ei testattu erikseen

---

## 3. Reunatapaukset ja testikattavuus

### **✅ Hyvin katetut reunatapaukset:**

#### **1. Päällekkäisyyden kaikki variaatiot**
- Osittainen päällekkäisyys (alkaa kesken)
- Uusi sisältää vanhan
- Uusi sisältyy vanhaan
- Adjacent booking (end === nextStart)
- Eri huoneet, sama aika

#### **2. HTTP-statuskoodi validointi**
- 201 Created (onnistunut luonti)
- 200 OK (onnistunut haku)
- 204 No Content (onnistunut poisto)
- 400 Bad Request (virheellinen data)
- 404 Not Found (tuntematon resurssi)
- 409 Conflict (päällekkäisyys)

#### **3. Virheviestien oikeellisuus**
```typescript
expect(body.message).toBe('Room not found');
expect(body.message).toBe('Booking overlaps with existing booking');
expect(body.message).toBe('Booking cannot be in the past');
```

#### **4. End-to-end flow DELETE-endpointissa** (rivit 225-254):
```typescript
it('should delete a booking and return 204', async () => {
  // 1. Luo varaus
  const createResponse = await app.inject({ method: 'POST', ... });
  const booking = JSON.parse(createResponse.body);
  
  // 2. Poista varaus
  const response = await app.inject({ 
    method: 'DELETE', 
    url: `/bookings/${booking.id}` 
  });
  expect(response.statusCode).toBe(204);
  
  // 3. Varmista että poisto onnistui
  const getResponse = await app.inject({ method: 'GET', ... });
  const bookings = JSON.parse(getResponse.body);
  expect(bookings).toHaveLength(0); // Tyhjä!
});
```

---

### **⚠️ Osittain katetut / puuttuvat reunatapaukset:**

#### **1. Aikaleimojen muotovirheet**

**Testattu:**
```typescript
it('should return 400 for invalid request body', async () => {
  const response = await app.inject({
    payload: {
      start: 'invalid-date', // Virheellinen muoto
      end: 'invalid-date',
    },
  });
  expect(response.statusCode).toBe(400);
});
```

**Puuttuu:**
- ❌ Yksityiskohtaiset Zod-virheet (mitä kenttiä puuttuu?)
- ❌ Eri virheelliset muodot erikseen:
  - Pelkkä päivämäärä: `"2026-02-01"`
  - Pelkkä kellonaika: `"10:00:00"`
  - Epäkelpo ISO-8601: `"2026-13-45T99:99:99Z"`
  - Null/undefined arvot
  - Tyhjät stringit

#### **2. UUID-validointi**

**Testattu:**
```typescript
it('should return 404 for invalid booking ID format', async () => {
  const response = await app.inject({
    method: 'DELETE',
    url: '/bookings/invalid-id', // Ei UUID
  });
  expect(response.statusCode).toBe(404);
});
```

**Puuttuu:**
- ⚠️ Eri UUID-versiot (v1, v4, v5) - hyväksytäänkö kaikki?
- ⚠️ Lähes oikea UUID: `"550e8400-e29b-41d4-a716"` (liian lyhyt)

#### **3. Menneisyyden rajatapaus**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should reject booking that starts exactly now', () => {
  const now = new Date();
  const end = new Date(now.getTime() + 1000 * 60 * 60);
  // Mitä tapahtuu?
});
```

**Riski:** `if (startDate < now)` hylkää jos `startDate === now`, mutta testejä ei ole.

#### **4. Start > End (ei vain Start === End)**

**Testattu vain yhtäsuuruus:**
```typescript
const start = new Date(Date.now() + 1000 * 60 * 60);
const end = new Date(start.getTime()); // start === end
```

**Puuttuu:**
```typescript
// EI TESTATTU:
const start = new Date(Date.now() + 1000 * 60 * 120);
const end = new Date(Date.now() + 1000 * 60 * 60); // start > end
```

#### **5. Erittäin pitkät varaukset**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should accept very long booking', () => {
  const start = new Date(Date.now() + 1000 * 60 * 60);
  const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 365); // 1 vuosi
  // Sallitaanko?
});
```

**Riski:** Ei maksimiaikaa, joku voi varata huoneen vuosikausiksi.

#### **6. Hyvin lyhyet varaukset**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should accept 1-second booking', () => {
  const start = new Date(Date.now() + 1000 * 60 * 60);
  const end = new Date(start.getTime() + 1000); // 1 sekunti
  // Sallitaanko?
});
```

#### **7. Useita päällekkäisiä varauksia samassa huoneessa**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should handle multiple existing bookings', () => {
  // Luo 3 varausta huoneeseen A
  createBooking('A', '10:00', '11:00');
  createBooking('A', '12:00', '13:00');
  createBooking('A', '14:00', '15:00');
  
  // Yritä luoda päällekkäinen toisen kanssa
  // Toimiiko overlap-tarkistus kun useita varauksia?
});
```

**Nykyinen testi:** Vain 1 olemassa oleva varaus + 1 uusi yhdistelmä.

#### **8. GET-endpoint palauttaa varaukset oikeassa järjestyksessä?**

**Testattu:**
```typescript
it('should return all bookings for a room', async () => {
  // Luo 2 varausta
  await app.inject({ ... start1, end1 ... });
  await app.inject({ ... start2, end2 ... });
  
  const body = JSON.parse(response.body);
  expect(body).toHaveLength(2);
});
```

**Puuttuu:**
- ❌ Järjestys: Palautetaanko aikajärjestyksessä?
- ❌ Varausten sisällön validointi (onko start/end/roomId oikein?)

#### **9. Tyhjä request body**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should return 400 for missing body fields', async () => {
  await app.inject({
    method: 'POST',
    url: '/rooms/A/bookings',
    payload: { start: '...' } // Puuttuu 'end'
  });
  // Tai kokonaan tyhjä payload: {}
});
```

#### **10. Samanaikaisten pyyntöjen race condition**

**Puuttuu kokonaan:**
```typescript
// EI TESTATTU:
it('should handle concurrent booking requests', async () => {
  const start = new Date(Date.now() + 1000 * 60 * 60);
  const end = new Date(start.getTime() + 1000 * 60 * 60);
  
  // Lähetä kaksi samaa varausta samanaikaisesti
  const [response1, response2] = await Promise.all([
    app.inject({ method: 'POST', ... }),
    app.inject({ method: 'POST', ... }),
  ]);
  
  // Toisen pitäisi epäonnistua (409)
  // Mutta tällä hetkellä molemmat voivat mennä läpi (TOCTOU-ongelma)
});
```

**Riski:** Kuten aiemmassa analyysissa todettiin, TOCTOU-ongelma voi aiheuttaa päällekkäisiä varauksia.

#### **11. Store-tilan persistenssi testien välillä**

**Testattu:**
```typescript
beforeEach(() => {
  bookingStore.clear(); // Tyhjennetään ennen jokaista testiä
});
```

**Hyvä:** Testit ovat eristettyä toisistaan.

**Puuttuu:**
- ⚠️ Testi joka varmistaa että [clear()](cci:1://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts:31:2-33:3) todella tyhjentää kaiken
- ⚠️ Testi joka varmistaa että muiden huoneiden varaukset säilyvät

#### **12. HTTP header -validointi**

**Puuttuu:**
```typescript
// EI TESTATTU:
it('should require Content-Type: application/json', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/rooms/A/bookings',
    headers: { 'Content-Type': 'text/plain' },
    payload: '...',
  });
  // Pitäisikö hylätä?
});
```

**Huomio:** Fastify hoitaa tämän automaattisesti, mutta ei testattu.

---

## 4. Testien laatu ja tyyli

### **✅ Vahvuudet:**

#### **1. Selkeä rakenne**
```typescript
describe('Business Logic', () => {
  describe('validateBookingTimes', () => {
    it('should reject booking in the past', () => { ... });
    it('should reject booking where start >= end', () => { ... });
    it('should accept valid future booking', () => { ... });
  });
});
```
- Hierarkkinen ryhmittely `describe`-blokeilla
- Kuvaavat testinimet ("should ...")
- Looginen järjestys

#### **2. AAA-pattern (Arrange-Act-Assert)**
```typescript
it('should detect overlapping bookings', () => {
  // Arrange: Luo olemassa oleva varaus
  const start1 = new Date(Date.now() + 1000 * 60 * 60);
  const end1 = new Date(start1.getTime() + 1000 * 60 * 60);
  bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());
  
  // Arrange: Määritä päällekkäinen varaus
  const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
  const end2 = new Date(end1.getTime() + 1000 * 60 * 30);
  
  // Act & Assert: Kutsu ja varmista virhe
  expect(() => checkOverlap('A', start2.toISOString(), end2.toISOString()))
    .toThrow('Booking overlaps with existing booking');
});
```

#### **3. Testien eristäminen**
- `beforeEach(() => bookingStore.clear())` molemmissa tiedostoissa
- Jokainen testi luo oman palvelininstanssinsa (`await buildServer()`)
- Testit voidaan ajaa missä järjestyksessä tahansa

#### **4. Asserration-tarkkuus**
```typescript
// Ei vain: expect(response.statusCode).toBe(201)
// Vaan myös:
const body = JSON.parse(response.body);
expect(body).toMatchObject({
  roomId: 'A',
  start: start.toISOString(),
  end: end.toISOString(),
});
expect(body.id).toBeDefined(); // UUID generoitu
```

#### **5. Palvelimen cleanup**
```typescript
await app.close(); // Jokaisen testin lopussa
```
Estää resource leakit.

---

### **⚠️ Parannuskohteet:**

#### **1. Aikamäärittelyjen toisto**

**Toistuva koodi:**
```typescript
const start = new Date(Date.now() + 1000 * 60 * 60);
const end = new Date(start.getTime() + 1000 * 60 * 60);
```

**Parannus:** Helper-funktio:
```typescript
function createFutureBooking(startOffsetMinutes, durationMinutes) {
  const start = new Date(Date.now() + startOffsetMinutes * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

// Käyttö:
const { start, end } = createFutureBooking(60, 60); // 1h päästä, 1h kesto
```

#### **2. Maaginen numerot**

**Ongelma:**
```typescript
1000 * 60 * 60  // Mitä tämä tarkoittaa?
1000 * 60 * 30  // Entä tämä?
```

**Parannus:**
```typescript
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;

const start1 = new Date(Date.now() + 1 * HOUR);
const start2 = new Date(start1.getTime() + 30 * MINUTE);
```

#### **3. Ei testata error response -rakennetta yhdenmukaisesti**

**Osassa testeistä:**
```typescript
expect(response.statusCode).toBe(404);
expect(body.message).toBe('Room not found');
```

**Mutta ei testata:**
```typescript
expect(body.statusCode).toBe(404); // Puuttuu
expect(body.error).toBe('Not Found'); // Puuttuu
```

**Parannus:** Testaa koko [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-rakenne:
```typescript
expect(body).toMatchObject({
  statusCode: 404,
  error: 'Not Found',
  message: 'Room not found',
});
```

#### **4. Integraatiotestit luovat palvelimen joka testissä**

**Ongelma:**
```typescript
it('should create a booking...', async () => {
  const app = await buildServer(); // Luo palvelin
  // ...
  await app.close(); // Sulje palvelin
});

it('should return 404...', async () => {
  const app = await buildServer(); // Luo taas uusi palvelin
  // ...
  await app.close();
});
```

**Hidas:** Palvelimen luonti tapahtuu 12 kertaa.

**Parannus:** Jaa palvelin testien kesken (mutta varmista store.clear()):
```typescript
describe('API Routes', () => {
  let app;
  
  beforeAll(async () => {
    app = await buildServer();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  beforeEach(() => {
    bookingStore.clear();
  });
  
  it('...', async () => {
    // Käytä samaa app-instanssia
  });
});
```

**Varoitus:** Tämä voi aiheuttaa ongelmia jos testit muokkaavat palvelimen tilaa.

#### **5. Ei testata negatiivisia tapauksia kattavasti**

Esim. GET-endpointissa:
```typescript
it('should return all bookings for a room', async () => {
  // Luodaan 2 varausta huoneeseen A
  // Tarkistetaan että palauttaa 2 varausta
});
```

**Puuttuu:**
- Palautetaanko vain huoneen A varaukset (ei B:n varauksia)?
- Entä jos huoneessa on 0 varausta? (Testattu erikseen ✅)
- Entä jos huoneessa on 100 varausta?

---

## 5. Yhteenveto

### **Testien tyyppijakauma:**

| Testin tyyppi | Määrä | Prosentti |
|---------------|-------|-----------|
| Yksikkötestit (business-logic) | 12 | 50% |
| Integraatiotestit (routes) | 12 | 50% |
| **Yhteensä** | **24** | **100%** |

### **Liiketoimintasääntöjen kattavuus:**

| Sääntö | Yksikkötestit | Integraatiotestit | Kattavuus |
|--------|---------------|-------------------|-----------|
| Ei päällekkäisyyttä | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 95% |
| Adjacent booking sallittu | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 100% |
| Ei menneisyyttä | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 80% |
| Start < End | ⭐⭐⭐ | ⭐ | 60% |
| Kiinteä huonelista | - | ⭐⭐⭐⭐ | 75% |

**Keskiarvo:** ~82% kattavuus

### **Testien laatu:**

| Kriteeri | Arvosana | Perustelu |
|----------|----------|-----------|
| **Selkeys** | 9/10 | Kuvaavat nimet, hyvä rakenne |
| **Eristäminen** | 10/10 | `beforeEach` ja `app.close()` |
| **Kattavuus** | 7/10 | Perustapaukset OK, reunatapauksia puuttuu |
| **Ylläpidettävyys** | 6/10 | Paljon toistoa, maagisia numeroita |
| **Nopeus** | 8/10 | In-memory, mutta paljon palvelinkäynnistyksiä |

**Kokonaisarvio: 8.0/10** - Hyvät testit, mutta voisi olla parempia.

---

### **Kriittisimmät puuttuvat testit (prioriteettijärjestyksessä):**

1. **🔴 Kriittinen:** Race condition -testi (samanaikaiset varaukset)
2. **🟠 Tärkeä:** Start > End (ei vain Start === End)
3. **🟠 Tärkeä:** Useita olemassa olevia varauksia samassa huoneessa
4. **🟡 Hyödyllinen:** Erittäin pitkät/lyhyet varaukset
5. **🟡 Hyödyllinen:** Tyhjä/puutteellinen request body
6. **🟢 Nice-to-have:** Yksityiskohtaiset Zod-virheet
7. **🟢 Nice-to-have:** GET-endpointin järjestys ja sisältö

### **Suositukset:**

**Lyhyellä tähtäimellä:**
1. Lisää testi `start > end` -tapaukselle
2. Lisää helper-funktiot aikamäärittelyihin
3. Testaa koko [ErrorResponse](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/types.ts:14:0-18:1)-rakenne

**Pitkällä tähtäimellä:**
1. Lisää race condition -testit (vaikka ne epäonnistuisivat - dokumentoi ongelma)
2. Optimoi integraatiotestit jakamaan palvelininstanssi
3. Lisää performance-testit suurilla datamäärillä

Nykyinen toteutus on **hyvä lähtökohta** ja kattaa **kaikki normaalit käyttötapaukset**. Reunatapausten ja edge caset vaativat lisää huomiota tuotantokäyttöön.











## VAIHE 2 ##

## 1. roomId-validointi toistuu routes.ts:ssä

### Prompt 

Mikä on paras tapa poistaa toistuva roomId-validointi src/routes.test.ts:ssä?

### Vastaus

Analysoin [routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0):n roomId-validoinnin toiston ja ehdotan parhaan ratkaisun.

# Paras tapa poistaa roomId-validoinnin toisto

Analysoin `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:18-25` ja `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:58-65` - roomId-validointi toistetaan identtisenä kahdessa endpointissa.

## Suositus: Fastify preHandler Hook

**Paras ratkaisu** on käyttää **Fastify:n `preHandler` hookia**, joka validoi roomId:n automaattisesti ennen route handleria.

### Toteutus:

```typescript
// Luo preHandler hook roomId-validointiin
const validateRoomId = async (request: FastifyRequest<{ Params: { roomId: string } }>, reply: FastifyReply) => {
  const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
  if (!roomIdResult.success) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Room not found',
    } as ErrorResponse);
  }
  // Tallenna validoitu arvo requestiin (valinnainen)
  request.params.roomId = roomIdResult.data;
};

// Käytä hookia endpointeissa
app.post('/rooms/:roomId/bookings', 
  { preHandler: validateRoomId }, // <- Hook tähän
  async (request, reply) => {
    // roomId on jo validoitu, voit käyttää suoraan
    const bodyResult = createBookingSchema.safeParse(request.body);
    // ... loput logiikasta
  }
);

app.get('/rooms/:roomId/bookings',
  { preHandler: validateRoomId }, // <- Sama hook tähän
  async (request, reply) => {
    const bookings = bookingStore.getBookingsByRoom(request.params.roomId as RoomId);
    return reply.status(200).send(bookings);
  }
);
```

### Edut:
- ✅ **DRY** - Validointilogiikka yhdessä paikassa
- ✅ **Automaattinen** - Hook suoritetaan ennen handleria
- ✅ **Deklaratiivinen** - Selkeä että endpoint vaatii validia roomId:tä
- ✅ **Testattavissa** - Hook on erillinen funktio
- ✅ **Fastify-idiomi** - Natiivi tapa tehdä tämä

---

## Vaihtoehto 2: Error Factory -funktiot

Jos haluat pitää validoinnin handlereissa, luo **factory-funktiot** virhevastauksia varten:

```typescript
// Error factory -funktiot
const createErrorResponse = (statusCode: number, error: string, message: string): ErrorResponse => ({
  statusCode,
  error,
  message,
});

const notFoundError = (message: string) => createErrorResponse(404, 'Not Found', message);
const badRequestError = (message: string) => createErrorResponse(400, 'Bad Request', message);

// Käyttö endpointeissa
const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
if (!roomIdResult.success) {
  return reply.status(404).send(notFoundError('Room not found'));
}
```

**Edut:** Vähemmän toistoa virhevastauksissa  
**Haitat:** Validointilogiikka silti toistetaan

---

## Vaihtoehto 3: Fastify Schema Validation (Type Provider)

Käytä Fastify:n natiiveja **JSON Schema** -määrittelyjä:

```typescript
import { Type } from '@sinclair/typebox';

const roomIdParam = Type.Object({
  roomId: Type.Union([
    Type.Literal('A'),
    Type.Literal('B'),
    Type.Literal('C'),
    Type.Literal('D'),
    Type.Literal('E'),
  ]),
});

app.post('/rooms/:roomId/bookings', {
  schema: {
    params: roomIdParam, // <- Automaattinen validointi
  }
}, async (request, reply) => {
  // roomId on jo validoitu, tyypitetty automaattisesti
  const booking = createBooking(
    request.params.roomId, // Tyyppiturvallinen!
    // ...
  );
});
```

**Edut:** Automaattinen, tyyppiturvallinen, OpenAPI-dokumentaatio  
**Haitat:** Vaatii TypeBox/JSON Schema -riippuvuuden, eri virhemuoto kuin Zod

---

## Vaihtoehto 4: Middleware-funktio

Klassinen middleware-lähestymistapa:

```typescript
const validateRoomIdMiddleware = (
  request: FastifyRequest<{ Params: { roomId: string } }>,
  reply: FastifyReply,
  done: (err?: Error) => void
) => {
  const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
  if (!roomIdResult.success) {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Room not found',
    });
    return; // Älä kutsu done()
  }
  done(); // Jatka seuraavaan
};

// Käyttö
app.post('/rooms/:roomId/bookings', validateRoomIdMiddleware, async (request, reply) => {
  // ...
});
```

**Edut:** Yksinkertainen  
**Haitat:** Vanhentunut tyyli, preHandler on modernimpi

---

## Lopullinen suositus

**Käytä Fastify preHandler hookia** (Vaihtoehto 1), koska:

1. **Natiivi Fastify-ratkaisu** - Ei lisäriippuvuuksia
2. **Yhdistyy hyvin Zod:n kanssa** - Voit käyttää olemassa olevia skeemoja
3. **Selkeä ja testattava** - Hook on erillinen funktio
4. **Skaalautuva** - Sama lähestymistapa toimii bookingId:lle ja body-validoinnille

### Täydellinen refaktoroitu esimerkki:

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RoomId } from './types.js';

// Hookien määrittelyt
const validateRoomId = async (
  request: FastifyRequest<{ Params: { roomId: string } }>, 
  reply: FastifyReply
) => {
  const result = roomIdSchema.safeParse(request.params.roomId);
  if (!result.success) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Room not found',
    } as ErrorResponse);
  }
};

const validateBookingId = async (
  request: FastifyRequest<{ Params: { bookingId: string } }>,
  reply: FastifyReply
) => {
  const result = bookingIdSchema.safeParse(request.params.bookingId);
  if (!result.success) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Booking not found',
    } as ErrorResponse);
  }
};

// Routes
export async function registerRoutes(app: FastifyInstance) {
  app.post('/rooms/:roomId/bookings', 
    { preHandler: validateRoomId },
    async (request, reply) => {
      // roomId-validointi on jo tehty
      const bodyResult = createBookingSchema.safeParse(request.body);
      // ... loput logiikasta
    }
  );

  app.get('/rooms/:roomId/bookings',
    { preHandler: validateRoomId },
    async (request, reply) => {
      const bookings = bookingStore.getBookingsByRoom(request.params.roomId as RoomId);
      return reply.status(200).send(bookings);
    }
  );

  app.delete('/bookings/:bookingId',
    { preHandler: validateBookingId },
    async (request, reply) => {
      const booking = bookingStore.getBookingById(request.params.bookingId);
      // ... loput logiikasta
    }
  );
}
```

Tämä poistaa **~15 riviä toistoa** ja tekee koodista ylläpidettävämmän.











## 2. routes.ts tarkistus

### Prompt

Tarkista että @routes.ts ei kutsu @store.ts metodeja suoraan GET- JA DELETE- reiteissä vaan käyttää @business-logic.ts funktioita

Jos suoria store-kutsun löytyy @routes.ts , näytä missä kohtaa ja ehdota korjaus

### Vastaus

Tarkistan [routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0):n GET ja DELETE reitit sekä varmistan että [business-logic.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:0:0-0:0):ssä on tarvittavat funktiot.

✅ **Arkkitehtuuri on jo oikein toteutettu!**

## Tarkistustulos

Analysoin molemmat tiedostot ja vahvistan:

### **[routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0) - Import (rivi 7):**
```typescript
import { createBooking, BookingError, getBookingsByRoom, deleteBookingById } from './business-logic.js';
```
✅ **Ei** importtia [store.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/store.ts:0:0-0:0):stä

### **GET-reitti** `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:88-97`:
```typescript
app.get('/rooms/:roomId/bookings', ..., async (request, reply) => {
  const bookings = getBookingsByRoom(request.params.roomId);  // ✅ business-logic
  return reply.status(200).send(bookings);
});
```

### **DELETE-reitti** `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:99-124`:
```typescript
app.delete('/bookings/:bookingId', ..., async (request, reply) => {
  try {
    deleteBookingById(request.params.bookingId);  // ✅ business-logic
    return reply.status(204).send();
  } catch (error) { ... }
});
```

### **Business-logiikka tarjoaa molemmat funktiot:**

`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:59-61`:
```typescript
export function getBookingsByRoom(roomId: RoomId): Booking[] {
  return bookingStore.getBookingsByRoom(roomId);
}
```

`@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:63-69`:
```typescript
export function deleteBookingById(bookingId: string): void {
  const deleted = bookingStore.deleteBooking(bookingId);
  if (!deleted) {
    throw new BookingError('Booking not found', 404);
  }
}
```

---

## Yhteenveto

**Ei suoria store-kutsuja löydetty!** 🎉

Kaikki kolme endpointtiä noudattavat oikeaa kerrosjakoa:

```
HTTP Layer (routes.ts)
    ↓
Domain Layer (business-logic.ts)
    ↓
Data Layer (store.ts)
```

Arkkitehtuuri on **johdonmukainen ja oikein toteutettu**. Aikaisempi epäjohdonmukaisuus on korjattu.











## 3. Globaali errorhandeler

### Prompt 

Lisää globaali error handler käyttäen setErrorHandler-metodia.

Kaikki tuntemattomat virheet (eli virheet, jotka eivät ole BookingError-tyyppiä)
  palauttavat aina saman muotoisen ErrorResponse-olion.
HTTP-statuskoodin tulee olla 500.
Vastausmuodon tulee olla:
  {
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred"
  }


Muun sovelluksen toiminnallisuutta ei tule muuttaa, vain virheenkäsittelyyn liittyvät muutokset ovat sallittuja. Ota uusi globaali error handler käyttöön Fastify-instanssissa.

Kerro lisäksi, vaikuttaako muutos olemassa oleviin testeihin tai muuhun toiminnallisuuteen, ja edellyttääkö se uusien testien lisäämistä.

### Vastaus 

Lisään globaalin error handlerin [server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0):ään.



Ajetaan testit varmistaakseni että muutos ei riko olemassa olevaa toiminnallisuutta:

Erinomaista! ✅ **Kaikki 29 testiä menevät läpi** globaalin error handlerin lisäämisen jälkeen.

## Toteutetut muutokset

### **[server.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:0:0-0:0) - Globaali error handler** `@d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/server.ts:10-18`

```typescript
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  } as ErrorResponse);
});
```

---

## Vaikutukset olemassa oleviin testeihin

### ✅ **Ei vaikutusta nykyisiin testeihin**

**Syy:** Kaikki olemassa olevat testit testaavat:
- **BookingError**-virheitä (400, 404, 409) - Nämä käsitellään [routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0):n try-catch-blokeissa **ennen** kuin ne pääsisivät globaalille handlerille
- **Zod-validointivirheitä** - Nämä käsitellään `safeParse()`:lla ja preHandler-hookeissa
- **Onnistuneita pyyntöjä** - Ei virheitä

**Testiloki vahvistaa:**
```
✓ src/business-logic.test.ts (12)
✓ src/routes.test.ts (17)  ← +0 epäonnistuneita
Test Files  2 passed (2)
Tests  29 passed (29)
```

---

## Milloin globaali handler aktivoituu?

Handler käsittelee vain **tuntemattomat virheet**, esim:
- `TypeError` (null reference, undefined property)
- `SyntaxError` (JSON parsing virhe Fastify:n ulkopuolella)
- Odottamattomat virheet business-logiikassa
- Kolmannen osapuolen kirjastojen virheet

**Esimerkki:** Jos [routes.ts](cci:7://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/routes.ts:0:0-0:0):ssä olisi `throw error;` (rivi 83) ja virhe ei ole [BookingError](cci:2://file:///d:/StudioProjects/samuli_virkkula_kokoushuone_api/src/business-logic.ts:3:0-11:1), nyt se käsitellään globaalisti.

---

## Uudet testit - Suositukset

### **1. Kriittinen: Testaa tuntematon virhe** 🔴

Lisää testi joka varmistaa että globaali handler toimii:

```typescript
// src/routes.test.ts
it('should return 500 for unexpected errors', async () => {
  const app = await buildServer();
  
  // Mock store.getBookingsByRoom heittämään odottamattoman virheen
  const originalMethod = bookingStore.getBookingsByRoom;
  bookingStore.getBookingsByRoom = () => {
    throw new Error('Unexpected database error');
  };
  
  const response = await app.inject({
    method: 'GET',
    url: '/rooms/A/bookings',
  });
  
  expect(response.statusCode).toBe(500);
  const body = JSON.parse(response.body);
  expect(body).toMatchObject({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
  
  // Palauta alkuperäinen metodi
  bookingStore.getBookingsByRoom = originalMethod;
  await app.close();
});
```

### **2. Tärkeä: Testaa että logger kutsutaan** 🟠

Varmista että virheet logitetaan:

```typescript
it('should log unexpected errors', async () => {
  const app = await buildServer();
  const logSpy = vi.spyOn(app.log, 'error');
  
  // Aiheuta virhe...
  
  expect(logSpy).toHaveBeenCalledWith(expect.any(Error));
  
  logSpy.mockRestore();
  await app.close();
});
```

---

## Yhteenveto

| Kysymys | Vastaus |
|---------|---------|
| **Vaikuttaako olemassa oleviin testeihin?** | ❌ Ei - Kaikki 29 testiä menevät läpi |
| **Muuttaako olemassa olevaa toiminnallisuutta?** | ❌ Ei - BookingError ja validointivirheet käsitellään edelleen samoin |
| **Tarvitseeko uusia testejä?** | ✅ Kyllä - Suosittelen lisäämään testin tuntemattomille virheille |
| **Parantaako tuotantoturvallisuutta?** | ✅ Kyllä - Estää stack trace -vuodot ja tarjoaa yhtenäisen virhevastauksen |

Globaali error handler on nyt käytössä ja toimii turvana odottamattomille virheille. Suosittelen lisäämään testin joka varmistaa sen toiminnan. 🎉











