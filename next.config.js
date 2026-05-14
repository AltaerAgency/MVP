/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["playwright", "@axe-core/playwright"],
  output: "standalone",
  env: {
    NODE_ENV: "production",
  },
};
module.exports = nextConfig;
