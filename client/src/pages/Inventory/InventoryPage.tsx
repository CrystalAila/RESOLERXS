import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { ProductColumns } from "../../Interfaces/ProductInterface";
import AddProductModal from "./components/AddProductModal";
import DeleteProductModal from "./components/DeleteProductModal";
import EditProductModal from "./components/EditProductModal";
import ProductList from "./components/ProductList";

const InventoryPage = () => {
  const toast = useToastMessage("", false, false);
  const { refresh, handleRefresh } = useRefresh(false);
  const addModal = useModal(false);
  const editModal = useModal<ProductColumns>(false);
  const deleteModal = useModal<ProductColumns>(false);

  return (
    <>
      <ToastMessage
        message={toast.message}
        isFailed={toast.isFailed}
        isVisible={toast.isVisible}
        onClose={toast.closeToastMessage}
      />
      <AddProductModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onSaved={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <EditProductModal
        product={editModal.selected}
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSaved={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <DeleteProductModal
        product={deleteModal.selected}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onDeleted={(msg) => {
          toast.showToastMessage(msg);
          handleRefresh();
        }}
      />
      <ProductList
        refreshKey={refresh}
        onAdd={() => addModal.openModal()}
        onEdit={(p) => editModal.openModal(p)}
        onDelete={(p) => deleteModal.openModal(p)}
      />
    </>
  );
};

export default InventoryPage;
