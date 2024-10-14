import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from "react";

interface IInputDefault {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  svgIcon?: ReactNode;
  error?: boolean;
  textError?: string | boolean;
}

const InputDefault = ({
  value,
  onChange,
  svgIcon,
  error,
  textError,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & IInputDefault) => {
  const { placeholder, className, type } = props;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <label
        className={`${
          error && "input-error"
        } input input-bordered flex items-center gap-2 w-full`}
      >
        {svgIcon && type === "text" && (
          <div className="w-5 h-5 opacity-70">{svgIcon}</div>
        )}
        <input
          {...props}
          type={type === "password" && showPassword ? "text" : type}
          className={`${className} max-w-full text-sm`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <Eye
                className="text-gray-style-medium"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <EyeOff
                className="text-gray-style-medium"
                onClick={togglePasswordVisibility}
              />
            )}
          </>
        )}
      </label>
      {error && (
        <span className="label-text-alt text-left text-error w-full !mt-1">
          {textError}
        </span>
      )}
    </>
  );
};

export default InputDefault;
