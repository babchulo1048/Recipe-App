import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instruction: "",
    imageUrl: "",
    ingredients: [],
    cookingTime: 0,
  });
  const [files, setFiles] = useState("");
  const [cookies, setCookies] = useCookies(["admin_id"]);
  const navigate = useNavigate();
  // const [ingredient,setIngredient]=useState

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = formData.ingredients;
    ingredients[idx] = value;
    setFormData({ ...formData, ingredients });
  };

  const AddIngredients = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.set("name", formData.name);
    data.set("description", formData.description);
    data.set("instruction", formData.instruction);
    // data.set("imageUrl", formData.imageUrl);
    data.set("ingredients", formData.ingredients);
    data.set("cookingTime", formData.cookingTime);
    // data.set("file", files);

    console.log("files", files);

    if (files) {
      data.set("file", files); // Append the file to the FormData object if it exists
    } else {
      data.set("imageUrl", formData.imageUrl); // Set the image URL if no file is selected
    }

    try {
      // testab.zaahirahtravels.com
      const response = await axios.post(
        "https://testab.zaahirahtravels.com/admin/createRecipe",
        data
      );

      if (response.status === 200) {
        const recipeId = response.data.data._id;
        console.log("res-data", response.data.data);

        const adminId = cookies.admin_token;
        console.log("cookies.admin_token");
        alert("New recipe created");
        // setFormData({...formData,""})
        await axios.put(
          `https://testab.zaahirahtravels.com/admin/recipes/${recipeId}/admin`,
          {
            adminId,
          }
        );
        navigate("/");
      }

      console.log("res-data", response.data.data);
    } catch (ex) {
      alert(ex.message);
      console.log(ex);
    }
  };

  return (
    <div className="container-margin">
      <form onSubmit={handleSubmit} className="recipe-form">
        <h2 className="form-title">Create Recipe</h2>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {/* {errors.name && (
      <FormText className="text-danger">{errors.name}</FormText>
        )} */}
        <textarea
          type="text"
          placeholder="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {formData.ingredients.map((ingredient, idx) => {
          return (
            <input
              key={idx}
              type="text"
              placeholder="ingredients"
              name="ingredients"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, idx)}
            />
          );
        })}
        <button className="secondary" onClick={AddIngredients} type="button">
          Add Ingredients
        </button>
        <textarea
          type="text"
          placeholder="instructions"
          name="instruction"
          value={formData.instruction}
          onChange={handleChange}
        />
        <div className="image-input">
          <input
            type="text"
            placeholder="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            style={{ flex: "0 0 82%" }}
          />
          <input
            type="file"
            name="file"
            placeholder="upload"
            style={{ flex: "1" }}
            onChange={handleFileChange}
          />
        </div>
        <input
          type="number"
          placeholder="cookingTime"
          name="cookingTime"
          value={formData.cookingTime}
          onChange={handleChange}
        />
        {/* {errors.password && (
      <FormText className="text-danger">{errors.password}</FormText>
        )} */}
        <button type="submit" className="primary">
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
