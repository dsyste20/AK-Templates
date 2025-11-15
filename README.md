# AK-Templates - React Customizable Website Builder

Een React-platform waar gebruikers eenvoudig websites kunnen bouwen en aanpassen met vooraf gemaakte componenten. Nu met gebruikersauthenticatie en template management!

## Features

### Authenticatie & Gebruikersbeheer
- **Gebruikersregistratie**: Maak een account aan met e-mail en wachtwoord
- **Veilige Login**: Log in met je account credentials
- **Beschermde Routes**: Toegang tot de builder en dashboard is alleen mogelijk na inloggen
- **Template Management**: Sla je templates op en beheer ze per gebruiker

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

### 1. Installeer dependencies

```bash
npm install
```

### 2. Supabase Project Setup

Deze applicatie gebruikt Supabase voor authenticatie en database management. Volg deze stappen:

#### 2.1 Maak een Supabase project aan
1. Ga naar [https://app.supabase.com/](https://app.supabase.com/)
2. Maak een gratis account aan of log in
3. Klik op "New Project"
4. Vul de project details in en kies een wachtwoord voor je database
5. Wacht tot het project is aangemaakt

#### 2.2 Haal je API credentials op
1. Ga naar je project dashboard
2. Klik op "Settings" (tandwiel icoon) in de sidebar
3. Ga naar "API" onder Project Settings
4. Kopieer de volgende waarden:
   - **Project URL** (onder "Project URL")
   - **anon/public key** (onder "Project API keys" → "anon public")

#### 2.3 Maak de templates tabel aan
1. Ga naar "SQL Editor" in de sidebar
2. Klik op "New Query"
3. Voer de volgende SQL uit:

```sql
-- Maak de templates tabel aan
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maak een index voor snellere queries
CREATE INDEX templates_user_id_idx ON templates(user_id);
```

#### 2.4 Schakel Row Level Security (RLS) in
1. Blijf in de SQL Editor
2. Voer de volgende SQL uit om RLS policies in te stellen:

```sql
-- Schakel RLS in voor de templates tabel
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Gebruikers kunnen hun eigen templates bekijken
CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Gebruikers kunnen hun eigen templates aanmaken
CREATE POLICY "Users can create their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Gebruikers kunnen hun eigen templates bijwerken
CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Gebruikers kunnen hun eigen templates verwijderen
CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);
```

Deze policies zorgen ervoor dat:
- Gebruikers alleen hun eigen templates kunnen zien
- Gebruikers alleen templates kunnen aanmaken die aan hun account gekoppeld zijn
- Gebruikers alleen hun eigen templates kunnen bewerken en verwijderen

### 3. Environment variabelen configureren

1. Kopieer het `.env.example` bestand naar `.env`:

```bash
cp .env.example .env
```

2. Open het `.env` bestand en vul je Supabase credentials in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Let op:** Gebruik de exacte waarden die je hebt gekopieerd uit je Supabase project. De `.env` file wordt niet gecommit naar git (staat in `.gitignore`).

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

## Usage & Testing

### 1. Publieke Homepage
1. Open `http://localhost:5173/`
2. Je ziet de publieke homepage met informatie over AK-Templates
3. Deze pagina is toegankelijk zonder in te loggen

### 2. Registreren
1. Klik op "Registreren" in de navigatie of ga naar `/register`
2. Vul een e-mailadres en wachtwoord in (minimaal 6 tekens)
3. Klik op "Registreren"
4. Na succesvolle registratie word je automatisch doorgestuurd naar `/dashboard`

### 3. Inloggen
1. Ga naar `/login` of klik op "Inloggen"
2. Vul je e-mailadres en wachtwoord in
3. Klik op "Inloggen"
4. Na succesvolle login word je doorgestuurd naar `/dashboard`

### 4. Dashboard & Templates
1. Op het dashboard zie je een welkomstbericht met je e-mailadres
2. Scroll naar beneden naar "Mijn Templates"
3. Klik op "+ Nieuwe Template" om een template aan te maken
4. Vul een naam en optionele beschrijving in
5. Klik op "Aanmaken"
6. Je nieuwe template verschijnt in de lijst
7. Test de CRUD functionaliteit:
   - **Bewerken**: Klik op "Bewerken" bij een template
   - **Verwijderen**: Klik op "Verwijderen" bij een template

### 5. Builder
1. Klik op "Builder" in de dashboard header
2. Je wordt naar de website builder gestuurd
3. Hier kun je je website aanpassen zoals voorheen

### 6. Route Protection Testen
1. Log uit via de "Uitloggen" knop
2. Probeer direct naar `/dashboard` te gaan
3. Je wordt automatisch doorgestuurd naar `/login`
4. Dit geldt ook voor `/builder`, `/preview`, en `/preview-multi/*`

### 7. Uitloggen
1. Klik op "Uitloggen" in de dashboard header
2. Je wordt uitgelogd en teruggestuurd naar de homepage

## Project Structure

```
src/
├── components/              # Herbruikbare componenten
│   ├── Navbar.jsx          # Navigatie component
│   ├── NavbarCustomizer.jsx # Navbar aanpassing formulier
│   ├── SectionCustomizer.jsx # Sectie aanpassing formulier
│   ├── ProtectedRoute.jsx  # Route bescherming component
│   └── TemplatesManager.jsx # Template CRUD component
├── contexts/               # React Context voor state management
│   └── SiteContext.jsx    # Site configuratie context
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Authenticatie hook
├── lib/                   # Libraries en utilities
│   └── supabaseClient.js  # Supabase client en auth functies
├── pages/                 # Pagina componenten
│   ├── HomePage.jsx       # Publieke homepage
│   ├── LoginPage.jsx      # Login pagina
│   ├── RegisterPage.jsx   # Registratie pagina
│   ├── DashboardPage.jsx  # Dashboard voor ingelogde gebruikers
│   ├── BuilderPage.jsx    # Website builder
│   ├── SinglePageSite.jsx # Single-page preview
│   └── MultiPageSite.jsx  # Multi-page preview
├── sections/              # Sectie componenten
│   ├── HeroSection.jsx
│   ├── AboutSection.jsx
│   ├── ServicesSection.jsx
│   └── ContactSection.jsx
├── App.jsx                # Hoofdapplicatie component met routes
└── main.jsx               # Entry point
```

## Technologies

- **React 19** - UI framework
- **React Router DOM** - Routing en route bescherming
- **Vite** - Build tool en development server
- **Supabase** - Authenticatie en database management
- **Context API** - State management

## Security

### Row Level Security (RLS)
De applicatie gebruikt Supabase Row Level Security om ervoor te zorgen dat:
- Gebruikers alleen hun eigen data kunnen zien en bewerken
- Alle database operaties worden gefilterd op `user_id`
- Ongeautoriseerde toegang wordt automatisch geblokkeerd

### Best Practices
- Wachtwoorden worden veilig opgeslagen door Supabase (bcrypt hashing)
- Auth tokens worden veilig beheerd in de browser
- Environment variabelen worden niet gecommit naar git
- API keys zijn "anon/public" keys die veilig in de frontend gebruikt kunnen worden

## Troubleshooting

### "Supabase URL en/of Anon Key ontbreken"
- Controleer of je `.env` bestand correct is aangemaakt
- Verifieer dat de waarden correct zijn gekopieerd uit je Supabase project
- Herstart de development server na het aanpassen van `.env`

### Templates worden niet opgehaald
- Controleer of de `templates` tabel correct is aangemaakt in Supabase
- Verifieer dat RLS policies correct zijn ingesteld
- Check de browser console voor foutmeldingen

### Kan niet inloggen/registreren
- Controleer je internetverbinding
- Verifieer dat je Supabase project actief is
- Check of de API credentials correct zijn

## Screenshots

### Builder Interface
![Builder Interface](https://github.com/user-attachments/assets/b2af5c9f-900c-44fd-b030-4548a023f456)

### Single-Page Site Preview
![Single-Page Site](https://github.com/user-attachments/assets/01cf4953-f9a9-46f2-af74-aaee6ed39e4a)


