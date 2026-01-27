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
