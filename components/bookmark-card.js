import { useRouter } from "next/router";
import { inject, observer } from "mobx-react";
import { motion } from "framer-motion";
import useAuth from "../lib/hook/AuthProvider";
import { useEffect } from "react";

function BookmarkCard({ bookmarkStore, bookmarked }) {
  const router = useRouter();
  const { mergeDocument } = useAuth();
  const { bookmarks, removeBookmark } = bookmarkStore;

  const getUnique = (list) => Array.from(new Set(list))

  async function unBookmarked() {
    await mergeDocument(getUnique(bookmarks.filter(recipe => recipe != bookmarked.id)));
    removeBookmark(bookmarked.id);
  }

  useEffect(() => {}, [bookmarked])

  return (
    <motion.div
      className="card w-fit h-fit image-full m-5 shadow dark:shadow-accent"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, borderRadius: "10%" }}
    >
      <figure>
        <img
          src={bookmarked.imageLink}
          // width={250}
          // height={200}
          style={{ height: 200, width: 250, objectFit: "cover" }}
          alt={bookmarked.name}
        />
      </figure>

      <div className="card-body p-5" style={{ maxWidth: 250 }}>
        <div
          className="card w-full h-full cursor-pointer"
          onClick={() => router.push({
            pathname: "/recipe-details",
            query: {id: bookmarked.id}
          })}
        >
          <div className="card-title text-accent hover:text-primary mx-px">
            {bookmarked.name}
          </div>
        </div>

        <div className="card-actions justify-end">
          <button
            className="btn btn-circle btn-outline text-accent"
            onClick={unBookmarked}
          >
            <svg
              className="bi bi-bookmark-x color: rgb(255, 210, 51); h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708z"
                fill="#ffd233"
              />
              <path
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                fill="#ffd233"
              />
            </svg>
            {/* <svg className="bi bi-bookmark-x-fill color: rgb(255, 210, 51); h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6.854 5.146a.5.5 0 1 0-.708.708L7.293 7 6.146 8.146a.5.5 0 1 0 .708.708L8 7.707l1.146 1.147a.5.5 0 1 0 .708-.708L8.707 7l1.147-1.146a.5.5 0 0 0-.708-.708L8 6.293 6.854 5.146z" fill="#ffd233" />
            </svg> */}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default inject("bookmarkStore")(observer(BookmarkCard));
