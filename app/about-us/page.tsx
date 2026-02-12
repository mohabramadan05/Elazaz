import Link from "next/link";
import StaticPage from "@/components/shared/StaticPage";

export default function AboutUsPage() {
  return (
    <StaticPage
      title="من نحن"
      subtitle="الأزاز متجر سعودي مختص بالحقائب والأحذية والإكسسوارات الراقية، نقدّم تشكيلة منتقاة بعناية وتجربة تسوق موثوقة وسهلة."
    >
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#333333] mb-3">قصتنا</h2>
        <p className="text-[#666666] leading-relaxed">
          بدأنا في الأزاز بشغف للأناقة والتفاصيل، وهدفنا أن نجعل الحصول على القطع
          الفاخرة أكثر بساطة وثقة. نختار منتجاتنا وفق معايير دقيقة للجودة
          والمتانة والتصميم، مع اهتمام كبير بتجربة العميل من لحظة التصفح وحتى
          الاستلام.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">رؤيتنا</h2>
          <p className="text-[#666666] leading-relaxed">
            أن نكون الوجهة الأولى في السعودية للحقائب والأحذية الراقية عبر تجربة
            رقمية راقية وخدمة عملاء استثنائية.
          </p>
        </div>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#333333] mb-3">رسالتنا</h2>
          <p className="text-[#666666] leading-relaxed">
            تقديم منتجات أنيقة موثوقة بأسعار عادلة، مع توفير دعم سريع وسياسة
            استرجاع واضحة تمنح عملاءنا راحة بال كاملة.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">
          لماذا تختار الأزاز؟
        </h2>
        <ul className="list-disc pr-5 text-[#666666] space-y-2">
          <li>تشكيلة متجددة من الحقائب والأحذية والإكسسوارات.</li>
          <li>جودة تصنيع عالية واختيار دقيق للمواد والتصاميم.</li>
          <li>دفع آمن وخيارات شحن مرنة داخل المملكة.</li>
          <li>سياسة استرجاع واضحة ودعم سريع عند الحاجة.</li>
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
