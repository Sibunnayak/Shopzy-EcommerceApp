import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShopFooter from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <ShopFooter />
    </div>
  );
}

export default ShoppingLayout;
