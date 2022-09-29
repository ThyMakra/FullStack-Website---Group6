import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import RecipeTags from "../components/recipe-tags";
import RecipeNutrients from "../components/recipe-nutrients";
import Ingredients from "../components/ingredients";
import Instructions from "../components/instructions";
import { prisma } from "../lib/prisma";

function RecipeDetails ({recipe}) 
{
  return (
    <>
      <Head>
        <title>Recipe Details</title>
        <meta name="description" content="Recipe Details" />
        <link rel="icon" href="/recipe_details.ico?" />
      </Head>
      
      <div className="flex flex-col justify-around min-h-screen ">
      <Navbar />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 dark:bg-neutral">
        <div className="row-span-6 justify-around sm:pt-10">
          <figure className="flex justify-around m-5 md:m-2 lg:ml-5 xl:m-0">
            <img src= {recipe.imageLink} style={{width: 390, height: 390, objectFit: 'cover'}} alt={recipe.name}/>
          </figure>
          <h1 className="text-2xl lg:text-3xl dark:text-accent font-bold text-center m-5 pt-5">{recipe.name}</h1>

          <div className="divider dark:before:bg-accent/10 dark:after:bg-accent/10">
            <svg className="bi bi-tags color: rgb(48, 213, 200); w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z" fill="#30d5c8" />
              <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z" fill="#30d5c8" />
            </svg>
          </div>

          <div className="mx-10 md:mx-4 lg:mx-10 ">
            <RecipeTags recipe={recipe} />
          </div>
    
        </div>

        <div className="col-span-3 pt-0 md:pt-10 xl:p-10">
          <RecipeNutrients item={recipe} />
        </div>

        <div className="grid grid-cols-1 col-span-2 md:grid-cols-2 md:col-span-3 gap-5 p-5">
          <div>
            <Ingredients item={recipe} />
          </div>
          <div>
            <Instructions item={recipe} />
          </div>
        </div>
      </div>

      <Footer />
      </div>
    </>
  )
}


export async function getServerSideProps (ctx) {
  const query = ctx.query;
  const recipe = await prisma.recipe.findFirst({
    include: {
      cuisines: true,
      categories: true,
      ingredients: true
    },
    where: {
        id: parseInt(query.id)
    }
  });

  return {
    props: {
      recipe: JSON.parse( JSON.stringify( recipe ) ),
    },
  }
}


export default RecipeDetails;
