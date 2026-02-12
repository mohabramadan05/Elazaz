import StaticPage from "@/components/shared/StaticPage";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <StaticPage
      title="الشروط والأحكام"
      subtitle="يرجى قراءة هذه الشروط بعناية قبل استخدام موقع الأزاز أو إجراء أي طلب."
      updatedAt="11 فبراير 2026"
    >
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            القبول والاستخدام
          </h2>
          <p className="text-[#666666] leading-relaxed">
            باستخدامك للموقع أو إجراء عملية شراء، فإنك توافق على هذه الشروط
            والأحكام. إذا كنت لا توافق عليها، يرجى عدم استخدام الموقع.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الحسابات والمعلومات
          </h2>
          <p className="text-[#666666] leading-relaxed">
            أنت مسؤول عن دقة معلومات حسابك وتحديثها. يتحمل المستخدم مسؤولية
            الحفاظ على سرية بيانات الدخول وإبلاغنا فورًا بأي استخدام غير مصرح
            به.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الأسعار والدفع
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>
              تُعرض الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة حيث
              ينطبق.
            </li>
            <li>قد تتغير الأسعار أو العروض دون إشعار مسبق.</li>
            <li>تتم معالجة المدفوعات عبر مزودي دفع معتمدين.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الشحن والتسليم
          </h2>
          <p className="text-[#666666] leading-relaxed">
            أوقات التسليم تقديرية وقد تختلف حسب المنطقة أو مزود الشحن. سنبذل
            قصارى جهدنا لتسليم الطلبات في الوقت المعلن عنه.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الإلغاء والتعديلات
          </h2>
          <p className="text-[#666666] leading-relaxed">
            يمكن إلغاء الطلب أو تعديله قبل شحنه. بعد الشحن، يخضع الطلب لسياسة
            الاسترجاع المعتمدة لدينا.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الاسترجاع والاستبدال
          </h2>
          <p className="text-[#666666] leading-relaxed">
            تخضع عمليات الاسترجاع والاستبدال لسياسة الاسترجاع الموضحة في صفحة
            سياسة الاسترجاع. نوصي بمراجعتها قبل الشراء.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الملكية الفكرية
          </h2>
          <p className="text-[#666666] leading-relaxed">
            جميع المحتويات والعلامات والتصاميم على الموقع مملوكة لالأزاز أو
            مرخصة لها. لا يجوز استخدامها دون إذن مسبق.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            حدود المسؤولية
          </h2>
          <p className="text-[#666666] leading-relaxed">
            لا تتحمل الأزاز المسؤولية عن أي خسائر غير مباشرة أو تبعية ناتجة عن
            استخدام الموقع أو المنتجات، وذلك ضمن الحدود التي يسمح بها النظام.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            التعديلات على الشروط
          </h2>
          <p className="text-[#666666] leading-relaxed">
            قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك في استخدام الموقع
            بعد التحديث يعني موافقتك على الشروط المعدلة.
          </p>
        </div>

        <div className="bg-[#F8F8F8] border border-[#EFEFEF] rounded-xl p-4">
          <h2 className="text-base font-semibold text-[#333333] mb-2">
            تواصل معنا
          </h2>
          <Link href="mailto:elazazeg@gmail.com">
            <p className="text-[#666666]">
              لأي استفسار حول الشروط والأحكام يرجى التواصل عبر البريد
              الإلكتروني: elazazeg@gmail.com
            </p>
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
