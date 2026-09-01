"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { BaseToggle, type BaseToggleProps } from "@/components/base/BaseToggle";

type FormToggleProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<BaseToggleProps, "checked" | "onChange"> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormToggle = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: FormToggleProps<TFieldValues, TName>) => {
  const { field } = useController({ name, control });

  return (
    <BaseToggle
      {...props}
      checked={field.value === true}
      onChange={field.onChange}
    />
  );
};

export default FormToggle;
export { FormToggle };
export type { FormToggleProps };
