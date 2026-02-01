export default function ShopLoading() {
  return (
    <section className="bg-[#F8F8F8] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="h-6 w-40 animate-pulse rounded bg-[#E5E5E5]" />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-sm border border-[#EEEEEE] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
