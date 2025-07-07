import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import "./LoginReg.css";
import { useMutation } from "@tanstack/react-query";
import { login } from "../util/https";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [errText, setErrText] = useState(undefined);

  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/user/chat");
    },
    onError: (error) => {
      setErrText(error.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    let hasError = false;

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
    }

    const formData = {
      email,
      password,
    };

    mutate(formData);
  }

  return (
    <div className="center-div">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1 align="center">Login</h1>
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
          <input type="submit" value="Sign in" style={{ padding: "5px" }} />
          <span>
            Don't have an account? <Link to="/register">Sign up</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
