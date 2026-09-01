"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import {
  BaseRadioGroup,
  type BaseRadioGroupProps,
} from "@/components/base/BaseRadioGroup";

type FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<BaseRadioGroupProps, "name" | "value" | "onChange"> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormRadioGroup = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  error: propError,
  ...props
}: FormRadioGroupProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <BaseRadioGroup
      {...props}
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      error={fieldError?.message ?? propError}
    />
  );
};

export default FormRadioGroup;
export { FormRadioGroup };
export type { FormRadioGroupProps };
