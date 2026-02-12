type StaticPageProps = {
  title: string;
  subtitle: string;
  updatedAt?: string;
  children: React.ReactNode;
};

export default function StaticPage({
  title,
  subtitle,
  updatedAt,
  children,
}: StaticPageProps) {
  return (
    <main className="bg-[#F8F8F8] min-h-screen">
      <section className="bg-white border-b border-[#EFEFEF]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-sm font-semibold text-[#B47720]">الأزاز</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-[#333333]">
            {title}
          </h1>
          <p className="mt-3 text-[#666666] leading-relaxed">{subtitle}</p>
          {updatedAt ? (
            <p className="mt-4 text-xs text-[#999999]">
              آخر تحديث: {updatedAt}
            </p>
          ) : null}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-10 grid gap-6">
        {children}
      </section>
    </main>
  );
}
