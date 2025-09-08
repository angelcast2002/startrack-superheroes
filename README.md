# Startrack – Frontend Technical Test (React + TS)

Lista de superhéroes con búsqueda y favoritos, desarrollada en **React + TypeScript** y estilizada con **Tailwind CSS**.  
Cumple los requisitos del test: favoritos persistidos por **IDs**, colapso con **persistencia**, **scroll** automático al último favorito, **skeletons** de carga, **virtualización** de la lista general (altura fija & renderiza solo lo visible) y diseño **responsivo**.

---

## 🚀 Demo local

```bash
# Requisitos: Node 18+ y npm
npm i
npm run dev
```

- App: http://localhost:5173  
- Build producción: `npm run build` → carpeta `dist/`  
- Preview del build: `npm run preview`

> Si Vite muestra “Outdated Optimize Dep” u optimizaciones raras:
> ```bash
> rm -rf node_modules/.vite
> npm run dev -- --force
> ```

---

## 🚀 Demo Online - Netlify

[Superheroes](https://starttrackproof.netlify.app/)

## 🧰 Stack

- **React 18 + TypeScript**
- **Vite**
- **Tailwind CSS**
- **react-content-loader** → skeletons
- **VirtualGrid** casero → virtualización sin dependencias

---

## 📦 Estructura (resumen)

```
src/
  assets/                   # íconos SVG y logo
  components/
    HeroCard.tsx
    HeroCardSkeleton.tsx
    HeroGridSkeleton.tsx
    SearchBar.tsx
    VirtualGrid.tsx         # grid virtualizado (reutilizable)
  interfaces/
    hero.ts                 # tipos del API
  pages/
    LikedHeroes.tsx         # pantalla principal
  services/
    superheroesService.ts   # fetch + cache TTL + búsqueda
  store/
    favorites.ts            # hook de favoritos por IDs (localStorage)
  App.tsx
  main.tsx
  index.css
```

---

## 🔌 Datos & API

- Fuente: `https://akabab.github.io/superhero-api/api/all.json`  
- **Sin backend**. En redes con CORS estrictos puedes usar (opcional):  
  `https://cors-anywhere.herokuapp.com/https://akabab.github.io/superhero-api/api/all.json`

---

## ✨ Funcionalidades

- **Búsqueda** por `name` y `biography.fullName` (en la lista general).
- **Favoritos**:
  - Alternar `Like/Unlike` en cada card.
  - Las cards se mueven entre **General** ⇄ **Liked**.
  - **Orden estable**: se agregan **al final**.
  - Persistencia de **IDs** en `localStorage` (p. ej. `[23, 1, 45, 12]`).
  - **Badge** “Liked recently” por unos segundos al agregar.
  - **Scroll automático** a la última card agregada (abre la sección si estaba colapsada).
- **Sección Liked**:
  - **Colapsable** con persistencia del estado en `localStorage`.
- **Lista General**:
  - **Altura fija** (< `100vh`, p. ej. ~60vh).
  - **Virtualización** (renderiza sólo lo visible + overscan).
  - **Múltiples cards por fila**, responsivo (cálculo automático por ancho).
  - **Scrollbar oculta** visualmente (el scroll sigue funcionando).
- **Skeletons** de carga (`react-content-loader`).
- **Power score** = promedio simple de `powerstats` (escala 0–10).
- **Cache** en memoria del fetch (TTL configurable).

---

## 🧠 Decisiones técnicas

- **Favoritos por IDs** (`useFavorites()`): guarda y restaura `number[]` (requisito del PDF).  
- **VirtualGrid** propio: sin dependencias, columnas por `ResizeObserver`, posicionamiento con `absolute`, solo render visible.  
- **AbortController** al hacer fetch (cancelación segura).  
- **Persistencias**:
  - `startrack:favorites` → `number[]` de favoritos
  - `startrack:likedOpen` → boolean del colapso

---

## 🧪 Scripts

```bash
npm run dev       # desarrollo
npm run build     # producción
npm run preview   # servir la build local
```

---

## ♿ Accesibilidad & UX

- Botones con `aria-pressed` en el corazón.
- Skeletons para estados de carga (evitan “saltos”).
- Transiciones con `transition: 0.3s ease` (requisito del PDF).

---

## ✅ Checklist vs enunciado

- [x] UI de carga (**react-content-loader**)
- [x] Colapso de favoritos con **persistencia**
- [x] Card clickeada se **mueve** entre listas
- [x] Al añadir favorito: **scroll** a la última + badge + **añadir al final**
- [x] Favoritos **restaurados** al recargar (por **IDs**)
- [x] Búsqueda por **nombre** y **nombre real** (lista general)
- [x] App **responsiva**
- [x] React + TypeScript
- [x] **Sin DB**
- [x] Lista general con **altura fija** (< ventana) y **render solo visible** (**virtualización**)
- [x] Power score desde `powerstats`
- [x] Transiciones `0.3s ease`

---
