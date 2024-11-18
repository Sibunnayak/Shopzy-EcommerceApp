import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

function AdminBrandTile({
  brand,
  setFormData,
  setOpenCreateBrandDialog,
  setCurrentEditedId,
  handleDelete,
  index,
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{index}</td>
      <td className="px-4 py-2">{brand?.name}</td>
      <td className="px-4 py-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setOpenCreateBrandDialog(true);
              setCurrentEditedId(brand?._id);
              setFormData(brand);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(brand?._id)}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default AdminBrandTile;
