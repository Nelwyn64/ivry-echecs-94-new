/**
 * Module de données — Citations d'échecs (mystère/philo)
 *
 * Format d’un élément du tableau QUOTES:
 * { text: string, author: string, born: number|null, died: number|null, source: string, note?: string }
 *
 * Note: la 3e citation est « attribuée » — l’auteur exact est débattu.
 * Références: ouvrages et recueils mentionnés dans chaque source.
 */

(function () {
  const QUOTES = [
    {
      text: "Pour progresser, il faut étudier les finales avant toute chose.",
      author: "José Raúl Capablanca",
      born: 1888,
      died: 1942,
      source: "Chess Fundamentals, 1921",
    },
    {
      text: "Quand vous voyez un bon coup, cherchez-en un meilleur.",
      author: "Emanuel Lasker",
      born: 1868,
      died: 1941,
      source: "Common Sense in Chess (conf. 1895 / publ. 1910)",
    },
    {
      text:
        "Les Échecs ont trois composantes : le temps, l'espace et le matériel — en dernier.",
      author: "Attribué",
      born: null,
      died: null,
      source: "Maxime pédagogique (tradition moderne), attribution discutée",
      note:
        "Affichage 'Attribué' car l'auteur exact est débattu.",
    },
    {
      text: "Aidez vos pièces, elles vous aideront.",
      author: "Paul Morphy",
      born: 1837,
      died: 1884,
      source: "Aphorisme, recueils de maximes",
    },
    {
      text:
        "Il y a plus d'aventures sur un échiquier que sur toutes les mers du monde.",
      author: "Pierre Mac Orlan",
      born: 1882,
      died: 1970,
      source: "Citation littéraire (recueils)",
    },
    {
      text:
        "La tactique, c'est ce que vous faites quand il y a quelque chose à faire ; la stratégie, c'est ce que vous faites quand il n'y a rien à faire.",
      author: "Savielly Tartakower",
      born: 1887,
      died: 1956,
      source:
        "Bréviaire des échecs / Die Hypermoderne Schachpartie (aphorisme)",
    },
  ];

  // Expose en global (script non module) pour consommation par quotes-carousel.js
  window.QUOTES = QUOTES;
})();

