import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useDropzone } from "react-dropzone";
import RemoveButton from "../Button/RemoveButton";
import ProductService from "../../services/ProductService";

interface UploadInputProps {
  label: string;
  name: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onRemoveExistingImage?: () => void;
  existingImageProductId?: number | null;
  existingHasImage?: boolean;
  errors?: string[];
}

const UploadInput: FC<UploadInputProps> = ({
  label,
  name,
  value,
  onChange,
  onRemoveExistingImage,
  existingImageProductId,
  existingHasImage,
  errors,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [existingPreview, setExistingPreview] = useState<string | null>(null);
  const [existingLoading, setExistingLoading] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const revokePreview = (url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        onChange?.(file);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  useEffect(() => {
    if (!existingHasImage || !existingImageProductId) {
      setExistingPreview((prev) => {
        revokePreview(prev);
        return null;
      });
      return;
    }

    let cancelled = false;
    setExistingLoading(true);

    ProductService.getProductImage(existingImageProductId)
      .then((res) => {
        if (cancelled) return;
        const url = URL.createObjectURL(res.data);
        setExistingPreview((prev) => {
          revokePreview(prev);
          return url;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setExistingPreview((prev) => {
            revokePreview(prev);
            return null;
          });
        }
      })
      .finally(() => {
        if (!cancelled) setExistingLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [existingHasImage, existingImageProductId]);

  useEffect(() => {
    revokePreview(objectUrlRef.current);
    objectUrlRef.current = null;

    if (value) {
      const url = URL.createObjectURL(value);
      objectUrlRef.current = url;
      setPreview(url);
      return () => {
        revokePreview(url);
        objectUrlRef.current = null;
      };
    }

    setPreview(null);
  }, [value]);

  useEffect(() => {
    return () => {
      revokePreview(objectUrlRef.current);
      setExistingPreview((prev) => {
        revokePreview(prev);
        return null;
      });
    };
  }, []);

  const displayPreview = preview ?? existingPreview;
  const showRemove = Boolean(preview || existingHasImage);

  const handleRemove = () => {
    onChange?.(null);
    if (existingHasImage) {
      onRemoveExistingImage?.();
    }
    revokePreview(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreview(null);
    setExistingPreview((prev) => {
      revokePreview(prev);
      return null;
    });
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rx-muted">
        {label}
      </label>
      <div
        className={`cursor-pointer rounded-lg border border-dashed transition ${
          errors ? "border-rx-accent" : "border-rx-border hover:border-rx-accent"
        }`}
      >
        <div
          {...getRootProps()}
          className={`rounded-lg p-6 ${
            isDragActive ? "bg-rx-accent/10" : "bg-rx-bg"
          }`}
        >
          <input {...getInputProps()} name={name} id={name} />
          <div className="flex flex-col items-center gap-2 text-center">
            {displayPreview ? (
              <img
                src={displayPreview}
                alt="Product preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            ) : existingLoading ? (
              <p className="text-sm text-rx-muted">Loading image...</p>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">
                  {isDragActive ? "Drop image here" : "Drag & drop product image"}
                </p>
                <p className="text-xs text-rx-muted">PNG, JPG, JPEG, or WEBP</p>
              </>
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-rx-accent">
              Browse file
            </span>
          </div>
        </div>
      </div>
      {errors && errors.length > 0 && (
        <p className="mt-1 text-xs text-rx-accent">{errors[0]}</p>
      )}
      {showRemove && (
        <div className="mt-2">
          <RemoveButton
            label="Remove Image"
            className="w-full"
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
};

export default UploadInput;
