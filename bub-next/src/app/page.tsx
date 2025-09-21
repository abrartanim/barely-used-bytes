import LandingAuth from "@/components/auth/LandingAuth";
import Image from "next/image";
import ProductPage from "@/components/pages/ProductPage";
export default function Home() {
  return (
    <div>
      {/* <LandingAuth /> */}
      {/* <SideBar /> */}
      <ProductPage></ProductPage>
    </div>
  );
}
