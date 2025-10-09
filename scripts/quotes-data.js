/**
 * Données de citations (5 items) — Ivry Échecs 94
 *
 * Exigence: 5 citations, auteur + années (sans source/note).
 * Remarque: exposées en global via window.QUOTES pour usage sans module.
 */
(function () {
  const QUOTES = [
    { text: "Pour progresser, il faut étudier les finales avant toute chose.", author: "José Raúl Capablanca", born: 1888, died: 1942 },
    { text: "Quand vous voyez un bon coup, cherchez-en un meilleur.", author: "Emanuel Lasker", born: 1868, died: 1941 },
    { text: "Aidez vos pièces, elles vous aideront.", author: "Paul Morphy", born: 1837, died: 1884 },
    { text: "Il y a plus d'aventures sur un échiquier que sur toutes les mers du monde.", author: "Pierre Mac Orlan", born: 1882, died: 1970 },
    { text: "La tactique, c'est ce que vous faites quand il y a quelque chose à faire ; la stratégie, c'est ce que vous faites quand il n'y a rien à faire.", author: "Savielly Tartakower", born: 1887, died: 1956 },
  ];

  // Expose global pour scripts non-modules
  window.QUOTES = QUOTES;
})();

