import { useEffect } from "react";
import { motion } from "framer-motion";

function RecipeTags({recipe}) {
  const categoriesTag = recipe.categories
  const cuisines = recipe.cuisines
  var cuisinesTag = ""

  cuisines.map((cuisine) => {
    cuisinesTag += cuisine.name + " | "
  }) 

  cuisinesTag = cuisinesTag.slice(0,-3)


  useEffect(
    ()=> {},
    [recipe, cuisines]
  )
  return (
    <div className="flex flex-col items-start">
      {/* Meal Tags */}
      <div className="flex flex-wrap">
        {
          categoriesTag.map((tag) => {
            return (
              <div key={ tag.id } className="badge badge-outline dark:text-accent badge-lg mr-2 my-1">
                { tag.name }
              </div>
            )
          })
        }
      </div>

      <div className="divider dark:before:bg-accent/10 dark:after:bg-accent/10"></div>

      {/* Cuisine */}
      <motion.label className="swap -mt-5" animate={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
        {/* <!-- this hidden checkbox controls the state --> */}
        <input type="checkbox" style={{ opacity: 0 }} />
        {/* Badge */}
        <div className="badge badge-outline dark:badge-accent swap-off gap-5 p-5 my-5">
          <svg className="color: rgb(0, 0, 0); w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 256">
            <path d="M212,32V224a8,8,0,0,1-16,0V168H148a8.2,8.2,0,0,1-6-2.7,8.1,8.1,0,0,1-2-6.2,412.8,412.8,0,0,1,11.8-59.3c12-42.4,28.7-67.8,49.5-75.3A7.9,7.9,0,0,1,212,32ZM127.9,78.7l-8-48a8,8,0,1,0-15.8,2.6L110.6,72H92V32a8,8,0,0,0-16,0V72H57.4l6.5-38.7a8,8,0,1,0-15.8-2.6l-8,48h0A4.9,4.9,0,0,0,40,80a44.1,44.1,0,0,0,36,43.3V224a8,8,0,0,0,16,0V123.3A44.1,44.1,0,0,0,128,80a4.9,4.9,0,0,0-.1-1.2Z" fill="#000000" />
          </svg>
          Cuisine
        </div>
        {/* Cuisine From */}
        <div className="badge text-accent dark:outline swap-on gap-5 p-5 my-5" >
          <svg className="color: white w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 256">
            <path d="M212,32V224a8,8,0,0,1-16,0V168H148a8.2,8.2,0,0,1-6-2.7,8.1,8.1,0,0,1-2-6.2,412.8,412.8,0,0,1,11.8-59.3c12-42.4,28.7-67.8,49.5-75.3A7.9,7.9,0,0,1,212,32ZM127.9,78.7l-8-48a8,8,0,1,0-15.8,2.6L110.6,72H92V32a8,8,0,0,0-16,0V72H57.4l6.5-38.7a8,8,0,1,0-15.8-2.6l-8,48h0A4.9,4.9,0,0,0,40,80a44.1,44.1,0,0,0,36,43.3V224a8,8,0,0,0,16,0V123.3A44.1,44.1,0,0,0,128,80a4.9,4.9,0,0,0-.1-1.2Z" fill="white" />
          </svg>         
          {cuisinesTag}
        </div>
      </motion.label>
    </div>
  )
}

export default RecipeTags;
