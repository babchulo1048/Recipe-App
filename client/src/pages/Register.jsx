import React, { useState } from "react";
import axios from "axios";
import joi from "joi";
import { FormText } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const schema = joi.object({
  name: joi.string().min(5).max(30).required(true).label("Name"),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one capital letter, one small letter, and one number.",
    }),
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
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
      await schema.validateAsync(formData, { abortEarly: false });
      // testab.zaahirahtravels.com

      const response = await axios.post(
        "https://testab.zaahirahtravels.com/admin/register",
        formData
      );

      console.log(response.data.data);
      if (response.data.message === "User Already Exist") {
        alert("User already exists. Please choose a different name.");
      } else {
        alert("New Admin Created");
        navigate("/");
      }
    } catch (ex) {
      console.log(ex);
      if (ex?.details) {
        // Extract the validation errors from the Joi validation error
        const validationErrors = {};
        ex.details.forEach((error) => {
          validationErrors[error.context.key] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2 className="form-title">Register</h2>
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
        Register
      </button>
    </form>
  );
};

export default Register;
