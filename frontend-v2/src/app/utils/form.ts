import { ValidationRule } from "react-hook-form";

export const required: ValidationRule<boolean> = {
    value: true,
    message: "This field is required"
}

export const minLength = (value: number): ValidationRule<number> => ({
    value,
    message: `The value must be at least ${value} characters long.`
})