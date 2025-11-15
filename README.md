# AK-Templates - React Customizable Website Builder

Een React-platform waar gebruikers eenvoudig websites kunnen bouwen en aanpassen met vooraf gemaakte componenten.

## Features

### Site Types
- **Single-Page Site**: Een één-pagina website waar navigatie naar secties scrolt
- **Multi-Page Site**: Een meerdere-pagina website waar tabs naar aparte pagina's leiden

### Aanpasbare Componenten

#### Navbar
- Kleur aanpassen (achtergrond en tekst)
- Tabs toevoegen, bewerken en verwijderen
- Dynamische navigatie (scroll naar sectie of pagina link)

#### Vooraf gemaakte Secties
1. **Hero Section**: Welkomstpagina met titel, subtitel en call-to-action knop
2. **About Section**: Over ons sectie met aanpasbare content
3. **Services Section**: Diensten overzicht met meerdere service cards
4. **Contact Section**: Contactinformatie met email en telefoon

### Aanpassing via Formulieren
Elke component kan aangepast worden via input velden:
- Kleuren (achtergrond en tekst)
- Tekst content
- Button styling
- Services en andere dynamische content

## Installation

```bash
npm install
```

## Development

Start de development server:

```bash
npm run dev
```

De applicatie opent op `http://localhost:5173/`

## Build

Build de applicatie voor productie:

```bash
npm run build
```

## Lint

Check code kwaliteit:

```bash
npm run lint
```

## Usage

1. **Open de Builder**: Navigeer naar de homepage om de website builder te zien
2. **Kies Site Type**: Selecteer tussen Single-Page of Multi-Page site
3. **Pas Navbar aan**: Verander kleuren en voeg tabs toe/verwijder tabs
4. **Customizeer Secties**: Bewerk elke sectie met de formulieren aan de linkerkant
5. **Live Preview**: Zie je wijzigingen direct in de preview aan de rechterkant
6. **Preview Mode**: Klik op "Preview Mode" voor een volledig scherm preview

## Project Structure

```
src/
├── components/         # Herbruikbare componenten
│   ├── Navbar.jsx     # Navigatie component
│   ├── NavbarCustomizer.jsx   # Navbar aanpassing formulier
│   └── SectionCustomizer.jsx  # Sectie aanpassing formulier
├── contexts/          # React Context voor state management
│   └── SiteContext.jsx # Site configuratie context
├── pages/            # Pagina componenten
│   ├── BuilderPage.jsx        # Hoofdpagina met editor
│   ├── SinglePageSite.jsx     # Single-page preview
│   └── MultiPageSite.jsx      # Multi-page preview
├── sections/         # Sectie componenten
│   ├── HeroSection.jsx
│   ├── AboutSection.jsx
│   ├── ServicesSection.jsx
│   └── ContactSection.jsx
├── App.jsx           # Hoofdapplicatie component
└── main.jsx          # Entry point
```

## Technologies

- **React 19** - UI framework
- **React Router DOM** - Routing voor multi-page functionaliteit
- **Vite** - Build tool en development server
- **Context API** - State management

## Screenshots

### Builder Interface
![Builder Interface](https://github.com/user-attachments/assets/b2af5c9f-900c-44fd-b030-4548a023f456)

### Single-Page Site Preview
![Single-Page Site](https://github.com/user-attachments/assets/01cf4953-f9a9-46f2-af74-aaee6ed39e4a)

