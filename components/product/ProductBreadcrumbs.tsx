import Link from "next/link";

type Props = {
  name?: string | null;
};

export default function ProductBreadcrumbs({ name }: Props) {
  return (
    <nav className="text-xs text-[#888888] flex flex-wrap items-center gap-2">
      <Link href="/" className="hover:text-[#B47720]">
        الرئيسية
      </Link>
      <span>/</span>
      <Link href="/shop" className="hover:text-[#B47720]">
        كل المنتجات
      </Link>
      <span>/</span>
      <span className="text-[#B47720]">{name ?? ""}</span>
    </nav>
  );
}
