# Setup Sistema Abbonamenti Stripe

## 🎯 Panoramica Sistema

Il sistema implementato gestisce abbonamenti Stripe con codici univoci per utenti identificati da codice fiscale.

### Caratteristiche principali:
- **Codici univoci**: Formato CC-YYYY-XXXXXX (es: CC-2024-A1B2C3)
- **Stesso codice per stesso codice fiscale**: Se un utente acquista più abbonamenti, riceve sempre lo stesso codice
- **Sicurezza**: Validazione codice fiscale e prevenzione duplicati
- **Webhooks**: Conferma automatica pagamenti

---

## 📋 Setup Completo

### 1. Database MySQL

Esegui lo schema database:

```bash
mysql -u root -p < database/schema.sql
```

### 2. Variabili Ambiente

File `.env.local` configurato con le tue chiavi:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_51QXA8SE6y6v7JQaa...
STRIPE_SECRET_KEY=sk_live_51QXA8SE6y6v7JQaa...
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

STRIPE_MONTHLY_PRODUCT_ID=prod_T4td8nwZEpT9hE
STRIPE_YEARLY_PRODUCT_ID=prod_T4td3kVnmUCaGR

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=consiglio_abbonamenti
DB_PORT=3306

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QXA8SE6y6v7JQaa...
```

### 3. Webhook Stripe

**CRITICO**: Devi configurare il webhook su Stripe per confermare i pagamenti.

#### Setup Webhook:

1. **Vai su Stripe Dashboard** → Developers → Webhooks
2. **Clicca "Add endpoint"**
3. **URL endpoint**: `https://tuodominio.com/api/webhook/stripe`
4. **Eventi da ascoltare**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. **Copia il "Signing secret"** e aggiungilo in `.env.local` come `STRIPE_WEBHOOK_SECRET`

#### Per sviluppo locale con ngrok:

```bash
# Installa ngrok se non l'hai
npm install -g ngrok

# Avvia l'app in locale
npm run dev

# In un altro terminale, esponi il localhost
ngrok http 3000

# Usa l'URL https di ngrok per il webhook
# Es: https://abc123.ngrok.io/api/webhook/stripe
```

---

## 🔄 Flusso Completo

### 1. Utente visita `/abbonamenti`
- Vede i piani (€5/mese, €50/anno)
- Clicca su un piano → appare form dati

### 2. Compilazione dati
- Nome, cognome, data nascita, codice fiscale
- Validazione frontend e backend

### 3. Creazione abbonamento
- API `/api/create-subscription` controlla se utente esiste
- Se esiste: usa codice esistente
- Se nuovo: genera nuovo codice univoco
- Crea sessione Stripe checkout

### 4. Pagamento Stripe
- Utente paga con Stripe Checkout
- Stripe invia webhook al completamento

### 5. Conferma webhook
- API `/api/webhook/stripe` riceve conferma
- Attiva abbonamento in database
- Calcola date scadenza

### 6. Successo
- Redirect a `/success?code=CC-2024-ABC123&subscriptions=1`
- Utente vede il suo codice univoco
- Può copiare/scaricare il codice

---

## 📊 Database Schema

### Tabella `users`
```sql
- id (UUID primary)
- fiscal_code (16 chars, unique)
- first_name, last_name
- birth_date (DATE)
- unique_code (CC-YYYY-XXXXXX, unique)
- created_at, updated_at
```

### Tabella `subscriptions`
```sql
- id (UUID primary)
- user_id (FK to users)
- stripe_customer_id, stripe_subscription_id
- product_type (monthly/yearly)
- amount (decimal)
- status (pending/active/canceled/failed)
- subscription_start, subscription_end (dates)
- created_at, updated_at
```

### Tabella `generated_codes` (sicurezza)
```sql
- id (UUID primary)
- unique_code (tracking codici generati)
- created_at
```

---

## ⚙️ API Routes

### POST `/api/create-subscription`
Crea abbonamento Stripe

**Input**:
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "birthDate": "1980-01-01",
  "fiscalCode": "RSSMRA80A01H501X",
  "planType": "yearly"
}
```

**Output**:
```json
{
  "sessionId": "cs_test_...",
  "uniqueCode": "CC-2024-A1B2C3",
  "activeSubscriptions": 1,
  "isExistingUser": false
}
```

### POST `/api/webhook/stripe`
Gestisce webhook Stripe (eventi pagamenti)

---

## 🎯 Funzioni Chiave

### Generazione Codici Univoci
```typescript
// lib/code-generator.ts
generateUniqueCode() // → "CC-2024-A1B2C3"
ensureUniqueCode() // → controlla unicità + salva
getUserByFiscalCode() // → trova utente esistente
```

### Logica Utenti Esistenti
- **Stesso codice fiscale = stesso codice univoco**
- **Più abbonamenti = conteggio aumenta**
- **Badge "Founder Plus" per multi-abbonamenti**

---

## 🚀 Comandi Utili

```bash
# Avvia sviluppo
npm run dev

# Controlla database
mysql -u root -p consiglio_abbonamenti -e "SELECT * FROM users;"

# Test API (dopo setup DB)
curl -X POST http://localhost:3000/api/create-subscription \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","birthDate":"1990-01-01","fiscalCode":"TSTUSER90A01H501X","planType":"monthly"}'
```

---

## ⚠️ Note Importanti

1. **Webhook è OBBLIGATORIO**: Senza webhook, gli abbonamenti rimangono in "pending"
2. **HTTPS per produzione**: Stripe richiede HTTPS per webhook in produzione
3. **Chiavi Live vs Test**: Stai usando chiavi LIVE - fai attenzione ai pagamenti reali
4. **Backup database**: I codici univoci non possono essere ricreati se persi
5. **Codice fiscale unico**: Un CF può avere solo un codice, ma può avere più abbonamenti

---

## 🐛 Troubleshooting

### Problema: Pagamenti non si attivano
- **Causa**: Webhook non configurato o non funzionante
- **Soluzione**: Controlla endpoint webhook su Stripe Dashboard

### Problema: Codice non viene generato
- **Causa**: Errore database o problema nella generazione
- **Soluzione**: Controlla logs console e connessione DB

### Problema: Stripe API errori
- **Causa**: Chiavi sbagliate o prodotti inesistenti
- **Soluzione**: Verifica chiavi e product IDs su Stripe

---

**✅ Sistema pronto per il deployment!**

Per mettere in produzione:
1. Setup database MySQL su server
2. Deploy app su piattaforma hosting
3. Configura webhook Stripe con URL produzione
4. Aggiorna variabili ambiente