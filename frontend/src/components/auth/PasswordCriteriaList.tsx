import useCheckPassword from "../../hooks/useCheckPassword";
import { twMerge } from "tailwind-merge";

export default function PasswordCriteriaList({
  password,
}: {
  password: string;
}) {
  const { passwordCriteria } = useCheckPassword(password);
  return (
    <ul className="mt-1 mb-2">
      {passwordCriteria.map((rule) => (
        <li
          key={rule.label}
          className={twMerge(
            "text-xs list-disc ml-6 mb-1",
            rule.valid ? "text-green" : "text-red"
          )}
        >
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
