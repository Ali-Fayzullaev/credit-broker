"use client";

import * as React from "react";
import { PatternFormat } from "react-number-format";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  label?: string;
  value?: string; // всегда строка
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, value, onChange, name, ...props }, ref) => {
    return (
      <div className="grid gap-1.5">
        {label && <label className="text-sm font-medium">{label}</label>}
        <PatternFormat
          format="+7 7## ### ## ##"
          mask="_"
          value={value ?? ""}        // 👈 не допускаем undefined
          getInputRef={ref}          // 👈 правильная передача ref
          onValueChange={(vals) => {
            // если хочешь хранить только цифры — поставь vals.value
            const event = {
              target: { value: vals.formattedValue, name: name ?? "" },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange?.(event);
          }}
          className="border rounded-md px-3 py-2"
          {...props}
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
