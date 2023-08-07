import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const validate = () => {
    const newErrors = {};

    if (!credential) {
      newErrors.credential = "Username or email is required."
    }

    if (credential.length < 4) {
      newErrors.credential = "Username or email must be 4 characters or longer."
    }

    if (!password) {
      newErrors.password = "Password is required."
    }

    if (password.length < 6) {
      newErrors.password = "Password must be 6 characters or longer."
    }

    return newErrors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (!Object.keys(validationErrors).length) {
      setErrors({});
      return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
    } else {
      setErrors(validationErrors);
    }
  };

  const demoUser = () => {
    setCredential('dem@user.io');
    setPassword('password');
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  return (
    <div className="Login-form">
      <h1>Log In</h1>
      <form className="Login-form-css" onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <button className="Login-submit" type="submit"
        disabled={Object.keys(validate()).length > 0}
        >Log In</button>
        <button className="Demo-user" onClick={demoUser}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
