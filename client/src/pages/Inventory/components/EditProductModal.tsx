import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import UploadInput from "../../../components/Input/UploadInput";
import Modal from "../../../components/Modal";
import type { ProductColumns, ProductFieldErrors } from "../../../Interfaces/ProductInterface";
import ProductService from "../../../services/ProductService";

interface Props {
  product: ProductColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const EditProductModal: FC<Props> = ({ product, isOpen, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [productImage, setProductImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    size: "",
    sku: "",
    capital_price: "",
    selling_price: "",
    quantity: "",
    low_stock_threshold: "",
  });

  useEffect(() => {
    if (product && isOpen) {
      setForm({
        name: product.name,
        brand: product.brand,
        size: product.size,
        sku: product.sku ?? "",
        capital_price: String(product.capital_price),
        selling_price: String(product.selling_price),
        quantity: String(product.quantity),
        low_stock_threshold: String(product.low_stock_threshold),
      });
      setProductImage(null);
      setRemoveImage(false);
      setErrors({});
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("brand", form.brand.trim());
      fd.append("size", form.size.trim());
      fd.append("sku", form.sku.trim());
      fd.append("capital_price", form.capital_price);
      fd.append("selling_price", form.selling_price);
      fd.append("quantity", form.quantity);
      fd.append("low_stock_threshold", form.low_stock_threshold);
      if (removeImage) {
        fd.append("remove_image", "1");
      }
      if (productImage) {
        fd.append("product_image", productImage);
      }
      const res = await ProductService.updateProduct(product.product_id, fd);
      onSaved(res.data.message);
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { errors?: ProductFieldErrors } } };
      if (ax.response?.status === 422) setErrors(ax.response.data?.errors ?? {});
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-xl font-bold">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UploadInput
          label="Product Image"
          name="edit_product_image"
          value={productImage}
          onChange={setProductImage}
          onRemoveExistingImage={() => setRemoveImage(true)}
          existingHasImage={!!product?.has_image && !removeImage}
          existingImageProductId={product?.product_id}
          errors={errors.product_image}
        />
        <FloatingLabelInput label="Name" name="edit_name" value={form.name} onChange={set("name")} required errors={errors.name} />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Brand" name="edit_brand" value={form.brand} onChange={set("brand")} required errors={errors.brand} />
          <FloatingLabelInput label="Size" name="edit_size" value={form.size} onChange={set("size")} required errors={errors.size} />
        </div>
        <FloatingLabelInput label="SKU" name="edit_sku" value={form.sku} onChange={set("sku")} errors={errors.sku} />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Capital Price" name="edit_capital" type="number" step="0.01" value={form.capital_price} onChange={set("capital_price")} required errors={errors.capital_price} />
          <FloatingLabelInput label="Selling Price" name="edit_selling" type="number" step="0.01" value={form.selling_price} onChange={set("selling_price")} required errors={errors.selling_price} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Quantity" name="edit_qty" type="number" value={form.quantity} onChange={set("quantity")} required errors={errors.quantity} />
          <FloatingLabelInput label="Low Stock At" name="edit_threshold" type="number" value={form.low_stock_threshold} onChange={set("low_stock_threshold")} required errors={errors.low_stock_threshold} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <CloseButton onClose={onClose} />
          <SubmitButton label="Update Product" loading={loading} loadingLabel="Updating..." />
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
