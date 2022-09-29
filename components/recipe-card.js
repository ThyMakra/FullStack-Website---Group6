import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import useAuth from "../lib/hook/AuthProvider";

function RecipesCard({ bookmarkStore, recipe, bookmarked, bookmarkList }) {
  const router = useRouter();
  const { bookmarks, addBookmark, removeBookmark } = bookmarkStore;
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const item = recipe;

  const { user, mergeDocument } = useAuth();

  useEffect(() => {
    if (bookmarked != isBookmarked) {
      setIsBookmarked(bookmarked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarked]);

  const checkForLoggedIn = () => {
    if (!user) router.push("/login");
  }

  const getUnique = (list) => Array.from(new Set(list))

  async  function toggleBookmark(e) {
    checkForLoggedIn();
    // wait for firestore to finish querying doc
    if (bookmarkList === null) return;
    setIsBookmarked(!isBookmarked);

    const isSelected = e.target.checked;
    if (isSelected) {
      await mergeDocument(getUnique([...bookmarks, item.id]));
      addBookmark(item.id);
    } else {
      await mergeDocument(getUnique(bookmarks.filter(recipe => recipe != item.id)));
      removeBookmark(item.id);
    }
  }

  return (
    <div className="card w-fit h-fit card-side shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] hover:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-accent/50 dark:bg-accent/5 m-5">
      <figure
        className="cursor-pointer"
        onClick={() => router.push({
          pathname: "/recipe-details",
          query: {id: item.id}
        })}
      >
        <img
          src={recipe.imageLink}
          className="w-36 sm:w-40 lg:w-52 h-52"
          alt={recipe.name}
        />
      </figure>

      <div className="card-body w-44 sm:w-48 lg:w-52 p-5">
        {/* Bookmark Button */}
        <div className="card-actions justify-end">
          <label className="swap">
            {/* This hidden checkbox controls the state */}
            <input
              type="checkbox"
              style={{ opacity: 0 }}
              checked={isBookmarked}
              onChange={toggleBookmark}
            />

            {/* Bookmark Add */}
            <svg
              className="color: rgb(255, 200, 0); swap-off fill-current w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                fill="#ffc800"
              />
              <path
                d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"
                fill="#ffc800"
              />
            </svg>

            {/* Bookmark Check */}
            <svg
              className="color: rgb(255, 200, 0); swap-on fill-current w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"
                fill="#ffc800"
              />
            </svg>
          </label>
        </div>

        <div
          className="card w-full h-full cursor-pointer"
          onClick={() => router.push({
            pathname: "/recipe-details",
            query: {id: item.id}
          })}
        >
          <h2 className="sm:text-lg lg:text-xl dark:text-accent font-bold mx-1 sm:mx-px line-clamp-1">
            {recipe.name}
          </h2>
          <div className="divider before:bg-primary after:bg-primary my-2"></div>

          <div className="flex flex-row my-1">
            <svg
              className="color: red mx-2 w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"
                fill="red"
              />
            </svg>
            <p className="my-1 dark:text-accent">
              { recipe.calories } Cal
            </p>
          </div>

          <div className="flex flex-row my-1">
            <svg
              className="bi bi-clock color: rgb(87, 13, 248); mx-3 w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                fill="#570df8"
              />
              <path
                d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
                fill="#570df8"
              />
            </svg>
            <p className="-my-0.5 dark:text-accent">
              {recipe.durationSecond / 60} Minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

RecipesCard.propTypes = {
  recipe: PropTypes.object,
};


export default inject("bookmarkStore")(observer(RecipesCard));
