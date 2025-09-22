/** @type {import('next').NextConfig} */
const nextConfig = {
  // Specifica la root directory per evitare warning sui package-lock multipli
  outputFileTracingRoot: __dirname,

  // Configurazioni aggiuntive per ottimizzazione
  serverExternalPackages: ['nodemailer'],

  // Configurazioni per deployment
  trailingSlash: false,

  // Headers di sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig