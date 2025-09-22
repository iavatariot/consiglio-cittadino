import Link from 'next/link';
import { Mail, Twitter } from 'lucide-react';

// Discord icon component (since it's not in lucide-react)
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="ml-2 text-xl font-bold">Consiglio Cittadino</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              La piattaforma di democrazia digitale che trasforma le idee dei cittadini
              in cambiamento reale attraverso petizioni, coalizioni e partecipazione attiva.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="mailto:info@ilconsigliocittadino.it"
                className="text-gray-400 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/WmuXxZks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Discord"
              >
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Il_C_Cittadino"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigazione
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/demo" className="text-gray-300 hover:text-white text-sm">
                  Demo Interattiva
                </Link>
              </li>
              <li>
                <Link href="/info" className="text-gray-300 hover:text-white text-sm">
                  Il Progetto
                </Link>
              </li>
              <li>
                <Link href="/libro" className="text-gray-300 hover:text-white text-sm">
                  Libro
                </Link>
              </li>
              <li>
                <Link href="/news-sondaggi" className="text-gray-300 hover:text-white text-sm">
                  News & Sondaggi
                </Link>
              </li>
              <li>
                <Link href="/abbonamenti" className="text-gray-300 hover:text-white text-sm">
                  Sostieni il Progetto
                </Link>
              </li>
            </ul>
          </div>

          {/* iavatar.info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Sviluppato da
            </h3>
            <div className="text-gray-300 text-sm">
              <p className="font-medium">iavatar.info</p>
              <p className="mt-2">Tecnologia per il bene comune</p>
              <Link
                href="/contatti"
                className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 iavatar.info. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Termini di Servizio
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;