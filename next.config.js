/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["playwright", "@axe-core/playwright"],
  output: "standalone",
};
module.exports = nextConfig;
