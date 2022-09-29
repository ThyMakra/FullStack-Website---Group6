import { motion } from "framer-motion";
import { inject, observer } from "mobx-react";
import { React, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component"

import RecipeCard from "../recipe-card";
import { fetchRecipe } from "../../lib/helpers";


const AllRecipes = ({recipeResultStore, bookmarkStore, bookmarkList, filter, currentPage = 1}) => {
  const { setTotalRecipeResult } = recipeResultStore;
  const { setBookmark } = bookmarkStore;

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(true);

  const checkNextPage = async (totalPage) => {
    // stop the infinite scroll on last page
    if (page === totalPage) {
      setHasMore(false);
    }
  }

  const getRecipeOnScroll = async () => {
    const toPage = page + 1;
    setPage(toPage); // go to next page

    const recipe_result = await fetchRecipe(toPage, filter);
    await checkNextPage(recipe_result.pagination["totalPage"]);
    setRecipes([...recipes, ...recipe_result.data]); // increment new recipes to the existing recipes list
  }

  useEffect(() => {
    setBookmark(bookmarkList);
    const getDefaultRecipe = async () => {
      setHasMore(true);
      setPage(currentPage);

      const recipe_result = await fetchRecipe(currentPage, filter);
      await checkNextPage(recipe_result.pagination["totalPage"]);
      setTotalRecipeResult(recipe_result.pagination["total"])
      setRecipes(recipe_result.data);
    };

    getDefaultRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, bookmarkList]);


  return (
    <InfiniteScroll
      className="flex justify-around md:grid grid-cols-2 my-5 lg:flex flex-wrap"
      dataLength={recipes.length}
      next={getRecipeOnScroll}
      hasMore={hasMore}
      /* endMessage={
        <div className="container card items-center text-center">
          <h3 className="card-title text-xl dark:text-accent">
            No more recipe to show
          </h3>
        </div>
      } */
    >
      {recipes.map((recipe) => (
        <motion.div
          key={recipe.id}
          className="flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, scale: 1 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <RecipeCard recipe={recipe} bookmarked={bookmarkList?.includes(recipe.id) ?? false} bookmarkList={bookmarkList} />
        </motion.div>
    ))}
    </InfiniteScroll>
  );
};


export default inject(
  "recipeResultStore",
  "bookmarkStore"
)( observer( AllRecipes ) );
