import React, { useState, useCallback, useEffect } from "react";
import { inject, observer } from "mobx-react";

function IngredientTabs(props) {
  const { remainingIngredients, addIngredient, setRemainingIngredients } =
    props.ingredientStore;
  const { categories } = props.ingredientCategoryStore;
  const [activeTab, setActiveTab] = useState(1);

  const handleSwitchTab = (id) => {
    setActiveTab(id);
  };

  // useEffect(() => {
  //   //https://bobbyhadz.com/blog/react-sort-array-of-objects
  //   const sortedIngredients = remainingIngredients.sort((a, b) =>
  //     a.name > b.name ? 1 : -1
  //   );
  //   setRemainingIngredients(sortedIngredients);
  // }, [remainingIngredients, setRemainingIngredients]);

  const TabContent = useCallback(() => {
    const sortedIngredients = remainingIngredients.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    setRemainingIngredients(sortedIngredients);

    return (
      <div className="form-control items-start flex border border-t-0 p-4 px-12">
        {remainingIngredients.map((ingredient) => {
          return (
            <div key={ingredient.id} className="flex-1">
              {ingredient.categoryId === activeTab && (
                <label className="label cursor-pointer py-4">
                  <input
                    type="checkbox"
                    className="checkbox"
                    // defaultChecked={isExist(ingredient.id)}
                    // defaultValue={ingredient.id}
                    onChange={() => addIngredient(ingredient)}
                  />
                  <span className="label-text ml-5 capitalize text-lg">
                    {ingredient.name}
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [activeTab, addIngredient, remainingIngredients, setRemainingIngredients]);

  return (
    <div className="h-full flex flex-col overflow-x-scroll">
      {/* Tab nav */}
      <ul className="flex text-center border-b border-base-200">
        {categories.map((category) => {
          return (
            <li
              key={category.id}
              className={`flex-1 block p-4 rounded-t-lg capitalize cursor-pointer font-bold text-lg ${
                activeTab === category.id
                  ? "relative bg-accent border-t border-l border-r border-base-200"
                  : "text-neutral/50"
              }`}
              onClick={() => handleSwitchTab(category.id)}
            >
              {activeTab === category.id && (
                <span className="absolute inset-x-0 w-full h-px bg-accent -bottom-px"></span>
              )}
              {category.name}
            </li>
          );
        })}
      </ul>

      {/* Tab content */}
      <TabContent />
    </div>
  );
}

export default inject(
  "ingredientStore",
  "ingredientCategoryStore"
)(observer(IngredientTabs));
