import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FormText } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [_, setCookies] = useCookies(["access_token"]);
  const [cookies, setAdminCookies] = useCookies(["admin_token"]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // testab.zaahirahtravels.com
      const response = await axios.post(
        "https://testab.zaahirahtravels.com/admin/login",
        formData
      );

      console.log(response.data);
      setCookies("access_token", response.data.token);
      setAdminCookies("admin_token", response.data.adminId);
      navigate("/");
    } catch (ex) {
      // console.log(ex);
      if (ex.response.status === 401) {
        setErrors({ ...errors, password: "Password Invalid" });
      } else if (ex.response.status === 404) {
        setErrors({ ...errors, name: "Admin Not Found" });
      } else {
        console.log(ex);
      }
    }
  };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2 className="form-title">Login</h2>
      <input
        type="text"
        placeholder="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      {errors.name && (
        <FormText className="text-danger">{errors.name}</FormText>
      )}
      <input
        type="password"
        placeholder="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && (
        <FormText className="text-danger">{errors.password}</FormText>
      )}
      <button type="submit" className="primary">
        Login
      </button>
    </form>
  );
};

export default Login;
