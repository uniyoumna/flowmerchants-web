"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import {
  BaseFileUpload,
  type BaseFileUploadProps,
} from "@/components/base/BaseFileUpload";

type FormFileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<BaseFileUploadProps, "name" | "value" | "onChange" | "onBlur"> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormFileUpload = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  error: propError,
  ...props
}: FormFileUploadProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <BaseFileUpload
      {...props}
      id={props.id ?? name}
      name={field.name}
      value={field.value ?? null}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldError?.message ?? propError}
    />
  );
};

export default FormFileUpload;
export { FormFileUpload };
export type { FormFileUploadProps };
