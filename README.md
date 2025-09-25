# Consiglio Cittadino - Demo

Una piattaforma web completa per **Consiglio Cittadino**, la democrazia digitale per l'Italia del futuro.

## 📋 Licenza GPL v3

Questo progetto è distribuito sotto **GNU General Public License v3.0**:

- ✅ Puoi usare, studiare e modificare il codice
- ✅ Puoi distribuire copie modificate
- ⚠️ **DEVI** mantenere la stessa licenza GPL v3
- ⚠️ **DEVI** fornire il codice sorgente delle modifiche
- ⚠️ Non puoi creare versioni proprietarie

**Perché GPL v3?** Vogliamo che tutte le implementazioni di democrazia digitale rimangano aperte e trasparenti per il bene comune.

Vedi [LICENSE](LICENSE) per il testo completo.

## 🌟 Panoramica

Consiglio Cittadino è una piattaforma dimostrativa che presenta il concept di democrazia digitale attraverso:

- **Demo Interattiva**: Simulazione completa delle funzionalità principali
- **Libro Digitale**: Manifesto completo con 17 capitoli
- **Sistema di Abbonamenti**: Raccolta fondi per lo sviluppo
- **Contatori Live**: Statistiche aggiornate in tempo reale
- **Design Responsive**: Ottimizzato per tutti i dispositivi

## 🚀 Tecnologie Utilizzate

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipizzazione statica
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animazioni fluide
- **Lucide React** - Icone moderne
- **React Hooks** - Gestione stato e effetti

## 📱 Funzionalità

### Homepage
- Hero section coinvolgente con video demo
- Statistiche live dei sostenitori
- Analisi dei problemi democratici italiani
- Presentazione delle soluzioni in 3 fasi

### Demo Interattiva
- Dashboard utente simulata con gamification
- Mappa Italia interattiva per regioni
- Feed news aggregato e categorizzato
- Sistema petizioni con filtri e progress bar
- Area coalizioni con elezioni simulate
- Bacheca manifesti politici
- Sistema achievements e classifica

### Libro Digitale
- Navigazione capitoli con progress tracking
- Ricerca nel testo e segnalibri
- Tempo di lettura stimato
- Contenuti formattati per leggibilità
- Sistema di condivisione

### Abbonamenti
- Piani flessibili (mensile/annuale)
- Simulazione pagamenti Stripe
- Trasparenza nell'uso dei fondi
- Garanzie e testimonianze
- FAQ complete

### Contatti
- Form contatti categorizzato
- Informazioni team iavatar.info
- Social media integration
- Newsletter signup
- Tempi di risposta chiari

## 🎯 Obiettivi del Progetto

1. **Validazione Concept**: Dimostrare il potenziale della democrazia digitale
2. **Raccolta Fondi**: Sostenere lo sviluppo della piattaforma completa
3. **Community Building**: Creare una base di utenti interessati
4. **Feedback Collection**: Raccogliere input per miglioramenti

## 📊 Caratteristiche Tecniche

### Performance
- **SSR/SSG** per SEO ottimizzato
- **Lazy loading** componenti e immagini
- **Core Web Vitals** ottimizzati
- **PWA ready** per installazione mobile

### UX/UI
- **Design System** coerente
- **Accessibilità** WCAG compliant
- **Mobile-first** responsive design
- **Loading states** e micro-interazioni

### Simulazioni Realistiche
- **Contatori live** con aggiornamenti automatici
- **Dati demografici** credibili per l'Italia
- **Nomi e località** italiani autentici
- **Timeline realistiche** per petizioni

## 🛠️ Installazione e Sviluppo

```bash
# Clone repository
git clone <repository-url>
cd consiglio-cittadino

# Installa dipendenze
npm install

# Avvia server sviluppo
npm run dev

# Build produzione
npm run build

# Avvia server produzione
npm start
```


## 🎨 Design System

### Colori Principali
- **Blu Primario**: #2563eb (Democrazia, fiducia)
- **Giallo Accent**: #fbbf24 (Call-to-action, energia)
- **Viola Secondario**: #7c3aed (Premium, innovazione)
- **Verde Success**: #059669 (Successo, crescita)

### Typography
- **Headings**: Font system stack ottimizzato
- **Body**: Inter/Geist per leggibilità
- **Monospace**: Per codice e dati tecnici

## 🔧 Configurazione

### Ambiente Sviluppo
- Node.js 18+
- NPM 9+
- TypeScript 5+


## 📈 Metriche Success

### KPIs Primari
- **Tempo permanenza**: >3 minuti sulla demo
- **Conversione abbonamenti**: >2% visitatori unici
- **Engagement demo**: >70% completamento tour
- **Social sharing**: >100 condivisioni/mese

### KPIs Secondari
- **Download materiali**: >500/mese
- **Form contatti**: >50 messaggi/mese
- **Newsletter signup**: >1000 iscritti
- **Return visitors**: >30% traffico totale

## 🌍 Deployment

### Vercel 
```bash
# Deploy automatico da Git
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributi

Il progetto è **open source** e accoglie contributi:

1. Fork del repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

### Aree di Contributo
- **Frontend Development**: React/Next.js components
- **UX/UI Design**: Miglioramenti interfaccia
- **Content Writing**: Testi informativi e manifesto
- **Testing**: Unit e integration tests
- **Performance**: Ottimizzazioni velocità caricamento


## 📞 Supporto

- **Email**: info@iavatar.info
- **Website**: www.ilconsigliocittadino.it
- **Community**: https://discord.gg/demDWVX2

## 🎯 Roadmap

### Fase 1 ✅ (Completata)
- [x] Sito demo completo
- [x] Sistema abbonamenti
- [x] Content management
- [x] Design system

### Fase 2 - MVP Funzionale
**Obiettivo: €100.000 di investimenti (circa 5.000 cittadini attivi)**
- [ ] Piattaforma MVP reale
- [ ] Sistema autenticazione sicuro
- [ ] Database petizioni funzionante
- [ ] API backend completa
- [ ] Sistema di voto e validazione
- [ ] integrazione autenticazione spid

### Fase 3 - Sistema Completo
**Obiettivo: Espansione nazionale**
- [ ] Integrazione blockchain per trasparenza
- [ ] Sistema reputazione avanzato
- [ ] Mobile app nativa
- [ ] Plugin browser
- [ ] Partnership istituzionali

---

**Sviluppato con ❤️ dal team www.iavatar.info**

*Tecnologia per il bene comune*
