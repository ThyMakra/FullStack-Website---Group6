import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scroll-top";
import BookmarkCard from "../components/bookmark-card";
import { motion } from "framer-motion";
import { fetchRecipe, makeFieldFilter } from "../lib/helpers";
import useAuth from "../lib/hook/AuthProvider";

function Bookmarks ( { bookmarkStore } )
{
  /* NOTE: this page does not have scrollbar */
  const { bookmarks, setBookmark } = bookmarkStore;
  const { getDocument, user } = useAuth();
  const [ bookmarkCount, setBookmarkCount ] = useState(0);
  const [ allRecipes, setAllRecipes ] = useState([]);

  useEffect( () =>
  {
    const getRecipeRecords = async () => {
      const recipes = await fetchRecipe(
        1, 
        makeFieldFilter("id", bookmarks, "in"),
        {name: 'asc'},
        1000
      );

      setAllRecipes(recipes.data);
    }
    getRecipeRecords();

    // get bookmark list from Firestore
    const setBookmarkProp = async () => {
      const userDoc = await getDocument();
      const storedBookmarks = userDoc.bookmarks ?? [];
      setBookmarkCount(storedBookmarks.length);

      if (storedBookmarks.sort().toString() !== bookmarks.sort().toString()) {
        setBookmark(storedBookmarks);
      }
    }
    setBookmarkProp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ user, bookmarks ] )

  return (
    <>
      <Head>
        <title>Bookmarks</title>
        <meta name="description" content="Bookmarked Recipes" />
        <link rel="icon" href="/bookmarks.ico?" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Add pagination here */}
        <main className="flex-1 flex-col dark:bg-neutral">
          <div className="flex flex-row px-5 pt-5">
            <motion.div
              initial={ { scale: 0 } }
              animate={ { rotate: 360, scale: 1 } }
              transition={ { type: "spring", stiffness: 260, damping: 30 } }
              whileHover={ { rotateY: 360 } }
              whileTap={ { scale: 1.2 } }
            >
              <svg
                className="bi bi-journal-bookmark-fill color: rgb(255, 210, 51); h-11 w-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z"
                  fill="#ffd233"
                />
                <path
                  d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"
                  fill="#ffd233"
                />
                <path
                  d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"
                  fill="#ffd233"
                />
              </svg>
            </motion.div>
            <h1 className="text-2xl lg:text-3xl dark:text-accent font-bold py-2">
              Total:
            </h1>
            <h2 className="text-xl lg:text-2xl dark:text-accent font-bold p-3">
              { bookmarkCount } bookmarked
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-5">

          { allRecipes.map( ( recipe, index ) =>
            {
              return (
                <motion.div
                  key={ index }
                  className="flex justify-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  transition={ { duration: 0.3 } }
                  variants={ {
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  } }
                >
                  <BookmarkCard bookmarked={ recipe } />
                </motion.div>
              );
            } ) }
          </div>
        </main>

        <ScrollTop />

        <Footer />
      </div>
    </>
  );
}

export default inject( "bookmarkStore" )( observer( Bookmarks ) );
