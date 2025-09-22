// Utility per generare e validare codici fiscali italiani

interface CodiceFiscaleData {
  nome: string;
  cognome: string;
  dataNascita: string; // YYYY-MM-DD
  sesso: 'M' | 'F';
  luogoNascita: string;
}

// Tabelle di conversione per il codice fiscale
const MESI_CF: { [key: string]: string } = {
  '01': 'A', '02': 'B', '03': 'C', '04': 'D',
  '05': 'E', '06': 'H', '07': 'L', '08': 'M',
  '09': 'P', '10': 'R', '11': 'S', '12': 'T'
};

const CHAR_PARI: { [key: string]: number } = {
  'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
  'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
  'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
};

const CHAR_DISPARI: { [key: string]: number } = {
  'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
  'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12,
  'T': 14, 'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23,
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21
};

const CONTROLLO_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Database semplificato dei comuni italiani (i più comuni)
const COMUNI_ITALIANI: { [key: string]: string } = {
  // Capoluoghi di regione e città principali
  'ROMA': 'H501',
  'MILANO': 'F205',
  'NAPOLI': 'F839',
  'TORINO': 'L219',
  'PALERMO': 'G273',
  'GENOVA': 'D969',
  'BOLOGNA': 'A944',
  'FIRENZE': 'D612',
  'BARI': 'A662',
  'CATANIA': 'C351',
  'VENEZIA': 'L736',
  'VERONA': 'L781',
  'MESSINA': 'F158',
  'PADOVA': 'G224',
  'TRIESTE': 'L424',
  'BRESCIA': 'B157',
  'PARMA': 'G337',
  'TARANTO': 'L049',
  'PRATO': 'G999',
  'MODENA': 'F257',
  'REGGIO CALABRIA': 'H224',
  'REGGIO EMILIA': 'H223',
  'PERUGIA': 'G478',
  'RAVENNA': 'H199',
  'LIVORNO': 'E625',
  'CAGLIARI': 'B354',
  'FOGGIA': 'D643',
  'RIMINI': 'H294',
  'SALERNO': 'H703',
  'FERRARA': 'D548',
  'SASSARI': 'I452',
  'LATINA': 'E472',
  'GIUGLIANO IN CAMPANIA': 'E058',
  'MONZA': 'F704',
  'SYRACUSA': 'I754',
  'PESCARA': 'G482',
  'BERGAMO': 'A794',
  'FORLÌ': 'D704',
  'TRENTO': 'L378',
  'VICENZA': 'L840',
  'TERNI': 'L117',
  'BOLZANO': 'A952',
  'NOVARA': 'F952',
  'PIACENZA': 'G535',
  'ANCONA': 'A271',
  'ANDRIA': 'A285',
  'AREZZO': 'A390',
  'UDINE': 'L483',
  'CESENA': 'C573',
  'LECCE': 'E506',
  'PESARO': 'G479',
  'BARLETTA': 'A669',
  'ALESSANDRIA': 'A182',
  'LA SPEZIA': 'E463',
  'PISA': 'G702',
  'GUIDONIA MONTECELIO': 'M213',
  'CATANZARO': 'C352',
  'TREVISO': 'L407',
  'CINISELLO BALSAMO': 'C707',
  'BRINDISI': 'B180',
  'SESTO SAN GIOVANNI': 'I608',
  'CASORIA': 'C002',
  'POMIGLIANO D\'ARCO': 'G812',
  'ASTI': 'A479',
  'RAGUSA': 'H163',
  'CREMONA': 'D150',
  'COSENZA': 'D086',
  'COMO': 'C933',
  'VIGEVANO': 'L872',
  'BUSTO ARSIZIO': 'B300',
  'SAN SEVERO': 'I158',
  'VARESE': 'L682',
  'CARPI': 'B819',
  'LAMEZIA TERME': 'M208',
  'MASSA': 'F023',
  'FIUMICINO': 'M297',
  'CASERTA': 'B963',
  'APRILIA': 'A337',
  'LUCCA': 'E715',
  'BITONTO': 'A893',
  'VELLETRI': 'L719',
  'TRANI': 'L328',
  'CROTONE': 'D122'
};

