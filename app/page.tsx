import HomeBanner from "@/components/home/HomeBanner";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import Carousel from "@/components/home/Carousel";



export default async function HomePage() {
  return (
    <>
      <HomeBanner />
      <CategorySection />
      <ProductSection />
      <Carousel />
    </>
  );
}
