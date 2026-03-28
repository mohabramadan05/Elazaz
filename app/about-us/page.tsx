import Link from "next/link";
import StaticPage from "@/components/shared/StaticPage";

export default function AboutUsPage() {
  return (
    <StaticPage
      title="من نحن"
      subtitle="الأزاز متجر مختص بالحقائب والأحذية والإكسسوارات الراقية، نقدّم تشكيلة منتقاة بعناية وتجربة تسوق موثوقة وسهلة."
    >
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#333333] mb-3">قصتنا</h2>
        <p className="text-[#666666] leading-relaxed">
          تم تأسيس شركة الأزاز عام ١٩٨٤ وكانت ولا زالت من الشركات الرائدة في
          المصنوعات الجلدية مثل ( الأحذية - الشنط ) وتم ابتكار منتج جديد لم يكن
          له وجود في السوق سوى في براند الأزاز وهو الشنط الخاصة بالسفاري
          المصنوعة من الجلد الطبيعي
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">رؤيتنا</h2>
          <p className="text-[#666666] leading-relaxed">
            تسعى شركة الأزاز للانتشار الدائم حيث كان بداية طريقنا في السوق في
            مول أركاديا منذ عام ٢٠٠٠ وحتى ٢٠١٩ وفي الوقت ذاته كان هناك فرع آخر
            في جنينة مول منذ عام ٢٠٠٣ حتى .٢٠٠٧ ٌ وذلك لتقديم منتج متميز ملائم
            للمواصفات التي يستحق أن يحصل عليها العميل لتساعده على الوصول لإشباع
            رغباته بكامل الرقي والأناقة
          </p>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">رسالتنا</h2>
          <p className="text-[#666666] leading-relaxed">
            ابتكار منتجات جديدة ذات الجودة العالية في مجال صناعة الجلود ٌ في مصر
            والدول العربية أجمع وذلك عن طريق توفير خدمة في خلال ٧٢ ً والخليج
            خاصة ً الشحن الى جميع الدول العربية عامة ساعة فقط
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">قيمنا</h2>
        <ul className="list-disc pr-5 text-[#666666] space-y-2">
          <li>
            لدينا رؤية واضحة نسعى دائما لتحقيق خططنا المستقبلية في ً بخطوات
            ثابتة لنكون دائما الصدارة
          </li>
          <li>
            هدفنا الأول والأخير هو ثقة عملائنا ونسعى دائما لاستحقاق تلك المكانة
          </li>
          <li>
            لا نشجع العمل التقليدي، و نسعى دائما للتميز وإعادة اكتشاف ما ينقص
            جمهورنا المستهلك في جميع جوانب حياته
          </li>
        </ul>
      </div>

      <div className="bg-[#FFF7ED] border border-[#F4D7AE] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#7A4F1A]">
            جاهز لاكتشاف التشكيلة؟
          </h2>
          <p className="text-[#8A6A3A] mt-2">
            استكشف أحدث المنتجات والعروض المميزة في متجرنا.
          </p>
        </div>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-[#B47720] text-white text-sm font-semibold hover:opacity-90"
        >
          تصفح المنتجات
        </Link>
      </div>
    </StaticPage>
  );
}
