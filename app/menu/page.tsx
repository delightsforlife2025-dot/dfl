import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuContent from "./MenuContent";
import { getMenuCategories, getMenuItems, getSiteSetting } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function MenuPage() {
  // Fetch categories, items, and contact info from Supabase
  const [categories, menuItems, contactInfo] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
    getSiteSetting('contact_info')
  ]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light-primary dark:text-text-dark-primary min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <MenuContent categories={categories} allItems={menuItems} contactInfo={contactInfo} />
        <Footer />
      </div>
    </div>
  );
}
