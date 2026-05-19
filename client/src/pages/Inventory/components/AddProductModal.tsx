import { useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import UploadInput from "../../../components/Input/UploadInput";
import Modal from "../../../components/Modal";
import type { ProductFieldErrors } from "../../../Interfaces/ProductInterface";
import ProductService from "../../../services/ProductService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const AddProductModal: FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [productImage, setProductImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    size: "",
    sku: "",
    capital_price: "",
    selling_price: "",
    quantity: "",
    low_stock_threshold: "5",
  });

  const reset = () => {
    setForm({
      name: "",
      brand: "",
      size: "",
      sku: "",
      capital_price: "",
      selling_price: "",
      quantity: "",
      low_stock_threshold: "5",
    });
    setProductImage(null);
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      if (productImage) {
        fd.append("product_image", productImage);
      }
      const res = await ProductService.storeProduct(fd);
      onSaved(res.data.message);
      reset();
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
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }}>
      <h2 className="mb-6 text-xl font-bold">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UploadInput
          label="Product Image"
          name="product_image"
          value={productImage}
          onChange={setProductImage}
          errors={errors.product_image}
        />
        <FloatingLabelInput label="Name" name="name" value={form.name} onChange={set("name")} required errors={errors.name} />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Brand" name="brand" value={form.brand} onChange={set("brand")} required errors={errors.brand} />
          <FloatingLabelInput label="Size" name="size" value={form.size} onChange={set("size")} required errors={errors.size} />
        </div>
        <FloatingLabelInput label="SKU" name="sku" value={form.sku} onChange={set("sku")} errors={errors.sku} />
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Capital Price" name="capital_price" type="number" step="0.01" value={form.capital_price} onChange={set("capital_price")} required errors={errors.capital_price} />
          <FloatingLabelInput label="Selling Price" name="selling_price" type="number" step="0.01" value={form.selling_price} onChange={set("selling_price")} required errors={errors.selling_price} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput label="Quantity" name="quantity" type="number" value={form.quantity} onChange={set("quantity")} required errors={errors.quantity} />
          <FloatingLabelInput label="Low Stock At" name="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={set("low_stock_threshold")} required errors={errors.low_stock_threshold} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <CloseButton onClose={() => { reset(); onClose(); }} />
          <SubmitButton label="Save Product" loading={loading} loadingLabel="Saving..." />
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
