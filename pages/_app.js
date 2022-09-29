import { Provider } from "mobx-react";

import "../styles/globals.css";

import { AuthProvider } from "../lib/hook/AuthProvider";
import AuthStateChange from "../lib/layout/AuthStateChange";
import BookmarkStore from "../stores/BookmarkStore";
import IngredientCategoryStore from "../stores/IngredientCategoryStore";
import IngredientStore from "../stores/IngredientStore";
import RecipeResultStore from "../stores/RecipeResultStore";
import RecipeStore from "../stores/RecipeStore";


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthStateChange>
        <Provider
          recipeStore={RecipeStore}
          ingredientStore={IngredientStore}
          ingredientCategoryStore={IngredientCategoryStore}
          bookmarkStore={BookmarkStore}
          recipeResultStore={RecipeResultStore}
        >
          <Component {...pageProps} />
        </Provider>
      </AuthStateChange>
    </AuthProvider>
  );
}

export default MyApp;
