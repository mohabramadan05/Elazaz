import HomeBanner from "@/components/home/HomeBanner";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import ProductSection2 from "@/components/home/ProductSection2";
import Carousel2 from "@/components/home/Carousel2";
import Features from "@/components/home/features";
import Rev from "@/components/home/reviews";

export default async function HomePage() {
  return (
    <>
      <HomeBanner />
      <CategorySection />
      <Features />
      <ProductSection />
      <Carousel2 />
      <ProductSection2 />
      <Rev />
    </>
  );
}
