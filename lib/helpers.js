import { DEFAULT_PAGE_LIMIT } from "./constant";

export const getPaginationResult = (
    totalCount,
    perPage,
    resultLength,
    currentPage = 1,
) => {
  return {
    total: totalCount,
    totalPage: Math.ceil(totalCount / perPage),
    currentPage: currentPage,
    perPage: perPage,
    from: (currentPage - 1) * perPage + 1,
    to: (currentPage - 1) * perPage + resultLength
  }
}


export const makeRelatedFilterMany = (keyRelated, relatedIds) => (
  {
    [keyRelated]: {
      some: {
        id: {
          in: relatedIds
        }
      }
    }
  }
);


export const makeFieldFilter = (field, value, operation) => (
  {
    [field]: {
      [operation]: value
    }
  }
);


export const fetchRecipe = async (fromPage, filter, sort = {name: 'asc'}, limit=DEFAULT_PAGE_LIMIT) => {
  const res = await fetch('/api/recipe', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page: fromPage,
      limit: limit,
      filter: filter,
      sort: sort,
      relation: {
        ingredients: {
          select: {
            name: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        cuisines: {
          select: {
            name: true,
          },
        },
      }
    })
  }).then(res => res.json());
  
  return res;
}


export const fetchIngredient = async (perPage, fromPage, filter, sort = [{recipeCount: 'desc'}, {name: 'asc'}]) => {
  const res = await fetch('/api/ingredient', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: perPage,
      page: fromPage,
      filter: filter,
      sort: sort,
      relation: {
        categories: {
          select: {
            name: true,
          },
        },
      }
    })
  }).then(res => res.json());
  
  return res;
}
