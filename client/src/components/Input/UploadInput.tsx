import { useCallback, useEffect, useState, type FC } from "react";
import { useDropzone } from "react-dropzone";
import RemoveButton from "../Button/RemoveButton";

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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
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
    if (value) {
      setPreview(URL.createObjectURL(value));
      return () => URL.revokeObjectURL(preview ?? "");
    }
    setPreview(null);
  }, [value]);

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
            {preview ? (
              <img
                src={preview}
                alt="Product preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            ) : existingHasImage && existingImageProductId ? (
              <p className="text-sm text-rx-muted">
                Current image on file — drop a new image to replace
              </p>
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
      {(preview || existingHasImage) && (
        <div className="mt-2">
          <RemoveButton
            label="Remove Image"
            className="w-full"
            onRemove={() => {
              onChange?.(null);
              onRemoveExistingImage?.();
              setPreview(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadInput;
