/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimisations pour Docker
  output: 'standalone', // Active le mode standalone pour optimiser le déploiement Docker
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend', // Ajout du nom de service Docker pour accéder aux images
        port: '8080',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
