import React from 'react'

export default function useCheckPassword(password: string) {
    const password_length = password.length > 8;
    const password_number = /[0-9]/.test(password);
    const password_uppercase = /[A-Z]/.test(password);
    const password_lowercase = /[a-z]/.test(password);
    const password_special = /[^A-Za-z0-9]/.test(password);

    const passwordCriteria = [
        {
            label: "Must be at least 8 characters.",
            valid: password_length,
        },
        {
            label: "Must have at least 1 number.",
            valid: password_number,
        },
        {
            label: "Must have at least 1 uppercase letter.",
            valid: password_uppercase,
        },
        {
            label: "Must have at least 1 lowercase letter.",
            valid: password_lowercase,
        },
        {
            label: "Must have at least 1 special character.",
            valid: password_special,
        },
    ] as { label: string; valid: boolean }[];

    const valid_password =
        password_uppercase &&
        password_lowercase &&
        password_special &&
        password_length &&
        password_number;

    return { valid_password, passwordCriteria }
}
