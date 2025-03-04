/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  transpilePackages: [],
  experimental: {
    forceSwcTransforms: false
  },
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
};

export default nextConfig;
