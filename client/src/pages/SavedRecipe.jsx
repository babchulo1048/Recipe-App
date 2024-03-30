import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const SavedRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [cookies, setAdminCookies] = useCookies(["admin_token"]);
  const navigate = useNavigate();

  const id = cookies.admin_token;
  console.log("id", id);

  useEffect(() => {
    // testab.zaahirahtravels.com
    const fetchRecipes = async () => {
      const response = await axios.get(
        `https://testab.zaahirahtravels.com/admin/savedRecipe/${id}`
      );

      console.log("savedRecipes", response.data.data[0].recipes);
      setRecipes(response.data.data[0].recipes);
    };
    fetchRecipes();
  }, []);

  const handleRecipePage = (id) => {
    navigate(`/recipe/${id}`);
  };

  const handleRemoveRecipe = async (id) => {
    try {
      console.log("receipeId", id);
      console.log("adminId", cookies.admin_token);
      const adminId = cookies["admin_token"];

      const response = await axios.delete(
        `https://testab.zaahirahtravels.com/admin/savedRecipe/${id}`,
        { data: { adminId } }
      );

      console.log("ant-res", response.data.data);
      setRecipes(response.data.data.recipes);
    } catch (ex) {
      console.log(ex);
    }
  };

  if (recipes.length <= 0) {
    return <h1>No Favorite Found</h1>;
  }

  return (
    <div className="viewRecipe-container">
      <h2>Saved Recipes</h2>
      {recipes.map((recipe) => {
        return (
          <div className="recipe-container" key={recipe._id}>
            <p className="recipe-title">{recipe.name}</p>
            <button
              className="btn-recipe"
              type="button"
              onClick={() => handleRemoveRecipe(recipe._id)}
            >
              Remove
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

export default SavedRecipe;
