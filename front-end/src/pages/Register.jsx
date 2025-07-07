import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import "./LoginReg.css";
import { useMutation } from "@tanstack/react-query";
import { register } from "../util/https";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [errText, setErrText] = useState(undefined);

  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const { mutate } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/user");
    },
    onError: (error) => {
      setErrText(error.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const username = event.target.username.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const photo_url = event.target.photo.value.trim();

    let hasError = false;

    if (!username) {
      setUsernameEmpty(true);
      hasError = true;
    } else {
      setUsernameEmpty(false);
    }

    if (!email) {
      setEmailEmpty(true);
      hasError = true;
    } else {
      setEmailEmpty(false);
    }

    if (!password) {
      setPasswordEmpty(true);
      hasError = true;
    } else {
      setPasswordEmpty(false);
    }

    if (hasError) {
      setErrText(undefined);
      return;
    };

    const formData = {
      username,
      email,
      password,
      photo_url,
    };

    mutate(formData);
  }
  return (
    <div className="center-div">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1 align="center">Register</h1>
          <InputLabel
            label="Username"
            placeholderText="Enter username"
            forr="username"
            type="text"
            err={usernameEmpty}
            errText="Please fill out this field"
          />
          <InputLabel
            label="Your photo"
            placeholderText="Enter photo url (optional)"
            forr="photo"
            type="text"
          />
          <InputLabel
            label="Email"
            placeholderText="Enter email"
            forr="email"
            type="email"
            err={emailEmpty}
            errText="Please fill out this field"
          />
          <div>
            <InputLabel
              label="Password"
              placeholderText="Enter password"
              forr="password"
              type="password"
              err={passwordEmpty}
              errText="Please fill out this field"
            />
            <p
              style={{
                color: "red",
                margin: "15px 0 0 0",
                display: errText ? "block" : "none",
              }}
            >
              {errText}
            </p>
          </div>
          <input type="submit" value="Sign up" style={{ padding: "5px" }} />
          <span>
            You have an account? <Link to="/">Sign in</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
