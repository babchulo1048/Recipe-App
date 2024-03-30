import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const Logout = () => {
    setCookies("access_token", "");
  };
  return (
    <main>
      <header>
        {cookies["access_token"] ? (
          <>
            <Link to="/" className="logo">
              EyuRecipe
            </Link>
            <nav>
              <Link to="/create" className="nav-link">
                CreateRecipe
              </Link>
              <Link to="/savedRecipe" className="nav-link">
                Saved Recipes
              </Link>
              <Link className="nav-link" onClick={Logout}>
                Logout
              </Link>
            </nav>
          </>
        ) : (
          <>
            <Link to="/" className="logo">
              EyuRecipe
            </Link>
            <nav>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </nav>
          </>
        )}
      </header>
    </main>
  );
};

export default Header;
