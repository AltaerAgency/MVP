/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["playwright", "@axe-core/playwright"],
};

module.exports = nextConfig;
