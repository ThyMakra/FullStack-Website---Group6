import React from 'react';

import Navbar from '../components/navbar';
import { CreateRecipe } from '../components/recipe/createRecipe';
import { DeleteRecipe } from '../components/recipe/deleteRecipe';
import { CreateRecipeCategory } from '../components/recipeCategory/createRecipeCategory';
import { DeleteRecipeCategory } from '../components/recipeCategory/deleteRecipeCategory';
import { prisma } from '../lib/prisma';


const stringifyRelatedObjectNames  = (objects, attr, key = "name") => {
  return objects.map(obj => obj[attr][key]).toString();
}


export default function SRecipes ({allRecipes, allRecipeCategories}) {

  return (
    <div>
      <Navbar />

      <div className="bg-white rounded-md p-12 shadow-md flex justify-evenly">
        {/* Category */}
        <div>
          <h2 className="card-title">Actions | Recipe Category</h2>

          <div className="bg-white rounded-md p-12 shadow-md flex justify-around">

            {/* Form here */}
            <CreateRecipeCategory />   

            <DeleteRecipeCategory />   
          </div>

          
        </div>

        {/* Recipe */}
        <div>
          <h2 className="card-title">Actions | Recipe</h2>

          <div className="bg-white rounded-md p-12 shadow-md flex justify-around">
            <CreateRecipe categories={allRecipeCategories}/>   

            <DeleteRecipe />   
          </div>
          
        </div>
        
      </div>

      <h2 className="card-title">All Categories</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
            <tbody>
              {
                allRecipeCategories.map(category => (
                  <tr key={category.id}>
                    {Object.keys(category).map((info, i) => (
                      <td key={i}>{category[info]}</td>
                    ) )}
                  </tr>
                ))
              }
            </tbody>
        </table>
      </div>

      <h2 className="card-title">All Recipes</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
            <thead>
              {
                !!allRecipes.length && (
                  <tr>
                    {Object.keys(allRecipes[0]).map(key => (
                      <td key={key}>{key}</td>
                    ))}
                  </tr>
                )
              }
            </thead>
            <tbody>
              {
                allRecipes.map(recipe => (
                  <tr key={recipe.id}>
                    {Object.keys(recipe).map((info, i) => {
                      if (info !== "categories") return (
                        <td key={i}>{recipe[info]}</td>
                      ); else return (
                        <td key={i}>{stringifyRelatedObjectNames(recipe[info], "recipeCategory")}</td>
                      )
                    } )}
                  </tr>
                ))
              }
            </tbody>
        </table>
      </div>

    </div>
  )
}

export async function getStaticProps() {
  const allRecipes = await prisma.recipe.findMany({
    include: {
      categories: {
        select: {
          recipeCategory: {
            select: {
              name: true,
            }
          },
          recipeCategoryId: true,
        }
      },
    }
  });
  const allRecipeCategories = await prisma.recipeCategory.findMany();

  return {
    props: { 
      allRecipes: JSON.parse(JSON.stringify(allRecipes)),
      allRecipeCategories: JSON.parse(JSON.stringify(allRecipeCategories)),
    },
  }
}
