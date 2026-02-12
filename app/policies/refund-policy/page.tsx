import StaticPage from "@/components/shared/StaticPage";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <StaticPage
      title="سياسة الاسترجاع"
      subtitle="نهدف لتقديم تجربة تسوق مريحة؛ لذلك وضعنا سياسة استرجاع واضحة ومبسطة."
      updatedAt="11 فبراير 2026"
    >
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            شروط الاسترجاع
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>أن يكون المنتج بحالته الأصلية دون استخدام.</li>
            <li>وجود جميع الملصقات والبطاقات والتغليف الأصلي.</li>
            <li>تقديم طلب الاسترجاع خلال 7 أيام من تاريخ الاستلام.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            المنتجات غير القابلة للاسترجاع
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>المنتجات المستخدمة أو المتضررة بسبب سوء الاستخدام.</li>
            <li>الطلبات الخاصة أو المنتجات المخصصة.</li>
            <li>العروض أو التخفيضات النهائية (إن وُجدت).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            خطوات الاسترجاع
          </h2>
          <ol className="list-decimal pr-5 text-[#666666] space-y-2">
            <li>التواصل معنا عبر البريد أو واتساب وذكر رقم الطلب.</li>
            <li>استلام تعليمات الشحن وإرسال المنتج خلال الفترة المحددة.</li>
            <li>فحص المنتج خلال 2-4 أيام عمل بعد الاستلام.</li>
            <li>إشعارك بقبول الاسترجاع أو رفضه مع توضيح السبب.</li>
          </ol>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-[#F8F8F8] border border-[#EFEFEF] rounded-xl p-4">
            <h2 className="text-base font-semibold text-[#333333] mb-2">
              مدة استرداد المبلغ
            </h2>
            <p className="text-[#666666] leading-relaxed">
              يتم رد المبلغ إلى وسيلة الدفع الأصلية خلال 5 إلى 10 أيام عمل بعد
              اعتماد الاسترجاع.
            </p>
          </div>
          <div className="bg-[#F8F8F8] border border-[#EFEFEF] rounded-xl p-4">
            <h2 className="text-base font-semibold text-[#333333] mb-2">
              رسوم الشحن
            </h2>
            <p className="text-[#666666] leading-relaxed">
              رسوم الشحن لا تُسترد إلا في حال كان المنتج تالفًا أو تم إرسال
              المنتج الخطأ. في غير ذلك يتحمل العميل تكلفة الشحن.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الاستبدال
          </h2>
          <p className="text-[#666666] leading-relaxed">
            يمكن طلب الاستبدال حسب توفر المنتج في المخزون. إذا لم يتوفر، سيتم
            تنفيذ الاسترجاع وفق السياسة أعلاه.
          </p>
        </div>

        <div className="bg-[#FFF7ED] border border-[#F4D7AE] rounded-xl p-4">
          <h2 className="text-base font-semibold text-[#7A4F1A] mb-2">
            تواصل معنا للاسترجاع
          </h2>
          <Link href="mailto:elazazeg@gmail.com">
            {" "}
            <p className="text-[#8A6A3A]">
              البريد الإلكتروني: elazazeg@gmail.com
            </p>
          </Link>
          <Link href="https://wa.me/201027043700">
            <p className="text-[#8A6A3A]">واتساب: +201027043700</p>{" "}
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
