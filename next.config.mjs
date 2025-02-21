import path from 'path';

export default {
  webpack(config) {
    // Użycie import.meta.url do uzyskania katalogu bieżącego
    const dirname = new URL('.', import.meta.url).pathname;
    config.resolve.alias['@'] = path.resolve(dirname, 'src');
    return config;
  },
}
