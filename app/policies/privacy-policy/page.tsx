import StaticPage from "@/components/shared/StaticPage";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <StaticPage
      title="سياسة الخصوصية"
      subtitle="نلتزم في الأزاز بحماية بياناتك الشخصية واستخدامها بشفافية ووفق أفضل الممارسات."
      updatedAt="11 فبراير 2026"
    >
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            المعلومات التي نجمعها
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>بيانات التعريف مثل الاسم والبريد الإلكتروني ورقم الهاتف.</li>
            <li>بيانات الشحن والفوترة وسجل الطلبات.</li>
            <li>معلومات فنية مثل نوع الجهاز، المتصفح، وعناوين IP.</li>
            <li>تفضيلات التسوق وسلوك التصفح داخل الموقع.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            كيف نستخدم المعلومات
          </h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>معالجة الطلبات وتوصيل المنتجات وإدارة الحسابات.</li>
            <li>تحسين تجربة المستخدم وتخصيص المحتوى والعروض.</li>
            <li>التواصل بشأن الطلبات أو الاستفسارات أو التنبيهات المهمة.</li>
            <li>إرسال رسائل تسويقية عند الموافقة ويمكن إيقافها لاحقًا.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            مشاركة المعلومات
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نشارك الحد الأدنى من البيانات مع مزودي خدمات موثوقين مثل شركات
            الشحن، بوابات الدفع، أو خدمات التحليلات، وذلك فقط لتقديم الخدمة. قد
            نشارك البيانات إذا طُلب ذلك بموجب القوانين والأنظمة.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            ملفات تعريف الارتباط (Cookies)
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نستخدم ملفات تعريف الارتباط لحفظ تفضيلاتك، وتسهيل عملية الشراء،
            وتحسين أداء الموقع. يمكنك تعديل إعدادات المتصفح لتعطيلها، لكن قد
            يؤثر ذلك على بعض وظائف الموقع.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            حماية البيانات
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نعتمد تدابير تقنية وتنظيمية لحماية بياناتك من الوصول غير المصرّح به
            أو التعديل أو الفقدان. ومع ذلك، لا يمكن ضمان الأمان الكامل لأي
            انتقال عبر الإنترنت.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">حقوقك</h2>
          <ul className="list-disc pr-5 text-[#666666] space-y-2">
            <li>طلب الاطلاع على بياناتك أو تحديثها أو تصحيحها.</li>
            <li>طلب حذف بياناتك وفقًا للأنظمة المعمول بها.</li>
            <li>إلغاء الاشتراك من الرسائل التسويقية في أي وقت.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#333333] mb-2">
            الاحتفاظ بالبيانات
          </h2>
          <p className="text-[#666666] leading-relaxed">
            نحتفظ ببياناتك للمدة اللازمة لتقديم خدماتنا والامتثال للمتطلبات
            القانونية أو المحاسبية.
          </p>
        </div>

        <div className="bg-[#F8F8F8] border border-[#EFEFEF] rounded-xl p-4">
          <h2 className="text-base font-semibold text-[#333333] mb-2">
            تواصل معنا
          </h2>
          <Link href="mailto:elazazeg@gmail.com">
            <p className="text-[#666666]">
              لأي استفسار حول الخصوصية يرجى التواصل عبر البريد الإلكتروني:
              elazazeg@gmail.com
            </p>
          </Link>
        </div>
      </div>
    </StaticPage>
  );
}
