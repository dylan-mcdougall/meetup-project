import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required."
    }

    if (!username) {
      newErrors.username = "Username is required."
    }

    if (username.length < 4) {
      newErrors.username = "Username must be 4 characters or longer."
    }

    if (!password) {
      newErrors.password = "Password is required."
    }

    if (password.length < 6) {
      newErrors.password = "Password must be 6 characters or longer."
    }

    if (!firstName) {
      newErrors.firstName = "First Name is required."
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required."
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required."
    }

    return newErrors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="Signup-form">
      <h1>Sign Up</h1>
      <form className="Signup-form-css" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {(errors.email || errors.missing) && <p className="errors">{errors.email || errors.missing}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="errors">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="errors">{errors.confirmPassword}</p>}
        <button className="Signup-submit" type="submit"
        disabled={Object.keys(validate()).length > 0}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
