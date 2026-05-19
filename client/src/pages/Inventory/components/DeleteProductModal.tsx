import { useState, type FC } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import Modal from "../../../components/Modal";
import type { ProductColumns } from "../../../Interfaces/ProductInterface";
import ProductService from "../../../services/ProductService";

interface Props {
  product: ProductColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (message: string) => void;
}

const DeleteProductModal: FC<Props> = ({ product, isOpen, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const res = await ProductService.destroyProduct(product.product_id);
      onDeleted(res.data.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-2 text-xl font-bold">Delete Product</h2>
      <p className="mb-6 text-rx-muted">
        Remove <span className="font-semibold text-white">{product?.name}</span> ({product?.brand}, size {product?.size})?
      </p>
      <div className="flex justify-end gap-3">
        <CloseButton onClose={onClose} />
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-rx-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-rx-accent-hover disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteProductModal;
