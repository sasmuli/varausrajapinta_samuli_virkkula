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

<!-- Liitä tähän tekoälyn koko vastaus sellaisenaan -->
