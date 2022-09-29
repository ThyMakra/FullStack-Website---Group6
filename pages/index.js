import Head from "next/head";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import IngredientTabs from "../components/ingredient-tabs.js";
import IngredientList from "../components/ingredient-list.js";
import ScrollTop from "../components/scroll-top";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prisma } from "../lib/prisma";

const PER_PAGE = 24;

function Home ( { dbIngredientCategory }, props )
{
  const [ ingreFilter, setIngreFilter ] = useState( {} );

  return (
    <>
      <Head>
        <title>Ingredeck</title>
        <meta name="description" content="Ingredient Checklists" />
        <link rel="icon" href="/favicon.ico?" />
      </Head>

      <AnimatePresence mode="wait">
        <motion.div
          className="flex flex-col justify-around min-h-screen"
          initial={ { opacity: 0 } }
          animate={ {
            opacity: 1,
            transition: {
              duration: 1,
              ease: "easeInOut",
            },
          } }
          exit={ { opacity: 0 } }
        >
          <Navbar />

          {/* Ingredient Tabs */}
          <div className="flex-1 h-full justify-around dark:bg-neutral">
            <IngredientTabs
              dbIngredientCategory={ dbIngredientCategory }
              filter={ ingreFilter }
              perPage={ PER_PAGE }
            />
          </div>

          {/* Ingredient List */}
          <div className="fixed bottom-5 sm:bottom-7 2xl:bottom-24 left-5 sm:left-10">
            <IngredientList text="Find Recipes" />
          </div>

          <ScrollTop />
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default Home;

export const getServerSideProps = async () =>
{
  const SORT_FIRST = "Meats";
  const dbIngCate = await prisma.ingredientCategory.findMany( {
    select: {
      name: true,
      id: true,
    },
    orderBy: {
      id: "asc"
    }
  } );

  return {
    props: {
      dbIngredientCategory: [
        ...dbIngCate.filter(ic => ic.name === SORT_FIRST),
        ...dbIngCate.filter(ic => ic.name !== SORT_FIRST)
      ],
    },
  };
};
