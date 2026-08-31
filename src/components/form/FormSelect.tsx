"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { BaseSelect, type BaseSelectProps } from "@/components/base/BaseSelect";

type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  BaseSelectProps,
  "name" | "value" | "defaultValue" | "onValueChange"
> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  error: propError,
  ...props
}: FormSelectProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  return (
    <BaseSelect
      {...props}
      id={props.id ?? name}
      name={field.name}
      value={field.value ?? ""}
      onValueChange={(val) => field.onChange(val ?? "")}
      error={fieldError?.message ?? propError}
    />
  );
};

export default FormSelect;
export { FormSelect };
export type { FormSelectProps };
