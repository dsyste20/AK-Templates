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

## Supabase Setup

Deze applicatie gebruikt Supabase voor gebruikersauthenticatie en databeheer. Volg deze stappen om Supabase in te stellen:

### 1. Maak een Supabase Project

1. Ga naar [https://app.supabase.com](https://app.supabase.com)
2. Maak een account aan of log in
3. Klik op "New Project"
4. Kies een naam, database wachtwoord en regio
5. Wacht tot het project is aangemaakt

### 2. Verkrijg je API Credentials

1. Ga naar Project Settings (tandwiel icoon) > API
2. Kopieer de volgende waarden:
   - **Project URL** (onder "Project URL")
   - **anon/public key** (onder "Project API keys")

### 3. Configureer Environment Variabelen

1. Kopieer het `.env.example` bestand naar `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` en vul je Supabase credentials in:
   ```
   VITE_SUPABASE_URL=https://jouwproject.supabase.co
   VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
   ```

### 4. Maak de Templates Tabel aan

Voor het databeheer voorbeeld moet je een `templates` tabel aanmaken in Supabase:

1. Ga naar je Supabase project dashboard
2. Klik op "SQL Editor" in het menu
3. Voer de volgende SQL uit:

```sql
-- Maak de templates tabel aan
create table templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table templates enable row level security;

-- Policy: Gebruikers kunnen alleen hun eigen templates zien
create policy "Gebruikers kunnen hun eigen templates zien"
  on templates for select
  using (auth.uid() = user_id);

-- Policy: Gebruikers kunnen alleen hun eigen templates aanmaken
create policy "Gebruikers kunnen hun eigen templates aanmaken"
  on templates for insert
  with check (auth.uid() = user_id);

-- Policy: Gebruikers kunnen alleen hun eigen templates updaten
create policy "Gebruikers kunnen hun eigen templates updaten"
  on templates for update
  using (auth.uid() = user_id);

-- Policy: Gebruikers kunnen alleen hun eigen templates verwijderen
create policy "Gebruikers kunnen hun eigen templates verwijderen"
  on templates for delete
  using (auth.uid() = user_id);

-- Index voor betere performance
create index templates_user_id_idx on templates(user_id);
```

4. Klik op "Run" om de SQL uit te voeren

### 5. (Optioneel) Email Instellingen

Standaard stuurt Supabase bevestigingsmails. Voor ontwikkeling kun je dit uitschakelen:

1. Ga naar Authentication > Settings
2. Onder "Email Auth" kun je "Confirm email" uitschakelen voor snellere testing
3. Voor productie wordt email confirmatie wel aanbevolen!

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

## Authenticatie & Gebruikersbeheer

### Registreren

1. Ga naar `/register` of klik op "Registreer hier" op de loginpagina
2. Voer je email en wachtwoord in (minimaal 6 karakters)
3. Bevestig je wachtwoord
4. Klik op "Registreren"
5. Je wordt automatisch ingelogd en doorgestuurd naar de builder

### Inloggen

1. Ga naar `/login`
2. Voer je email en wachtwoord in
3. Klik op "Inloggen"
4. Je wordt doorgestuurd naar de builder

### Uitloggen

1. Klik op de "Uitloggen" knop rechtsboven in de builder
2. Je wordt doorgestuurd naar de loginpagina

## Beveiligde Routes

De volgende pagina's zijn alleen toegankelijk voor ingelogde gebruikers:
- `/` (Builder Page) - De hoofdpagina met de website builder

Niet-ingelogde gebruikers worden automatisch doorgestuurd naar `/login`.

## Databeheer (Templates)

De applicatie bevat een voorbeeld CRUD component voor het beheren van templates:

- **Toevoegen**: Vul de naam en optionele beschrijving in en klik op "Template Toevoegen"
- **Bekijken**: Al je templates worden automatisch geladen
- **Bewerken**: Klik op "Bewerken" bij een template, pas de gegevens aan en klik op "Opslaan"
- **Verwijderen**: Klik op "Verwijderen" bij een template en bevestig

Alle data wordt automatisch gefilterd per gebruiker door Row Level Security (RLS) in Supabase.

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
│   ├── SectionCustomizer.jsx  # Sectie aanpassing formulier
│   ├── ProtectedRoute.jsx     # Route bescherming component
│   └── TemplatesManager.jsx   # Templates CRUD component (voorbeeld)
├── contexts/          # React Context voor state management
│   ├── SiteContext.jsx # Site configuratie context
│   └── AuthContext.jsx # Authenticatie context
├── lib/               # Utility libraries
│   └── supabaseClient.js # Supabase client en auth helpers
├── pages/            # Pagina componenten
│   ├── BuilderPage.jsx        # Hoofdpagina met editor (beschermd)
│   ├── SinglePageSite.jsx     # Single-page preview
│   ├── MultiPageSite.jsx      # Multi-page preview
│   ├── Login.jsx              # Login pagina
│   └── Register.jsx           # Registratie pagina
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
- **Supabase** - Backend as a Service voor authenticatie en databeheer
  - Gebruikersauthenticatie (sign up, sign in, sign out)
  - PostgreSQL database met Row Level Security (RLS)
  - Real-time subscriptions voor auth state changes

## Screenshots

### Builder Interface
![Builder Interface](https://github.com/user-attachments/assets/b2af5c9f-900c-44fd-b030-4548a023f456)

### Single-Page Site Preview
![Single-Page Site](https://github.com/user-attachments/assets/01cf4953-f9a9-46f2-af74-aaee6ed39e4a)

