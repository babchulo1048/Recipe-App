import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Modal, Form } from "react-bootstrap";

const Home = () => {
  const [receipes, setReceipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, setAdminCookies] = useCookies(["admin_token"]);
  const [text, setText] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const navigate = useNavigate();

  const isSavedRecipes = (id) => {
    // // // savedRecipes.includes({ _id: id });
    // const isSaved = savedRecipes.some((recipe) => recipe._id === id);
    const isSaved =
      Array.isArray(savedRecipes) &&
      savedRecipes.some((recipe) => recipe._id === id);
    // console.log(id);
    // console.log(savedRecipes);
    return isSaved;
  };

  useEffect(() => {
    // testab.zaahirahtravels.com
    const fetchReceipes = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3001/admin/getReceipes"
          "https://testab.zaahirahtravels.com/admin/getReceipes"
        );
        // console.log(response.data.data);
        setReceipes(response.data.data);
      } catch (ex) {
        console.log(ex);
      }
    };

    const fetchSavedRecipes = async () => {
      const id = cookies.admin_token;
      try {
        const response = await axios.get(
          `https://testab.zaahirahtravels.com/admin/savedRecipe/${id}`
        );

        // console.log("fav", response.data.data);

        setSavedRecipes(response.data.data[0].recipes);
      } catch (ex) {
        console.log(ex);
      }
    };
    fetchReceipes();
    fetchSavedRecipes();
  }, [savedRecipes]);

  const handleRecipePage = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleSavedRecipes = async (id) => {
    // const recipeId = id;

    try {
      console.log("receipeId", id);
      console.log("adminId", cookies.admin_token);
      const adminId = cookies["admin_token"];

      const response = await axios.post(
        `https://testab.zaahirahtravels.com/admin/savedRecipes/${id}`,
        { adminId }
      );

      console.log("ant-res", response.data.data);
      setSavedRecipes(response.data.data);
      console.log("savedRecipes", savedRecipes);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleSearch = (e) => {
    setText(e.target.value);
    const filteredRecipe = receipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredRecipes(filteredRecipe);
  };

  return (
    <div className="viewRecipe-container">
      `<h2>Recipes</h2>
      {receipes.length > 0 && (
        <div className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Enter name to search"
            value={text}
            onChange={handleSearch}
            style={{ maxWidth: "40%", marginBottom: "1.5rem" }}
          />
        </div>
      )}
      {(text !== "" && filteredRecipes.length > 0
        ? filteredRecipes
        : receipes
      ).map((recipe) => {
        return (
          <div className="recipe-container" key={recipe._id}>
            <p className="recipe-title">{recipe.name}</p>
            <button
              className="btn-recipe"
              onClick={() => handleSavedRecipes(recipe._id)}
            >
              {/* save */}
              {isSavedRecipes(recipe._id) ? "saved" : "save"}
            </button>
            <p>{recipe.description}</p>
            <img
              src={
                recipe.imageUrl.startsWith("uploads")
                  ? `https://testab.zaahirahtravels.com/admin/${recipe.imageUrl}`
                  : recipe.imageUrl
              }
              alt={recipe.name}
              className="recipe-image"
              onClick={() => handleRecipePage(recipe._id)}
            />
            <p className="cooking-time">
              CookingTime: {recipe.cookingTime} min
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
