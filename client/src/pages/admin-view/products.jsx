import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { fetchAllCategories } from "@/store/admin/categories-slice";
import { fetchAllBrands } from "@/store/admin/brands-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  colors: "",
  sizes: "",
  discountPercentage: "",
  // salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const { categoryList } = useSelector((state) => state.adminCategories);
  const { brandList } = useSelector((state) => state.adminBrands);

  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          // console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "colors" && currentKey !== "sizes")
      .map((key) => {
        if (formData[key] === "") return false;
        if ((key === "price" || key === "totalStock") && isNaN(formData[key]))
          return false;
        return true;
      })
      .every((item) => item);
  }
  const getCategoryId = (name) => {
    const category = categoryList.find((cat) => cat.name === name);
    return category ? category._id : "";
  };

  const getBrandId = (name) => {
    const brand = brandList.find((b) => b.name === name);
    return brand ? brand._id : "";
  };

  const getCategoryName = (idOrName) => {
    const category =
      categoryList.find((cat) => cat._id === idOrName) ||
      categoryList.find((cat) => cat.name === idOrName);
    return category ? category.name : "";
  };

  const getBrandName = (idOrName) => {
    const brand =
      brandList.find((b) => b._id === idOrName) ||
      brandList.find((b) => b.name === idOrName);
    return brand ? brand.name : "";
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);
  // console.log(formData, "formData");
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={(data) =>
                  setFormData({
                    ...data,
                    category: getCategoryId(data.category) || data.category,
                    brand: getBrandId(data.brand) || data.brand,
                  })
                }
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={[
                ...addProductFormElements,
                {
                  label: "Category",
                  name: "category",
                  componentType: "select",
                  options: [
                    ...(formData.category
                      ? [
                          {
                            id: formData.category,
                            label: getCategoryName(formData.category),
                          },
                        ]
                      : []),
                    ...categoryList
                      .filter((category) => category._id !== formData.category)
                      .map((category) => ({
                        id: category._id,
                        label: category.name,
                      })),
                  ],
                },
                {
                  label: "Brand",
                  name: "brand",
                  componentType: "select",
                  options: [
                    ...(formData.brand
                      ? [
                          {
                            id: formData.brand,
                            label: getBrandName(formData.brand),
                          },
                        ]
                      : []),
                    ...brandList
                      .filter((brand) => brand._id !== formData.brand)
                      .map((brand) => ({
                        id: brand._id,
                        label: brand.name,
                      })),
                  ],
                },
              ]}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
