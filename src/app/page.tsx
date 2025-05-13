import BottomBanner from "@/components/main/homepage/BottomBanner";
import FeaturedProducts from "@/components/main/homepage/FeaturedProducts";
import FeaturedProductsBanner from "@/components/main/homepage/FeaturedProductsBanner";
import PopularProducts from "@/components/main/homepage/PopularProducts";

export default function Home() {
  return (
      <>
          <div className="bg-gray-50"> 
            <FeaturedProductsBanner />
            <PopularProducts />
            <FeaturedProducts />

            <BottomBanner />
          </div>
      </>
  );
}
