import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

function AdminCategoryTile({
  category,
  setFormData,
  setOpenCreateCategoryDialog,
  setCurrentEditedId,
  handleDelete,
  index,
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{index}</td>
      <td className="px-4 py-2">{category?.name}</td>
      <td className="px-4 py-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setOpenCreateCategoryDialog(true);
              setCurrentEditedId(category?._id);
              setFormData(category);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(category?._id)}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default AdminCategoryTile;