// Funzione per normalizzare il nome di un comune
function normalizzaComune(comune: string): string {
  return comune.toUpperCase()
    .replace(/[àáâãäå]/g, 'A')
    .replace(/[èéêë]/g, 'E')
    .replace(/[ìíîï]/g, 'I')
    .replace(/[òóôõö]/g, 'O')
    .replace(/[ùúûü]/g, 'U')
    .replace(/'/g, '')
    .trim();
}

// Estrae le consonanti e vocali da una stringa
function estraiConsVoc(str: string): { consonanti: string; vocali: string } {
  const normalizzata = str.toUpperCase().replace(/[^A-Z]/g, '');
  const consonanti = normalizzata.replace(/[AEIOU]/g, '');
  const vocali = normalizzata.replace(/[^AEIOU]/g, '');
  return { consonanti, vocali };
}

// Genera il codice per cognome o nome
function generaCodiceNomeCognome(str: string, isNome: boolean = false): string {
  const { consonanti, vocali } = estraiConsVoc(str);

  if (isNome && consonanti.length >= 4) {
    // Per il nome: se ci sono 4+ consonanti, prendi 1a, 3a, 4a
    return consonanti[0] + consonanti[2] + consonanti[3];
  }

  let codice = '';

  // Prima le consonanti
  for (let i = 0; i < consonanti.length && codice.length < 3; i++) {
    codice += consonanti[i];
  }

  // Poi le vocali se necessario
  for (let i = 0; i < vocali.length && codice.length < 3; i++) {
    codice += vocali[i];
  }

  // Completa con X se necessario
  while (codice.length < 3) {
    codice += 'X';
  }

  return codice.substring(0, 3);
}

// Genera il codice della data di nascita
function generaCodiceData(dataNascita: string, sesso: 'M' | 'F'): string {
  const data = new Date(dataNascita);
  const anno = data.getFullYear().toString().substring(2);
  const mese = MESI_CF[(data.getMonth() + 1).toString().padStart(2, '0')];
  let giorno = data.getDate();

  // Per le donne si aggiunge 40 al giorno
  if (sesso === 'F') {
    giorno += 40;
  }

  return anno + mese + giorno.toString().padStart(2, '0');
}

// Calcola il carattere di controllo
function calcolaCarattereControllo(codice: string): string {
  let somma = 0;

  for (let i = 0; i < 15; i++) {
    const char = codice[i];
    if (i % 2 === 0) {
      // Posizione dispari (1-based)
      somma += CHAR_DISPARI[char] || 0;
    } else {
      // Posizione pari (1-based)
      somma += CHAR_PARI[char] || 0;
    }
  }

  return CONTROLLO_CHARS[somma % 26];
}

// Funzione principale per generare il codice fiscale
export function generaCodiceFiscale(data: CodiceFiscaleData): string {
  const cognomeCode = generaCodiceNomeCognome(data.cognome);
  const nomeCode = generaCodiceNomeCognome(data.nome, true);
  const dataCode = generaCodiceData(data.dataNascita, data.sesso);

  // Cerca il codice del comune
  const comuneNormalizzato = normalizzaComune(data.luogoNascita);
  const comuneCode = COMUNI_ITALIANI[comuneNormalizzato] || 'Z999'; // Default se non trovato

  const codiceParziale = cognomeCode + nomeCode + dataCode + comuneCode;
  const carattereControllo = calcolaCarattereControllo(codiceParziale);

  return codiceParziale + carattereControllo;
}

// Valida un codice fiscale
export function validaCodiceFiscale(codiceFiscale: string): boolean {
  if (!codiceFiscale || codiceFiscale.length !== 16) {
    return false;
  }

  const codiceUpper = codiceFiscale.toUpperCase();

  // Verifica formato base
  if (!/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(codiceUpper)) {
    return false;
  }

  // Verifica carattere di controllo
  const carattereCalcolato = calcolaCarattereControllo(codiceUpper.substring(0, 15));
  return carattereCalcolato === codiceUpper[15];
}

// Confronta il codice fiscale inserito con quello generato
export function verificaCodiceFiscale(codiceFiscaleInserito: string, data: CodiceFiscaleData): {
  valido: boolean;
  generato: string;
  corrispondenza: boolean;
  errori: string[];
} {
  const codiceGenerato = generaCodiceFiscale(data);
  const codiceInserito = codiceFiscaleInserito.toUpperCase();
  const errori: string[] = [];

  const validoFormato = validaCodiceFiscale(codiceInserito);
  if (!validoFormato) {
    errori.push('Il formato del codice fiscale non è valido');
  }

  const corrispondenza = codiceInserito === codiceGenerato;
  if (!corrispondenza && validoFormato) {
    errori.push('Il codice fiscale non corrisponde ai dati inseriti');

    // Analisi dettagliata delle differenze
    if (codiceInserito.substring(0, 3) !== codiceGenerato.substring(0, 3)) {
      errori.push('Il cognome non corrisponde');
    }
    if (codiceInserito.substring(3, 6) !== codiceGenerato.substring(3, 6)) {
      errori.push('Il nome non corrisponde');
    }
    if (codiceInserito.substring(6, 11) !== codiceGenerato.substring(6, 11)) {
      errori.push('La data di nascita o il sesso non corrispondono');
    }
    if (codiceInserito.substring(11, 15) !== codiceGenerato.substring(11, 15)) {
      errori.push('Il luogo di nascita non corrisponde o non è nel database');
    }
  }

  return {
    valido: validoFormato,
    generato: codiceGenerato,
    corrispondenza,
    errori
  };
}

// Lista dei comuni supportati
export function getComuniSupportati(): string[] {
  return Object.keys(COMUNI_ITALIANI).sort();
}