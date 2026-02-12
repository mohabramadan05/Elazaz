import StaticPage from "@/components/shared/StaticPage";
import Link from "next/link";

export default function TechnicalSupportPage() {
  return (
    <StaticPage
      title="الدعم الفني"
      subtitle="نقدّم دعمًا سريعًا وواضحًا لجميع استفساراتك التقنية والمرتبطة بالطلبات."
      updatedAt="11 فبراير 2026"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            قنوات الدعم
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>
              <Link href="mailto:elazazeg@gmail.com">
                البريد الإلكتروني: elazazeg@gmail.com
              </Link>
            </li>
            <li>
              <Link href="https://wa.me/201027043700">
                واتساب: +201027043700
              </Link>
            </li>
            <li>
              <Link href="tel:+201027043700">الهاتف: +201027043700</Link>
            </li>
          </ul>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            ساعات العمل
          </h2>
          <ul className="text-[#666666] space-y-2">
            <li>الأحد إلى الخميس: 9:00 صباحًا - 6:00 مساءً</li>
            <li>الجمعة والسبت: عطلة</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#333333] mb-3">
          ما الذي يغطيه الدعم؟
        </h2>
        <ul className="list-disc pr-5 text-[#666666] space-y-2">
          <li>مشكلات تسجيل الدخول وإدارة الحساب.</li>
          <li>المدفوعات وأخطاء إتمام الطلب.</li>
          <li>تتبع الشحنات وتحديثات التوصيل.</li>
          <li>طلبات الاسترجاع أو الاستبدال.</li>
          <li>المشكلات التقنية أثناء التصفح أو الدفع.</li>
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            وقت الاستجابة المتوقع
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نهدف للرد خلال 24 إلى 48 ساعة عمل كحد أقصى. الطلبات العاجلة المتعلقة
            بالشحن أو الدفع يتم التعامل معها بأولوية أعلى.
          </p>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">
            معلومات تساعدنا على مساعدتك
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>رقم الطلب (إن وجد).</li>
            <li>البريد الإلكتروني المستخدم في الشراء.</li>
            <li>وصف واضح للمشكلة مع لقطات شاشة عند الحاجة.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#FFF7ED] border border-[#F4D7AE] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#7A4F1A] mb-2">
          نصيحة سريعة
        </h2>
        <p className="text-[#8A6A3A] leading-relaxed">
          إذا واجهت مشكلة في الدفع، جرّب تحديث الصفحة أو استخدام متصفح مختلف، ثم
          تواصل معنا إذا استمرت المشكلة.
        </p>
      </div>
    </StaticPage>
  );
}
