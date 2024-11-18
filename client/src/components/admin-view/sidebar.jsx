import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Grid,
  Tag,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "Categories",
    label: "Categories",
    path: "/admin/categories",
    icon: <Grid />,
  },
  {
    id: "Brands",
    label: "Brands",
    path: "/admin/brands",
    icon: <Tag />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null); // Track the active item
  useEffect(() => {
    // Retrieve the active item from localStorage when the component mounts
    const storedActiveItem = localStorage.getItem("activeMenuItem");
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
    }
  }, []);

  const handleItemClick = (menuItem) => {
    setActiveItem(menuItem.id); // Set the active item
    localStorage.setItem("activeMenuItem", menuItem.id); // Save the active item in localStorage
    navigate(menuItem.path);
    setOpen ? setOpen(false) : null;
  };
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => handleItemClick(menuItem)}
          className={`flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 
            ${activeItem === menuItem.id ? 'bg-muted text-foreground' : 'text-muted-foreground'} 
            hover:bg-muted hover:text-foreground`}
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
