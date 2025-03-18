/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "guardianshot.blr1.cdn.digitaloceanspaces.com",
        },
      ],
    },
  };
  
  export default nextConfig; // Use "export default" instead of "module.exports"
  