import Image from "next/image";

export default function Header() {
  return (
    <footer className="border-t border-black/17 px-4 sm:px-8 lg:px-16 py-6 mt-12">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
        {/* Logo and Address */}
        <div className="w-full lg:w-auto">
          <Image
            src="/assets/logo.png"
            alt="ELAZAZ Logo"
            width={100}
            height={50}
            className="mb-4"
          />
          <p className="text-[#9F9F9F] text-sm">
            400 يونيفرسيتي درايف سويت 200 كورال جابلز،
            <br />
            فلوريدا 33134 الولايات المتحدة الأمريكية
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full lg:w-auto">
          <div>
            <h3 className="text-[#9F9F9F] font-semibold mb-4">روابط</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  الصفحة الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  منتجات
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#9F9F9F] font-semibold mb-4">مساعدة</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  خيارات الدفع
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  المرتجعات
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-[#B47720] transition-colors">
                  سياسات الخصوصية
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <h3 className="text-[#9F9F9F] font-semibold mb-2">
            النشرة الإخبارية
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              className="text-black border-b-2 border-black hover:border-[#B47720] focus:border-[#B47720] focus:outline-none placeholder:text-gray-500 focus:placeholder:text-[#B47720] pr-2 pl-8 py-2 transition-all duration-300 w-full sm:w-auto"
              placeholder="أدخل عنوان بريدك الإلكتروني"
            />
            <button className="text-black border-b-2 border-black hover:border-2 hover:border-[#B47720] hover:text-[#B47720] pr-2 pl-8 py-2 transition-all duration-300 whitespace-nowrap">
              اشتراك
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto text-center text-gray-600 text-sm pt-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} ELAZAZ. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}