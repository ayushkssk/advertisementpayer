/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'placehold.co'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
