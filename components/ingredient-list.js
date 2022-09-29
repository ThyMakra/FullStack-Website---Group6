import Link from "next/link";
import { useEffect } from "react";
import { inject, observer } from "mobx-react";

function IngredientList(props) {
  const {
    selectedIngredients,
    selectedIngredientIds,
    removeIngredient,
    clearAll,
  } = props.ingredientStore;

  useEffect(() => {}, [selectedIngredientIds])

  return (
    <div>
      {/* The button to open modal */ }
      <label
        htmlFor="my-modal-4"
        className=" indicator btn btn-square btn-accent dark:btn-active btn-lg rounded-2xl modal-button shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] dark:shadow-accent/50"
      >
        <div className="indicator-item badge badge-primary btn-circle btn-sm border-2 border-accent dark:border-neutral text-accent">         
          {/* <span className="animate-ping absolute h-full w-full rounded-full bg-primary" /> */}
          { selectedIngredientIds.length }
        </div>
        
        <svg className="bi bi-basket color: rgb(48, 213, 200); w-10 h-10 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" fill="#30d5c8" />
        </svg>
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label
        htmlFor="my-modal-4"
        className="modal modal-bottom sm:modal-middle cursor-pointer"
      >
        <label
          className="modal-box relative dark:bg-neutral dark:shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] dark:shadow-accent"
          htmlFor=""
        >
          <h2 className="font-bold text-center text-xl sm:text-2xl dark:text-accent">
            Ingredients
          </h2>

          <div
            className={`form-control flex flex-row flex-wrap my-10 ${
              selectedIngredients.length == 0 ? "justify-center" : ""
            }`}
          >
            {selectedIngredients.length == 0 ? (
              <div className="text-center dark:text-accent">No ingredient selected yet</div>
            ) : (
              selectedIngredients.map((ingredient, index) => {
                return (
                  <label
                    key={index}
                    className="label card flex flex-row bg-accent dark:bg-neutral rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] dark:shadow-accent/25 my-3 mr-5 px-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="checkbox rounded-full dark:checkbox-accent"
                      checked
                      // value={isExist(ingredient.id)}
                      onChange={() =>
                        removeIngredient([
                          selectedIngredientIds[index],
                          ingredient,
                        ])
                      }
                    />
                    <span className="label-text pl-4 text-lg dark:text-accent capitalize">
                      {ingredient}
                    </span>
                  </label>
                );
              })
            )}
          </div>

          <div className="flex justify-between">
            <button
              className="btn btn-ghost dark:text-accent dark:hover:bg-accent/25"
              onClick={() => clearAll()}
            >
              Clear all
            </button>

            <Link
              href={props.text === "Find Recipes" ? "/recipe-results" : "/"}
            >
              <button
                className="btn btn-primary text-accent text-lg dark:disabled:glass"
                disabled={selectedIngredients.length == 0}
              >
                {props.text}
              </button>
            </Link>
          </div>
        </label>
      </label>
    </div>
  );
}

export default inject("ingredientStore")(observer(IngredientList));
