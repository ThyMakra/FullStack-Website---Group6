import Head from "next/head";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import AllRecipes from "../components/recipe/allRecipe";
import ScrollTop from "../components/scroll-top";
import SliderFilter from "../components/slider-filter";
import { makeFieldFilter, makeRelatedFilterMany } from "../lib/helpers";
import useAuth from "../lib/hook/AuthProvider";
import { prisma } from "../lib/prisma";

function Cookbooks ( { allRecipeCategories, allCuisines } )
{
  /* TODO: get max properties from table*/
  const maxCalories = 1674.94;
  const maxDuration = 30300 / 60;

  const { getDocument, user } = useAuth();

  const [ recipeFilter, setRecipeFilter ] = useState( {} );
  const [ keyword, setKeyword ] = useState( "" );
  const [ categorySelected, setCategorySelected ] = useState( undefined );
  const [ calories, setCalories ] = useState( maxCalories );
  const [ duration, setDuration ] = useState( maxDuration );
  /* TODO: find a way to pass this without infinite loop in AllRecipes */
  const [ bookmarkList, setBookmarkList ] = useState(null);

  function handleChangeCalories ( event, value )
  {
    setRecipeFilter( {
      ...recipeFilter,
      ...makeFieldFilter( 'calories', value, 'lte' )
    } );
  }

  function handleChangeDuration ( event, value )
  {
    setRecipeFilter( {
      ...recipeFilter,
      ...makeFieldFilter( 'durationSecond', value * 60, 'lte' )
    } );
  }

  useEffect( () =>
  {
    // get bookmark list from Firestore
    const setBookmarkProp = async () => {
      const userDoc = await getDocument();
      setBookmarkList(userDoc.bookmarks ?? []);
    }
    setBookmarkProp();

    if ( keyword !== "" )
    /* NOTE: 
      ask team whether keyword search should be independent like index page
     */
    {
      // wait 0.5 seconds after user stop typing
      const delayDebounceFn = setTimeout( () =>
      {
        const nameLikeFilter = makeFieldFilter( 'name', keyword.toLowerCase(), 'contains' );
        nameLikeFilter[ 'name' ][ 'mode' ] = 'insensitive';
        setRecipeFilter( {
          ...recipeFilter,
          ...nameLikeFilter
        } );
      }, 500 );
      return () => clearTimeout( delayDebounceFn )
    } else
    {
      const { [ 'name' ]: _, ...withoutName } = recipeFilter;
      setRecipeFilter( withoutName );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ keyword, user ] )

  return (
    <>
      <Head>
        <title>Cookbooks</title>
        <meta name="description" content="Recipes" />
        <link rel="icon" href="/cookbooks.ico?" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex-col dark:bg-neutral">
          <div className="flex flex-col md:flex-row justify-end items-center space-y-5 md:space-y-0 mx-6 md:m-5">
            {/* Search Bar */}
            <div className="form-control flex-1 items-end order-first md:order-last mt-5 md:mt-0">
              <div className="input-group w-screen max-w-xs sm:max-w-xl md:w-fit lg:max-w-xs">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered w-screen md:w-52 lg:w-screen dark:bg-accent/10 dark:text-accent"
                  value={ keyword }
                  onChange={ ( e ) => setKeyword( e.target.value.trimStart() ) }
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
            {/* Select Filter */}
            <select
              className="select shrink dark:text-accent dark:bg-neutral w-full md:w-64 xl:w-72 max-w-2xl shadow-md dark:shadow-accent/25 mx-5"
              defaultValue={ "none" }
              onChange={ ( e ) =>
              {
                const value = parseInt( e.target.value );
                // reset filter when filter by cuisine
                if ( value === 0 ) setRecipeFilter( {} );
                else setRecipeFilter( makeRelatedFilterMany( 'cuisines', [ value ] ) );

                // reset components
                setCategorySelected( "none" );
                setCalories( maxCalories );
                setDuration( maxDuration );
                setKeyword( "" );
              } }
            >
              <option disabled value={ "none" }>
                Filter by cuisines
              </option>
              <option className="text-base" value={ 0 }>All</option>
              { allCuisines.map( cuisine => (
                <option className="text-base" value={ cuisine.id } key={ cuisine.id }>{ cuisine.name }</option>
              ) ) }
            </select>

            <select
              className="select shrink dark:text-accent dark:bg-neutral w-full md:w-72 max-w-2xl shadow-md dark:shadow-accent/25 mx-5"
              defaultValue={ "none" }
              value={ categorySelected }
              onChange={ ( e ) =>
              {
                const value = parseInt( e.target.value );
                setCategorySelected( value );

                if ( value === 0 )
                {
                  const { [ 'categories' ]: _, ...withoutCategories } = recipeFilter; // get filter except for categories
                  setRecipeFilter( withoutCategories );
                } else setRecipeFilter( { ...recipeFilter, ...makeRelatedFilterMany( 'categories', [ value ] ) } );
              } }
            >
              <option value={ "none" } disabled>
                Filter by recipe categories
              </option>
              <option className="text-base" value={ 0 }>All</option>
              { allRecipeCategories.map( category => (
                <option className="text-base" value={ category.id } key={ category.id }>{ category.name }</option>
              ) ) }
            </select>
          </div>

          {/* Range Slider Filter */}
          <div className="flex flex-col justify-start space-y-3 sm:space-y-10 m-6 sm:m-8">
            <div className="flex space-x-5 md:w-2/3 xl:w-1/3">
              <h2 className="text-lg font-bold dark:text-accent pt-3.5 sm:p-0">Calories</h2>
              <SliderFilter
                item={ calories }
                maxValue={ maxCalories }
                handleChangeCommitted={ handleChangeCalories }
                handleChange={ ( e ) => setCalories( e.target.value ) }
              />
            </div>
            <div className="flex space-x-5 md:w-2/3 xl:w-1/3">
              <h2 className="text-lg font-bold dark:text-accent pt-3.5 sm:p-0">Duration</h2>
              <SliderFilter
                item={ duration }
                maxValue={ maxDuration }
                handleChangeCommitted={ handleChangeDuration }
                handleChange={ ( e ) => setDuration( e.target.value ) }
              />
            </div>
          </div>

          <AllRecipes currentPage={ 1 } filter={ recipeFilter } bookmarkList={ bookmarkList } />
        </main>

        <ScrollTop />
        <Footer />
      </div>
    </>
  );
}

// Cookbooks.getInitialProps = async (ctx) => {
export async function getServerSideProps ()
{
  const queryContaineRecipeSelect = {
    where: {
      recipes: {
        some: {
          id: { not: 0 }
        }
      }
    },
    select: {
      id: true,
      name: true
    }
  }
  const allCuisines = await prisma.cuisine.findMany({ 
    ...queryContaineRecipeSelect, 
    orderBy: { recipeCount: 'desc' }
  });
  const allRecipeCategories = await prisma.recipeCategory.findMany( queryContaineRecipeSelect );

  return {
    props: {
      allRecipeCategories: JSON.parse( JSON.stringify( allRecipeCategories ) ),
      allCuisines: JSON.parse( JSON.stringify( allCuisines ) ),
    },
  };
}

export default Cookbooks;
