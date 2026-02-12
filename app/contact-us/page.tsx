import StaticPage from "@/components/shared/StaticPage";
import Link from "next/link"; 

export default function ContactUsPage() {
  return (
    <StaticPage
      title="اتصل بنا"
      subtitle="نحن هنا لمساعدتك في أي استفسار يتعلق بالطلبات أو المنتجات أو الدعم الفني."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            واتساب
          </h2>
          <p className="text-[#666666] mb-4">
            تواصل سريع ومباشر مع فريق خدمة العملاء.
          </p>
          < Link
            href="https://wa.me/201027043700"
            className="text-[#B47720] font-semibold"
          >
            +201027043700
          </Link>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الهاتف
          </h2>
          <p className="text-[#666666] mb-4">
            اتصل بنا للاستفسارات العاجلة أو متابعة الطلبات.
          </p>
          <Link href="tel:+201027043700" className="text-[#B47720] font-semibold">
            +201027043700
          </Link>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            البريد الإلكتروني
          </h2>
          <p className="text-[#666666] mb-4">
            سنرد على بريدك خلال يومي عمل كحد أقصى.
          </p>
          <a
            href="mailto:elazazeg@gmail.com"
            className="text-[#B47720] font-semibold"
          >
            elazazeg@gmail.com
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            ساعات العمل
          </h2>
          <ul className="text-[#666666] space-y-2">
            <li>الأحد إلى الخميس: 9:00 صباحًا - 6:00 مساءً</li>
            <li>الجمعة والسبت: عطلة</li>
          </ul>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            نطاق الخدمة
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نخدم عملاءنا داخل المملكة العربية السعودية، ونوفر خيارات شحن مرنة
            تناسب احتياجاتك. لمتابعة الشحنات أو الاسترجاع يرجى التواصل عبر
            القنوات أعلاه.
          </p>
        </div>
      </div>

      <div className="bg-[#F8F8F8] border border-[#EFEFEF] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#333333] mb-3">
          كيف نساعدك بشكل أسرع؟
        </h2>
        <p className="text-[#666666] leading-relaxed">
          عند مراسلتنا، يرجى تزويدنا برقم الطلب (إن وجد)، والبريد الإلكتروني
          المستخدم في الشراء، ووصف مختصر للمشكلة أو الاستفسار. هذا يساعدنا على
          حل طلبك بسرعة ودقة.
        </p>
      </div>
    </StaticPage>
  );
}
