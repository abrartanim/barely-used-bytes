import LandingAuth from "@/components/auth/LandingAuth";
import Image from "next/image";
import ProductPage from "@/components/pages/ProductPage";
import CreateListingPage from "./createListing/page";
import UserProfilePage from "./profile/page";
export default function Home() {
  return (
    <div>
      {/* <LandingAuth /> */}
      {/* <SideBar /> */}
      {/* <ProductPage></ProductPage> */}
      {/* <CreateListingPage></CreateListingPage> */}
      <UserProfilePage />
    </div>
  );
}
