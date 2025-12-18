import HomeBanner from "@/components/home/HomeBanner";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import Carousel from "@/components/home/Carousel";
import Masonry from "@/components/home/MasonrySection";



export default async function HomePage() {
  return (
    <>
      <HomeBanner />
      <CategorySection />
      <ProductSection />
      <Carousel />
      <Masonry/>
    </>
  );
}
