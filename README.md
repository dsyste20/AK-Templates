# AK-Templates - React Customizable Website Builder

Een React-platform waar gebruikers eenvoudig websites kunnen bouwen en aanpassen met vooraf gemaakte componenten.

## Features

### Gebruikersauthenticatie
- **Registratie**: Gebruikers kunnen zich registreren met naam, email en wachtwoord
- **Login**: Beveiligde login met email en wachtwoord
- **Route Bescherming**: Alle pagina's (behalve homepage) zijn beschermd en vereisen authenticatie
- **Profiel Beheer**: Gebruikers kunnen hun accountgegevens bekijken en bewerken
- **Templates Beheer**: Volledige CRUD functionaliteit voor persoonlijke templates

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

Deze applicatie gebruikt Supabase voor authenticatie en database beheer. Volg deze stappen om Supabase in te stellen:

### 1. Maak een Supabase Project aan

1. Ga naar [https://supabase.com](https://supabase.com) en maak een account aan
2. Klik op "New Project" en vul de details in:
   - Project naam (bijv. "ak-templates")
   - Database wachtwoord (bewaar dit veilig!)
   - Regio (kies een dichtbijzijnde regio)
3. Wacht tot het project is aangemaakt (kan een paar minuten duren)

### 2. Haal je API credentials op

1. Ga naar je project dashboard
2. Klik op het "Settings" icoon in de sidebar
3. Klik op "API" onder Project Settings
4. Kopieer de volgende waarden:
   - **Project URL** (onder "Project URL")
   - **anon/public key** (onder "Project API keys")

### 3. Configureer Environment Variables

1. Kopieer het `.env.example` bestand naar `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` en vul je Supabase credentials in:
   ```
   VITE_SUPABASE_URL=https://jouwproject.supabase.co
   VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
   ```

### 4. Maak Database Tabellen aan

Ga naar de SQL Editor in je Supabase dashboard en voer de volgende queries uit:

#### Profiles Tabel
```sql
-- Maak profiles tabel aan
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Gebruikers kunnen hun eigen profiel lezen
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Gebruikers kunnen hun eigen profiel aanmaken
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Gebruikers kunnen hun eigen profiel updaten
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Templates Tabel
```sql
-- Maak templates tabel aan
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Gebruikers kunnen hun eigen templates lezen
CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Gebruikers kunnen templates aanmaken
CREATE POLICY "Users can insert own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Gebruikers kunnen hun eigen templates updaten
CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Gebruikers kunnen hun eigen templates verwijderen
CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Configureer Authenticatie Instellingen

1. Ga naar "Authentication" > "Settings" in je Supabase dashboard
2. Onder "Auth Providers", zorg dat "Email" is ingeschakeld
3. Onder "Email Templates", kun je optioneel de email templates aanpassen
4. **Belangrijk**: Voor development, schakel "Enable email confirmations" uit in Authentication > Settings, of configureer een SMTP provider

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

### Voor Nieuwe Gebruikers

1. **Bezoek de Homepage**: Navigeer naar `http://localhost:5173/`
2. **Registreer**: Klik op "Gratis Beginnen" of "Registreer hier"
   - Vul je naam, email en wachtwoord in (minimaal 6 tekens)
   - Na registratie word je automatisch doorgestuurd naar het dashboard
3. **Dashboard**: Je ziet je persoonlijke dashboard met templates beheer
4. **Navigatie**: Gebruik de navigatiebalk om tussen pagina's te wisselen

### Templates Beheren

1. **Nieuwe Template**: Klik op "+ Nieuwe Template" op het dashboard
2. **Invullen**: Geef je template een naam en beschrijving
3. **Opslaan**: Klik op "Aanmaken" om de template op te slaan
4. **Bewerken**: Klik op "Bewerken" bij een template om deze aan te passen
5. **Verwijderen**: Klik op "Verwijderen" om een template te verwijderen (met bevestiging)

### Account Beheren

1. Ga naar "Mijn Account" in de navigatiebalk
2. Bekijk je huidige accountgegevens (naam en email)
3. Klik op "Bewerken" om je naam te wijzigen
4. Klik op "Opslaan" om de wijzigingen door te voeren

### Uitloggen

Klik op "Uitloggen" in de navigatiebalk om uit te loggen en terug te keren naar de login pagina.

## Testing

### Handmatige Test Flow

1. **Start de applicatie**: `npm run dev`
2. **Test Homepage**:
   - Bezoek `/` - moet openbaar toegankelijk zijn
   - Bekijk de features en informatie
3. **Test Registratie**:
   - Klik op "Gratis Beginnen" of ga naar `/register`
   - Vul een naam, email en wachtwoord in
   - Verifieer dat je wordt doorgestuurd naar `/dashboard`
4. **Test Dashboard**:
   - Verifieer dat je naam wordt getoond
   - Test het aanmaken van een nieuwe template
   - Test het bewerken van een template
   - Test het verwijderen van een template
5. **Test Route Protection**:
   - Log uit
   - Probeer `/dashboard` te bezoeken - moet redirecten naar `/login`
   - Log opnieuw in
6. **Test Account Pagina**:
   - Ga naar `/mijn-account`
   - Wijzig je naam
   - Verifieer dat de wijziging is opgeslagen
7. **Test Andere Pagina's**:
   - Bezoek `/mijn-website` - moet beschermd zijn
   - Bezoek `/publiceren` - moet beschermd zijn

## Project Structure

```
src/
├── components/         # Herbruikbare componenten
│   ├── Navbar.jsx                 # Navigatie component
│   ├── NavbarCustomizer.jsx       # Navbar aanpassing formulier
│   ├── ProtectedRoute.jsx         # Route bescherming component
│   ├── SectionCustomizer.jsx      # Sectie aanpassing formulier
│   └── TemplatesManager.jsx       # Templates CRUD component
├── contexts/          # React Context voor state management
│   └── SiteContext.jsx            # Site configuratie context
├── hooks/             # Custom React hooks
│   └── useAuth.js                 # Authenticatie hook
├── lib/               # Utility libraries
│   └── supabaseClient.js          # Supabase client en auth functies
├── pages/             # Pagina componenten
│   ├── BuilderPage.jsx            # Website builder (beschermd)
│   ├── DashboardPage.jsx          # Dashboard (beschermd)
│   ├── HomePage.jsx               # Homepage (openbaar)
│   ├── LoginPage.jsx              # Login pagina (openbaar)
│   ├── MijnAccountPage.jsx        # Account beheer (beschermd)
│   ├── MijnWebsitePage.jsx        # Websites overzicht (beschermd)
│   ├── MultiPageSite.jsx          # Multi-page preview (beschermd)
│   ├── PublicerenPage.jsx         # Website publiceren (beschermd)
│   ├── RegisterPage.jsx           # Registratie pagina (openbaar)
│   └── SinglePageSite.jsx         # Single-page preview (beschermd)
├── sections/          # Sectie componenten
│   ├── AboutSection.jsx
│   ├── ContactSection.jsx
│   ├── HeroSection.jsx
│   └── ServicesSection.jsx
├── App.jsx            # Hoofdapplicatie component
└── main.jsx           # Entry point
```

## Technologies

- **React 19** - UI framework
- **React Router DOM** - Routing en route bescherming
- **Vite** - Build tool en development server
- **Supabase** - Backend-as-a-Service voor authenticatie en database
- **Context API** - State management

## Security

### Row Level Security (RLS)

Deze applicatie maakt gebruik van Supabase Row Level Security om te zorgen dat:
- Gebruikers alleen hun eigen profile kunnen lezen en updaten
- Gebruikers alleen hun eigen templates kunnen bekijken, aanmaken, bewerken en verwijderen
- Geen gebruiker toegang heeft tot data van andere gebruikers

### Best Practices

- Alle environment variables gebruiken de `VITE_` prefix voor Vite compatibility
- Wachtwoorden moeten minimaal 6 tekens zijn
- Email verificatie kan worden ingeschakeld in Supabase settings voor extra beveiliging
- HTTPS moet worden gebruikt in productie

## Troubleshooting

### "Supabase configuratie ontbreekt"
- Controleer of je `.env` bestand bestaat
- Controleer of de environment variables correct zijn ingevuld
- Restart de development server na het wijzigen van `.env`

### "Fout bij aanmaken profile"
- Controleer of de `profiles` tabel bestaat in Supabase
- Controleer of RLS policies correct zijn ingesteld
- Bekijk de browser console voor meer details

### "Email confirmations required"
- Ga naar Supabase > Authentication > Settings
- Schakel "Enable email confirmations" uit voor development
- Of configureer een SMTP provider voor productie

## Screenshots

### Builder Interface
![Builder Interface](https://github.com/user-attachments/assets/b2af5c9f-900c-44fd-b030-4548a023f456)

### Single-Page Site Preview
![Single-Page Site](https://github.com/user-attachments/assets/01cf4953-f9a9-46f2-af74-aaee6ed39e4a)

