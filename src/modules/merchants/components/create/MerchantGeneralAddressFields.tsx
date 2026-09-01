"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/form";
import {
  AREA_OPTIONS_BY_CITY,
  CITY_OPTIONS_BY_GOVERNORATE,
  GOVERNORATE_OPTIONS,
} from "../../constants";
import type { MerchantGeneralInfoValues } from "../../schemas/merchantGeneralInfoSchema";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** US-006, FE-017 — linked Governorate → City → Area master data. */
const MerchantGeneralAddressFields = () => {
  const { control, setValue } = useFormContext<MerchantGeneralInfoValues>();

  const governorate = useWatch({ control, name: "governorate" });
  const city = useWatch({ control, name: "city" });
  const area = useWatch({ control, name: "area" });

  const cityOptions = CITY_OPTIONS_BY_GOVERNORATE[governorate] ?? [];
  const areaOptions = AREA_OPTIONS_BY_CITY[city] ?? [];

  /**
   * FE-017 — clear a child only when it no longer belongs to its new parent.
   * Testing compatibility rather than reacting to "the parent changed" means a
   * step re-opened for editing keeps its saved city and area untouched.
   */
  useEffect(() => {
    if (city && !cityOptions.some((option) => option.value === city)) {
      setValue("city", "");
      setValue("area", "");
      return;
    }

    if (area && !areaOptions.some((option) => option.value === area)) {
      setValue("area", "");
    }
  }, [city, area, cityOptions, areaOptions, setValue]);

  return (
    <MerchantStepFieldset title="Address">
      <div className="grid gap-5 md:grid-cols-3">
        <FormSelect
          name="governorate"
          label="Governorate"
          required
          placeholder="Select governorate..."
          options={GOVERNORATE_OPTIONS}
        />

        <FormSelect
          name="city"
          label="City"
          required
          placeholder="Select city..."
          options={cityOptions}
          disabled={!governorate}
          helperText={!governorate ? "Select a governorate first" : undefined}
        />

        <FormSelect
          name="area"
          label="Area"
          placeholder="Select Area..."
          options={areaOptions}
          disabled={!city}
          helperText={!city ? "Select a city first" : undefined}
        />
      </div>

      <FormInput
        name="fullAddress"
        label="Full Address"
        placeholder="write Street, ....."
      />
    </MerchantStepFieldset>
  );
};

export default MerchantGeneralAddressFields;
export { MerchantGeneralAddressFields };
