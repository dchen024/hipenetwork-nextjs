/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config options ...

  webpack: (config, { dev, isServer }) => {
    // Disable cache in development
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
