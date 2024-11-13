/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["wqtjhddcdqbdxyucvvqx.supabase.co"], // Add your Supabase storage hostname here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
