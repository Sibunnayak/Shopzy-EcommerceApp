import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "@/store/admin/categories-slice";
import { fetchAllBrands } from "@/store/admin/brands-slice";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  const dispatch = useDispatch();

  const { categoryList, isLoading: categoryLoading } = useSelector(
    (state) => state.adminCategories
  );
  const { brandList, isLoading: brandLoading } = useSelector(
    (state) => state.adminBrands
  );

  useEffect(() => {
    dispatch(fetchAllCategories()); // Fetch categories when the component mounts
    dispatch(fetchAllBrands()); // Fetch brands when the component mounts
  }, [dispatch]);

  // Loading state or empty message if no data available
  if (categoryLoading || brandLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className="text-base font-bold">Category</h3>
          <div className="grid gap-2 mt-2">
            {categoryList?.map((category) => (
              <Label
                className="flex font-medium items-center gap-2 "
                key={category._id} // Use _id for unique key
              >
                <Checkbox
                  checked={filters?.category?.includes(category._id)} // Check if the category is selected
                  onCheckedChange={() => handleFilter("category", category._id)}
                />
                {category.name} {/* Use category name */}
              </Label>
            ))}
          </div>
        </div>
        <Separator />

        {/* Brand Filter */}
        <div>
          <h3 className="text-base font-bold">Brand</h3>
          <div className="grid gap-2 mt-2">
            {brandList?.map((brand) => (
              <Label
                className="flex font-medium items-center gap-2 "
                key={brand._id} // Use _id for unique key
              >
                <Checkbox
                  checked={filters?.brand?.includes(brand._id)} // Check if the brand is selected
                  onCheckedChange={() => handleFilter("brand", brand._id)}
                />
                {brand.name} {/* Use brand name */}
              </Label>
            ))}
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}

export default ProductFilter;
