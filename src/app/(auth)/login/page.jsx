// کامپوننت صفحه ورود که از فرم استفاده می‌کند
import LoginForm from "@/components/Template/LoginForm/LoginForm";
export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient2-start via-gradient2-mid to-gradient2-end p-6 md:p-12">
      <div className="max-w-[600px] w-full bg-colorThemeDark-secondary rounded-2xl shadow-lg overflow-hidden">
        <div className="md:col-span-8 flex flex-col justify-center p-10 md:px-16">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            ورود
          </h2>
          {/* اینجا از کامپوننت فرم استفاده می‌کنیم */}
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
