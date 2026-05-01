import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuContent from "./MenuContent";
import { getMenuCategories, getMenuItems, getSiteSetting } from "@/lib/api-server";
import { asContactInfo } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function MenuPage() {
  // Fetch categories, items, and contact info from Supabase
  const [categories, menuItems, contactRaw] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
    getSiteSetting("contact_info"),
  ]);

  const contactInfo = asContactInfo(contactRaw);

  return (
    <div className="min-h-screen bg-[#f5bf00] font-display text-text-light">
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <MenuContent categories={categories} allItems={menuItems} contactInfo={contactInfo} />
        <Footer />
      </div>
    </div>
  );
}
