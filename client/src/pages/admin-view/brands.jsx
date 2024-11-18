import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CommonForm from "@/components/common/form";
import {
  addBrand,
  editBrand,
  deleteBrand,
  fetchAllBrands,
} from "@/store/admin/brands-slice";
import AdminBrandTile from "@/components/admin-view/brand-tile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const initialBrandData = {
  name: "",
};

function AdminBrands() {
  const [openCreateBrandDialog, setOpenCreateBrandDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialBrandData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { brandList } = useSelector((state) => state.adminBrands);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
  
    if (currentEditedId !== null) {
      // Editing brand
      dispatch(editBrand({ id: currentEditedId, brandData: formData }))
        .then((data) => {
          // If the action resolves as rejected, it will still have "rejected" status, so handle here
          if (data?.type === "/brands/editBrand/rejected") {
            const errorMessage = data?.payload || "Brand already exists"; // Handle rejected cases
            // console.log("Error adding brand:", errorMessage);
            toast({
              // title: "Error editing brand",
              description: errorMessage,
              variant: "destructive",  
            });
             // Show error toast
          } else if (data?.payload?.success) {
            dispatch(fetchAllBrands());
            setFormData(initialBrandData); // Reset form data after edit
            setOpenCreateBrandDialog(false); // Close the dialog
            setCurrentEditedId(null); // Reset current edited ID
            toast({
              title: "Brand edited successfully",
            });
          }
        })
        .catch((error) => {
          const errorMessage =
            error?.payload || error.message || "Unknown error occurred";
          console.error("Error editing brand: ", errorMessage);
          toast({
            // title: "Error editing brand",
            description: errorMessage,
            variant: "destructive",
          });
        });
    } else {
      // Adding brand
      dispatch(addBrand(formData))
        .then((data) => {
          // If the action resolves as rejected, it will still have "rejected" status, so handle here
          if (data?.type === "/brands/addnewbrand/rejected") {
            const errorMessage = data?.payload || "Brand already exists"; // Handle rejected cases
            // console.log("Error adding brand:", errorMessage);
            toast({
              // title: "Error adding brand",
              description: errorMessage,
              variant: "destructive",  
            });
             // Show error toast
          } else if (data?.payload?.success) {
            dispatch(fetchAllBrands());
            setFormData(initialBrandData); // Reset form data after add
            setOpenCreateBrandDialog(false); // Close the dialog
            toast({
              title: "Brand added successfully",
            });
          }
        })
        .catch((error) => {
          // Catch unexpected errors
          const errorMessage =
            error?.payload || error.message || "Unknown error occurred";
          console.log("Error adding brand:", errorMessage);
          toast({
            title: "Error adding brand",
            description: errorMessage,
            variant: "destructive",
          });
        });
    }
  };
  

  function handleDelete(brandId) {
    dispatch(deleteBrand(brandId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllBrands());
      }
    });
  }

  function isFormValid() {
    return formData.name !== "";
  }

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const openEditBrandDialog = (brand) => {
    setOpenCreateBrandDialog(true);
    setCurrentEditedId(brand?._id);
    setFormData({ ...brand }); // Ensuring form data is populated correctly
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateBrandDialog(true)}>
          Add New Brand
        </Button>
      </div>

      {/* Table for Brand List */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Sl No.</th>
              <th className="px-4 py-2 text-left">Brand Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brandList &&
              brandList.length > 0 &&
              brandList.map((brandItem, index) => (
                <AdminBrandTile
                  key={brandItem._id}
                  index={index + 1}
                  brand={brandItem}
                  setFormData={setFormData}
                  setOpenCreateBrandDialog={setOpenCreateBrandDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  handleDelete={handleDelete}
                  openEditBrandDialog={openEditBrandDialog}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Sheet for Add/Edit Brand */}
      <Sheet
        open={openCreateBrandDialog}
        onOpenChange={() => {
          setOpenCreateBrandDialog(false);
          setCurrentEditedId(null);
          setFormData(initialBrandData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto"
          aria-describedby="brand-dialog-description"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Brand" : "Add New Brand"}
            </SheetTitle>
          </SheetHeader>
          <div id="brand-dialog-description" className="sr-only">
            Use the form to add a new brand or edit an existing one.
          </div>

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={[
                {
                  label: "Brand Name",
                  name: "name",
                  type: "text",
                  required: true,
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

export default AdminBrands;
