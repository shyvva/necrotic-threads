import path from 'path';

// Konfiguracja Next.js
export default {
  webpack(config) {
    // Użycie import.meta.url do uzyskania katalogu bieżącego
    const dirname = new URL('.', import.meta.url).pathname;
    
    // Skonfiguruj alias '@' do wskazywania na folder 'src'
    config.resolve.alias['@'] = path.resolve(dirname, 'src');
    
    // Zwróć zmodyfikowaną konfigurację
    return config;
  },
  // Możesz dodać inne ustawienia, które są specyficzne dla Twojego projektu
  eslint: {
    ignoreDuringBuilds: true, // Ignorowanie błędów ESLint podczas procesu builda
  },
}
