# Site vitrine – Ivry Échecs 94

Un site statique (HTML/CSS/JS) pour le club **Ivry Échecs 94** (Ivry-sur-Seine, Val-de-Marne).  
Contact principal : **ivryechecs@gmail.com**

## 🎯 Objectifs
- Présenter clairement le club et ses activités.
- Faciliter l’adhésion et la prise de contact.
- Offrir une navigation simple via 6 sections : **Accueil**, **Club**, **Tarifs**, **Adhésion**, **Liens utiles**, **Contact**.
- Optimisé pour mobile, rapide, accessible (WCAG AA) et SEO-friendly.

## 🧭 Navigation (header)
Header fixé en haut, **logo à gauche**, **6 boutons** à droite :
- Accueil (`/` ou `#accueil`)
- Club (`/about/` ou `#club`)
- Tarifs (`/tarifs/` ou `#tarifs`)
- Adhésion (`/adhesion/` ou `#adhesion`)
- Liens utiles (`/liens-utiles/` ou `#liens-utiles`)
- Contact (`/contact/` ou `#contact`)

### Structure HTML du header (déjà présente dans `header.html`)
Voir `ivry-echecs-94/header.html` (logo `/assets/logo-3.png`, menu conforme).

---

## 📁 Arborescence (extrait du projet fourni)
- Pages/sections Markdown : `content/index.md`, `content/about.md`, `content/tarifs.md`, `content/adhesion.md`, `content/liens-utiles.md`, `content/contact.md`
- Gabarits : `index.html`, `header.html`, `footer.html`
- Assets fournis : `assets/bg-*.jpg`, `assets/logo-3.png`, `assets/favicon.svg`

---

## 🧩 Contenus intégrés depuis le ZIP
- **Nom du club** : Ivry Échecs 94
- **E-mail** : ivryechecs@gmail.com
- **Liens utiles** (exemples présents) : FFE, Chess.com, Lichess, Comité 94, Ligue IDF, boutiques spécialisées.
- **Adhésion** : documents PDF d’attestation/questionnaires dans `assets/uploads/` (voir `content/adhesion.md`).
- **Tarifs** : gabarit présent dans `content/tarifs.md` (saison 2024–2025, à confirmer).

> Remarque : certains montants sont signalés comme « indicatifs » dans les fichiers fournis. Mettre à jour en début de saison.

---

## 🖼️ Fonds d’écran « lisibles » (créés à partir des images du ZIP, sans doublons)
J’ai généré des arrières‑plans adoucis (flou léger + assombrissement + vignette) pour améliorer la lisibilité du texte par‑dessus. Deux résolutions par image : **1920×1080** et **2560×1440**.

Fichiers générés :
- `bg-index-readable-1920x1080.png`, `bg-index-readable-2560x1440.png`
- `bg-about-readable-1920x1080.png`, `bg-about-readable-2560x1440.png`
- `bg-agenda-readable-1920x1080.png`, `bg-agenda-readable-2560x1440.png`
- `bg-tarifs-readable-1920x1080.png`, `bg-tarifs-readable-2560x1440.png`
- `bg-adhesion-readable-1920x1080.png`, `bg-adhesion-readable-2560x1440.png`
- `bg-contact-readable-1920x1080.png`, `bg-contact-readable-2560x1440.png`
- `bg-cormailles-readable-1920x1080.png`, `bg-cormailles-readable-2560x1440.png`

Chemin de sortie : `/mnt/data/backgrounds/…` (voir liens de téléchargement ci-dessous).

### Utilisation CSS recommandée
Ajoutez des classes sur le `<body>` en fonction de la page, puis appliquez le fond correspondant :

```css
/* Exemple générique */
.page-hero { 
  min-height: 60vh; 
  display: grid; 
  place-items: center; 
  text-align: center;
  color: #fff;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* Pages */
.body-accueil .page-hero { background-image: url('/assets/backgrounds/bg-index-readable-1920x1080.png'); }
.body-club    .page-hero { background-image: url('/assets/backgrounds/bg-about-readable-1920x1080.png'); }
.body-tarifs  .page-hero { background-image: url('/assets/backgrounds/bg-tarifs-readable-1920x1080.png'); }
.body-adhesion .page-hero { background-image: url('/assets/backgrounds/bg-adhesion-readable-1920x1080.png'); }
.body-liens   .page-hero { background-image: url('/assets/backgrounds/bg-agenda-readable-1920x1080.png'); }
.body-contact .page-hero { background-image: url('/assets/backgrounds/bg-contact-readable-1920x1080.png'); }

/* Amélioration de la lisibilité possible avec un voile supplémentaire */
.page-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(transparent, rgba(0,0,0,.35));
}
```

> Conseil : pour écrans ≥ 1440px, servez la version 2560×1440 via `@media (min-width: 1440px)` ou `image-set()`.

---

## ♿ Accessibilité
- Contraste AA assuré par l’assombrissement de fond.
- Navigation clavier complète; focus visible.
- `alt` descriptifs pour les images.
- Langue du document : `<html lang="fr">`.

## 🔎 SEO
- Balises `<title>` uniques, méta description.
- Open Graph/Twitter pour le partage.
- Sitemap + robots.

## ⚡ Performance
- Images compressées; dimensions explicites.
- CSS/JS minifiés; JS en `defer`.
- Cache + CDN si possible.

## 🔐 Légal
- Mentions légales (éditeur, hébergeur, contact).
- Politique de confidentialité (formulaire).
- Bandeau cookies uniquement si nécessaire.

## 🚀 Déploiement
- GitHub Pages / Netlify / Vercel.
- Dossier à déployer : projet fourni (ou build).

## ✅ Checklist
- [ ] Mettre à jour les **montants exacts** des tarifs.
- [ ] Vérifier les **créneaux/lieux** d’entraînement (Ivry-sur-Seine).
- [ ] Renseigner liens d’**inscription** (si HelloAsso/FFE).
- [ ] Tester contraste/lisibilité sur mobile et desktop.
- [ ] Passer Lighthouse ≥ 90 (Perf/Access/SEO/Best Practices).
