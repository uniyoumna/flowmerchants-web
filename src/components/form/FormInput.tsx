"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { BaseInput, type BaseInputProps } from "@/components/base/BaseInput";

type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<BaseInputProps, "name" | "defaultValue"> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  error: propError,
  ...props
}: FormInputProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  return (
    <BaseInput
      {...props}
      id={props.id ?? name}
      name={field.name}
      ref={field.ref}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldError?.message ?? propError}
    />
  );
};

export default FormInput;
export { FormInput };
export type { FormInputProps };
