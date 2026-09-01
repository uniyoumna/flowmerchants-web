"use client";

import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import {
  BaseMultiSelect,
  type BaseMultiSelectProps,
} from "@/components/base/BaseMultiSelect";

type FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<BaseMultiSelectProps, "name" | "value" | "onChange" | "onBlur"> & {
  name: TName;
  control?: Control<TFieldValues>;
};

const FormMultiSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  error: propError,
  ...props
}: FormMultiSelectProps<TFieldValues, TName>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <BaseMultiSelect
      {...props}
      id={props.id ?? name}
      name={field.name}
      value={field.value ?? []}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldError?.message ?? propError}
    />
  );
};

export default FormMultiSelect;
export { FormMultiSelect };
export type { FormMultiSelectProps };
