import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CommonForm from "@/components/common/form";
import {
  addCategory,
  editCategory,
  deleteCategory,
  fetchAllCategories,
} from "@/store/admin/categories-slice";
import AdminCategoryTile from "@/components/admin-view/category-tile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const initialCategoryData = {
  name: "",
};

function AdminCategories() {
  const [openCreateCategoryDialog, setOpenCreateCategoryDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialCategoryData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { categoryList } = useSelector((state) => state.adminCategories);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
  
    if (currentEditedId !== null) {
      // Editing category
      dispatch(editCategory({ id: currentEditedId, categoryData: formData }))
        .then((data) => {
          // If the action resolves as rejected, it will still have "rejected" status, so handle here
          if (data?.type === "/categories/editCategory/rejected") {
            const errorMessage = data?.payload || "Category already exists"; // Handle rejected cases
            // console.log("Error adding category:", errorMessage);
            toast({
              // title: "Error editing category",
              description: errorMessage,
              variant: "destructive",  
            });
             // Show error toast
          } else if (data?.payload?.success) {
            dispatch(fetchAllCategories());
            setFormData(initialCategoryData); // Reset form data after edit
            setOpenCreateCategoryDialog(false); // Close the dialog
            setCurrentEditedId(null); // Reset current edited ID
            toast({
              title: "Category edited successfully",
            });
          }
        })
        .catch((error) => {
          const errorMessage =
            error?.payload || error.message || "Unknown error occurred";
          console.error("Error editing category: ", errorMessage);
          toast({
            // title: "Error editing category",
            description: errorMessage,
            variant: "destructive",
          });
        });
    } else {
      // Adding category
      dispatch(addCategory(formData))
        .then((data) => {
          // If the action resolves as rejected, it will still have "rejected" status, so handle here
          if (data?.type === "/categories/addnewcategory/rejected") {
            const errorMessage = data?.payload || "Category already exists"; // Handle rejected cases
            // console.log("Error adding category:", errorMessage);
            toast({
              // title: "Error adding category",
              description: errorMessage,
              variant: "destructive",  
            });
             // Show error toast
          } else if (data?.payload?.success) {
            dispatch(fetchAllCategories());
            setFormData(initialCategoryData); // Reset form data after add
            setOpenCreateCategoryDialog(false); // Close the dialog
            toast({
              title: "Category added successfully",
            });
          }
        })
        .catch((error) => {
          // Catch unexpected errors
          const errorMessage =
            error?.payload || error.message || "Unknown error occurred";
          console.log("Error adding category:", errorMessage);
          toast({
            title: "Error adding category",
            description: errorMessage,
            variant: "destructive",
          });
        });
    }
  };
  

  function handleDelete(categoryId) {
    dispatch(deleteCategory(categoryId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCategories());
      }
    });
  }

  function isFormValid() {
    return formData.name !== "";
  }

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const openEditCategoryDialog = (category) => {
    setOpenCreateCategoryDialog(true);
    setCurrentEditedId(category?._id);
    setFormData({ ...category }); // Ensuring form data is populated correctly
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateCategoryDialog(true)}>
          Add New Category
        </Button>
      </div>

      {/* Table for Category List */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Sl No.</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryList &&
              categoryList.length > 0 &&
              categoryList.map((categoryItem, index) => (
                <AdminCategoryTile
                  key={categoryItem._id}
                  index={index + 1}
                  category={categoryItem}
                  setFormData={setFormData}
                  setOpenCreateCategoryDialog={setOpenCreateCategoryDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  handleDelete={handleDelete}
                  openEditCategoryDialog={openEditCategoryDialog}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Sheet for Add/Edit Category */}
      <Sheet
        open={openCreateCategoryDialog}
        onOpenChange={() => {
          setOpenCreateCategoryDialog(false);
          setCurrentEditedId(null);
          setFormData(initialCategoryData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto"
          aria-describedby="category-dialog-description"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Category" : "Add New Category"}
            </SheetTitle>
          </SheetHeader>
          <div id="category-dialog-description" className="sr-only">
            Use the form to add a new category or edit an existing one.
          </div>

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={[
                {
                  label: "Category Name",
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

export default AdminCategories;
