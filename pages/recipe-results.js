import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CookbookIcon from "../components/icons/cookbooks-icon";
import IngredientList from "../components/ingredient-list.js";
import AllRecipes from "../components/recipe/allRecipe";
import ScrollTop from "../components/scroll-top";
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { motion } from "framer-motion";
import { makeRelatedFilterMany } from "../lib/helpers";
import useAuth from "../lib/hook/AuthProvider";

function RecipesResult ( {
  ingredientStore,
  recipeResultStore,
} )
{
  const { getDocument, user } = useAuth();
  const { totalRecipeResult } = recipeResultStore;
  const { selectedIngredientIds } = ingredientStore;

  const [ recipeFilter, setRecipeFilter ] = useState( {} );
  const [ bookmarkList, setBookmarkList ] = useState(null);

  useEffect( () =>
  {
    // get bookmark list from Firestore
    const setBookmarkProp = async () => {
      const userDoc = await getDocument();
      setBookmarkList(userDoc.bookmarks ?? []);
    }
    setBookmarkProp();

    /* NOTE:
      - for now query "some", should ask other if we should use "every"
    */
    setRecipeFilter( makeRelatedFilterMany( 'ingredients', selectedIngredientIds ) );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ totalRecipeResult, selectedIngredientIds, user ] );

  return (
    <>
      <Head>
        <title>Recipe Results</title>
        <meta name="description" content="Recipe Results" />
        <link rel="icon" href="/recipe_results.ico?" />
      </Head>

      <div className="flex flex-col justify-between min-h-screen">
        <Navbar />

        <main className="flex-1 flex-col dark:bg-neutral">
          <div className="flex flex-row px-5 pt-5">
            <motion.div
              initial={ { scale: 0 } }
              animate={ { scale: 1 } }
              transition={ { type: "spring", stiffness: 260, damping: 30 } }
              whileHover={ { scaleX: 1.2 } }
              whileTap={ { rotateY: 90 } }
            >
              <CookbookIcon />
            </motion.div>
            <h1 className="text-2xl lg:text-3xl dark:text-accent font-bold pt-5">
              Result:
            </h1>
            <h2 className="text-xl lg:text-2xl dark:text-accent font-bold pt-6 pl-3">
              { totalRecipeResult } recipes
            </h2>
          </div>

          <AllRecipes filter={ recipeFilter } currentPage={ 1 }  bookmarkList={ bookmarkList } />

          {/* Ingredient List */ }
          <div className="fixed bottom-5 sm:bottom-7 left-5 sm:left-10">
            <IngredientList text="Select Ingredients" />
          </div>
        </main>

        <ScrollTop />
        <Footer />
      </div>
    </>
  );
}

export default inject(
  "ingredientStore",
  "recipeResultStore"
)( observer( RecipesResult ) );
