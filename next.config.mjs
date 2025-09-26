/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // کامنت: هر درخواستی که به /api/ در فرانت‌اند ارسال شود
        source: "/api/:path*",
        // کامنت: به صورت مخفیانه به سرور بک‌اند شما پراکسی (هدایت) می‌شود
        destination: "https://api.eitebar.ir/api/:path*",
      },
    ];
  },
};

export default nextConfig;
