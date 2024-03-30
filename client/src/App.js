import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateRecipe from "./pages/CreateRecipe";
import RecipePage from "./pages/RecipePage";
import SavedRecipe from "./pages/SavedRecipe";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/savedRecipe" element={<SavedRecipe />} />
      </Routes>
    </div>
  );
}

export default App;
