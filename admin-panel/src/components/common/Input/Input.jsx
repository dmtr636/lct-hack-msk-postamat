import React from "react";
import styles from "./Input.module.scss"
import { dontShowPass, showPass } from "../../../assets/img";
import classNames from "classnames";
export const Input = ({ type, placeholder, value, onChange,isError }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: 'relative', with:"100%"}}>
    <input className={classNames(styles.input,{[styles.isError]:isError})}
      type={showPassword ? 'text' : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {type === 'password' && (
      <div
      onClick={handleTogglePassword}
      style={{
        position: 'absolute',
        top: '62%',
        right: '26px',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {showPassword ? (
        <img src={showPass} alt="пароль скрыт" /> 
      ) : (
        <img src={dontShowPass} alt="пароль показан" />
      )}
    </div>
    )}
  </div>
);
};