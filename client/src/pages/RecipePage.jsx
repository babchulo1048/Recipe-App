import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Modal, Button, Form } from "react-bootstrap";

const RecipePage = () => {
  const [receipes, setReceipes] = useState({});
  const { id } = useParams();
  const [cookies, setAdminCookies] = useCookies(["admin_token"]);
  const [updatedProducts, setUpdatedProducts] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instruction: "",
    imageUrl: "",
    ingredients: [],
    cookingTime: 0,
  });
  const [files, setFiles] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
  };

  useEffect(() => {
    // testab.zaahirahtravels.com
    const fetchReceipes = async () => {
      const response = await axios.get(
        `https://testab.zaahirahtravels.com/admin/recipe/${id}`
      );
      console.log("res.data", response.data.data);
      setReceipes(response.data.data);
    };
    fetchReceipes();
  }, []);

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = formData.ingredients;
    ingredients[idx] = value;
    setFormData({ ...formData, ingredients });
  };

  const AddIngredients = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://testab.zaahirahtravels.com/admin/recipe/${id}`
      );

      console.log(response.data.data);

      setReceipes(response.data.data);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleEdit = () => {
    if (!cookies.admin_token) {
      // Admin not authorized, show an alert or redirect to a login page
      alert("Not authorized");
      return;
    }
    setShowModal(true);
    console.log("receipes:", receipes);
    setUpdatedProducts(receipes);
    // console.log("updatedProducts:", updatedProducts);
    setFormData({
      name: receipes.name,
      description: receipes.description,
      instruction: receipes.instruction,
      imageUrl: receipes.imageUrl,
      ingredients: receipes.ingredients,
      cookingTime: receipes.cookingTime,
    });

    setFiles(files);
    console.log(formData);
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.set("name", formData.name);
      data.set("description", formData.description);
      data.set("instruction", formData.instruction);
      // data.set("imageUrl", formData.imageUrl);
      data.set("ingredients", formData.ingredients);
      data.set("cookingTime", formData.cookingTime);

      console.log(files);

      if (files) {
        data.set("file", files); // Append the file to the FormData object if it exists
      } else {
        data.set("imageUrl", formData.imageUrl); // Set the image URL if no file is selected
      }

      const response = await axios.put(
        `https://testab.zaahirahtravels.com/admin/recipe/${id}`,
        data
      );

      console.log("res-updated", response.data.data);
      setReceipes(response.data.data);

      if (response.status === 200) {
        const recipeId = response.data.data._id;
        console.log("res-data", response.data.data);

        const adminId = cookies.admin_token;
        console.log("cookies.admin_token");
        alert("Recipe Updated");

        await axios.put(
          `https://testab.zaahirahtravels.com/admin/recipes/${recipeId}/admin`,
          {
            adminId,
          }
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  if (!receipes.imageUrl) {
    return <div>Loading...</div>;
  }

  const imageUrl = receipes.imageUrl.startsWith("uploads")
    ? `https://testab.zaahirahtravels.com/admin/${receipes.imageUrl}`
    : receipes.imageUrl;

  const ingredientsArray = receipes.ingredients[0].split(",");

  return (
    <div className="recipeDetail">
      <div className="recipeDetail-img">
        <img src={imageUrl} alt={receipes.name} className="recipe-img" />
      </div>
      <div className="recipeDetail-info">
        <h3>{receipes.name}</h3>
        <p style={{ color: "#fff" }}>By {receipes.admin.name}</p>
        <div className="buttons-wrap">
          <button
            onClick={
              cookies.admin_token === receipes.admin._id
                ? handleEdit
                : () =>
                    alert(
                      "Sorry, you are not authorized to update this receipes."
                    )
            }
            className="btn btn-primary"
            // type="button"
          >
            update
          </button>
          <button
            className="btn btn-danger"
            style={{ borderRadius: "10px", maxWidth: "100px" }}
            onClick={
              cookies.admin_token === receipes.admin._id
                ? handleDelete
                : () =>
                    alert(
                      "Sorry, you are not authorized to delete this receipes."
                    )
            }
          >
            delete
          </button>
        </div>
        <p>{receipes.description}</p>
        <h5>Instruction</h5>
        <p>{receipes.instruction}</p>
        <h5>Ingredients</h5>
        <ul>
          {ingredientsArray.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          id="editUserModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label className="label"> Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="label">Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                {formData.ingredients.map((ingredient, idx) => {
                  return (
                    <Form.Control
                      key={idx}
                      type="text"
                      placeholder="ingredients"
                      name="ingredients"
                      value={ingredient}
                      onChange={(event) => handleIngredientChange(event, idx)}
                    />
                  );
                })}
              </Form.Group>
              <button
                className="secondary"
                onClick={AddIngredients}
                type="button"
              >
                Add Ingredients
              </button>
              <Form.Group>
                <textarea
                  type="text"
                  placeholder="instructions"
                  name="instruction"
                  value={formData.instruction}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <div className="image-input">
                  <Form.Control
                    type="text"
                    placeholder="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    style={{ flex: "0 0 82%" }}
                  />
                  <Form.Control
                    type="file"
                    name="file"
                    style={{ flex: "1" }}
                    onChange={handleFileChange}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="cookingTime"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              type="submit"
              // disabled={
              //   !formData.title || !formData.summary || !content || !files
              // }
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default RecipePage;
