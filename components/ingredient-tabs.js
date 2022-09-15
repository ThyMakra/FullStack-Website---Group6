import Image from "next/image";
import React, { useState, useEffect, Fragment } from "react";
import { inject, observer } from "mobx-react";
import { Tooltip } from "@nextui-org/react";
import { fetchIngredient, makeFieldFilter, makeRelatedFilterMany } from "../lib/helpers";

function IngredientTabs ( {
  ingredientStore,
  ingredientCategoryStore,
  dbIngredientCategory,
  filter,
  perPage,
} )
{
  const {
    addIngredient,
    removeIngredient,
    selectedIngredientIds
  } = ingredientStore;

  const [ keyword, setKeyword ] = useState( "" );
  const { categories, setCategories } = ingredientCategoryStore;

  const [ currentPage, setCurrentPage ] = useState( 1 );

  const [ allIngredients, setAllIngredients ] = useState( {} );
  const [ pagination, setPagination ] = useState( {} );

  const firstIngredientCategory = dbIngredientCategory[ 0 ];
  const [ activeTab, setActiveTab ] = useState( firstIngredientCategory.id );
  // const [ activeCat, setActiveCat ] = useState( firstIngredientCategory.name );

  const [ ingredFilter, setIngredFilter ] = useState( {
    ...filter,
    ...makeRelatedFilterMany( "categories", [ activeTab ] )
  } );

  const handleSwitchTab = ( id ) =>
  {
    /* TODO:
      - When changing tab, have a loading bar until state is set. 
      problem: no_ingredient.png is shown when the data is being queried
    */
    setCurrentPage( 1 );
    setIngredFilter(
      makeRelatedFilterMany( "categories", [ id ] )
    );
    setActiveTab( id );
    // setActiveCat( name );
  };

  const chooseIngredient = ( checked, ingredient ) =>
  {
    if ( checked ) addIngredient( ingredient );
    else removeIngredient( ingredient );
    /* // saved: to remove ingredient if it is selected
      // we don't need to remove selected ingredient as we already have pagination
    setIngredFilter({
      ...ingredFilter,
      ...makeFieldFilter(
        'id',
        selectedIngredientIds, 
        'notIn'
      )
    }); */
  }

  const goPreviousPage = () =>
  {
    if ( currentPage > 1 )
    {
      const previous = currentPage - 1;
      setCurrentPage( previous );
    }
  }

  const goNextPage = () =>
  {
    if ( currentPage < pagination.totalPage )
    {
      const next = currentPage + 1;
      setCurrentPage( next );
    }
  };

  const searchKeyword = ( searchString ) =>
  {
    const name = searchString.trimStart();
    setKeyword( name );
    // const delayDebounceFn = setTimeout( () => {
    if ( name !== "" )
    {
      const nameLikeFilter = makeFieldFilter( 'name', name.toLowerCase(), 'contains' );
      nameLikeFilter[ 'name' ][ 'mode' ] = 'insensitive';
      // only search by keyword, ignore filter by categories
      setIngredFilter( nameLikeFilter );
    } else
    {
      handleSwitchTab( activeTab );
    }
    //   }, 100 );
    //   // wait 0.3 seconds after user stop typing
    //   return () => clearTimeout( delayDebounceFn )
  }

  useEffect( () =>
  {
    const getDefaultIngredient = async () =>
    {
      const ingred_result = await fetchIngredient( perPage, currentPage, ingredFilter );
      // await checkNextPage(recipe_result.pagination["totalPage"]);
      setAllIngredients( ingred_result.data );
      setPagination( ingred_result.pagination );
    }
    setCategories( dbIngredientCategory );
    getDefaultIngredient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ingredFilter, currentPage, dbIngredientCategory ] );

  return (
    // <div>
    <div className="m-5 sm:m-10 md:grow">
      {/* Search Bar */ }
      <div className="form-control mb-4">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered dark:bg-accent/10 dark:text-accent"
            value={ keyword }
            onChange={ ( e ) => searchKeyword( e.target.value ) }
          />
          <button className="btn btn-square btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-base-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="h-full flex flex-col overflow-x-auto">
        {/* Tab nav */ }
        { keyword === "" ? (
          // The user is not searching
          <Fragment>
            <ul className="flex text-center border-b border-base-200">
              { categories.map( ( category ) =>
              {
                return (
                  <li
                    key={ category.id }
                    className={ `flex-1 block p-4 rounded-t-lg capitalize cursor-pointer font-bold text-xs lg:text-lg ${ activeTab === category.id
                      ? "relative bg-accent dark:bg-neutral dark:text-accent border-t border-l border-r border-base-200"
                      : "text-neutral/50 dark:text-accent/50"
                      }` }
                    onClick={ () => handleSwitchTab( category.id ) }
                  >
                    { activeTab === category.id && (
                      <span className="absolute inset-x-0 w-full h-px bg-accent dark:bg-neutral -bottom-px"></span>
                    ) }
                    { category.name }
                  </li>
                );
              } )
              }
            </ul>

            {/* <TabContent /> */ }
            <div
              className={ `grid gap-2 form-control border border-t-0 p-4 px-12 
                ${ allIngredients.length > 0
                  ? "items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "items-center grid-cols-1"
                }` }
            >
              { allIngredients.length > 0 ? (
                allIngredients.map( ( ingredient, index ) =>
                {
                  return (
                    <div key={ index } className="flex items-start">
                      <label className="label cursor-pointer py-4">
                        <input
                          type="checkbox"
                          checked={ selectedIngredientIds.includes( ingredient.id ) }
                          className="checkbox dark:checkbox-accent"
                          onChange={ ( e ) => chooseIngredient(
                            e.target.checked,
                            [ ingredient.id, ingredient.name ]
                          ) }
                        />
                        <Tooltip placement="top" content={
                          <Image
                            src="/no_recipe.png"
                            width={ 250 }
                            height={ 200 }
                            alt="Ingredient Image"
                            objectFit="cover"
                          />
                        }>
                          <span className="label-text capitalize text-lg md:text-sm xl:text-lg dark:text-accent ml-5">
                            { ingredient.name }
                          </span>
                        </Tooltip>
                      </label>
                    </div>
                  );
                } )
              ) : (
                <div className="flex justify-center">
                  <Image
                    src="/no_ingredient.png"
                    alt="empty tab"
                    width={ 700 }
                    height={ 500 }
                  />
                </div>
              ) }
            </div>
          </Fragment>
        ) : (
          // Searched ingredients filtered by keyword
          <div
            className={ `grid gap-21 form-control border rounded-t-lg p-4 px-12 ${ allIngredients.length > 0
              ? "items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "items-center grid-cols-1"
              } ` }
          >
            { allIngredients.length > 0 ? (
              allIngredients.map( ( ingredient, index ) =>
              {
                return (
                  <div key={ index } className="flex items-start">
                    <label className="label cursor-pointer py-4">
                      <input
                        type="checkbox"
                        checked={ selectedIngredientIds.includes( ingredient.id ) }
                        className="checkbox dark:checkbox-accent"
                        onChange={ ( e ) => chooseIngredient(
                          e.target.checked,
                          [ ingredient.id, ingredient.name ]
                        ) }
                      />
                      <span className="label-text capitalize text-lg dark:text-accent ml-5">
                        { ingredient.name }
                      </span>
                    </label>
                  </div>
                );
              } )
            ) : (
              // Display image if there's no ingredient
              <div className="flex justify-center">
                <Image
                  src="/no_ingredient.png"
                  alt="No Ingredient"
                  width={ 700 }
                  height={ 500 }
                />
              </div>
            ) }
          </div>
          // <IngredientTab />
        ) }

        {/* Pagination button */ }
        <div className="btn-group justify-center my-5">
          <button className="btn btn-primary text-accent lg:text-base" onClick={ () => goPreviousPage() }>«</button>
          <button className="btn btn-primary text-accent lg:text-base sm:w-36 lg:w-56">Page { currentPage } </button>
          <button className="btn btn-primary text-accent lg:text-base" onClick={ () => goNextPage() }>»</button>
        </div>
      </div>
    </div>
  );
}

export default inject(
  "ingredientStore",
  "ingredientCategoryStore"
)( observer( IngredientTabs ) );
