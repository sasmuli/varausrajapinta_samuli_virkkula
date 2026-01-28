1. Mitä tekoäly teki hyvin?

Tekoäly onnistui tuottamaan nopeasti toimivan perusratkaisun kokoushuoneiden varaus-API:lle. Yhdellä generoinnilla syntyi ajettava Fastify-sovellus, jossa oli reitit, in-memory
 datastore, validoinnit ja testit. Projekti oli heti ajettavissa ilman lisäkonfiguraatiota, ja kehitystyökalut (dev-, build- ja test-skriptit) olivat valmiina.

Tekoäly toteutti myös oleelliset liiketoimintasäännöt oikein testien perusteella: varaukset eivät mene päällekkäin, varaus ei voi olla menneisyydessä, aloitusajan täytyy olla 
ennen lopetusaikaa ja peräkkäiset varaukset ovat sallittuja. Projekti oli jaettu useaan tiedostoon (routes, business-logic, store, validation, types), mikä loi hyvän lähtökohdan 
jatkokehitykselle.

Tekoäly myös loi testejä alusta asti sekä liiketoimintalogiikalle että API-reiteille. Tämä mahdollisti helpomman refaktoroinnin myöhemmissä vaiheissa.

2. Mitä tekoäly teki huonosti?

Vaikka tekoäly tuotti toimivan ratkaisun, siinä oli useita kohtia, jotka vaativat tarkastelua ja parantelua.

Ensimmäinen selkeä ongelma oli dokumentaation ja toteutuksen ristiriita. README oletti huonelistan olevan A–E, vaikka tehtävänannon ja omien oletusteni mukaisesti huoneita oli 
vain A, B ja C, jotka olin aiemmin kirjannut README:ssä. Tämä osoitti, että tekoäly teki oletuksia, jotka eivät perustuneet minun vaatimuksiini.

Virheenkäsittely oli aluksi osittain hajanaista. Osa virheistä palautui Fastifyn oletusmuodossa ja osa käsiteltiin manuaalisesti, mikä johti epäyhtenäiseen virhevastausmuotoon. 
Lisäksi domain-virheiden ja HTTP-kerroksen vastuunjako jäi osittain epäselväksi.

Rakenteellisesti GET- ja DELETE-reitit käyttivät suoraan storea, kun taas POST käytti business-logiikkaa. Tämä rikkoi arkkitehtuuria ja teki vastuista epäselviä.

Lisäksi Zod-validointivirheissä palautettiin vain geneerinen virheviesti ilman tarkempaa tietoa virheen syystä, mikä heikensi kehittäjäkokemusta. Testiajon aikana Fastifyn lokit 
tulostuivat konsoliin, mikä lisäsi epäselvyyttä ja aiheutti että tuloksien lukeminen oli vaikeampaa.

Kokonaisuutena tekoälyn tuottama koodi oli hyvä lähtötaso, mutta siitä puuttui vielä viimeistelyä, johdonmukaisuutta ja selkeitä arkkitehtuuripäätöksiä.

3. Mitkä olivat tärkeimmät parannukset, jotka tein ja miksi?

Ensimmäiseksi yhtenäistin huoneoletukset koko projektissa. Päivitin dokumentaation ja varmistin, että koodi ja testit käsittelevät vain huoneita A, B ja C. Tämä poisti 
ristiriidan dokumentaation ja toteutuksen välillä.

Seuraavaksi paransin arkkitehtuuria siirtämällä kaiken liiketoimintalogiikan business-logic-kerrokseen ja yhtenäistämällä reittien toimintatavan. GET- ja DELETE-reitit eivät 
enää kutsu storea suoraan, vaan kaikki varauksiin liittyvät operaatiot käyttävät yhtä selkeää rajapintaa. Tämä teki koodista helpommin testattavaa ja ylläpidettävää.

Virheenkäsittelyä paransin lisäämällä globaalin error handlerin Fastify-instanssiin. Tämän ansiosta kaikki odottamattomat virheet palauttavat aina yhtenäisen 
500-virhevastausmuodon, jolloin sisäisiä virheitä ei vuoda asiakkaalle.

Lisäksi paransin Zod-validointivirheiden käsittelyä palauttamalla POST-endpointissa tarkemmat virhetiedot (issues). Tämä parantaa merkittävästi API:n käytettävyyttä kehittäjille 
ilman, että mitään arkaluontoista tietoa ei näytetä. Lisäksi parantin Fastifyn lokeja, jotta ne olisivat helpommin lukettavia.

Lisäsin testejä niihin kohtiin, joista puuttui vielä kattavuus, erityisesti rajatapauksiin kuten tilanteisiin, joissa aloitusaika on yhtä suuri tai suurempi kuin lopetusaika. 
Lisäksi tarkistin testein virhevastausten rakenteen, mikä teki refaktoroinnista huomattavasti turvallisempaa.

Tärkein parannus oli viedä ratkaisu pelkästä toimivuudesta kohti selkeämpää ja johdonmukaisempaa kokonaisuutta. Arkkitehtuurin selkeyttäminen, virheenkäsittelyn yhtenäistäminen 
ja testien täydentäminen tekivät koodista helpommin ylläpidettävää ja turvallisemman muuttaa jatkossa.
