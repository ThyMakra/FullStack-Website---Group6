import { observable, action, computed, makeObservable } from "mobx";

class BookmarkStore {
  @observable bookmarks = [];

  constructor() {
    makeObservable(this);
  }

  @action
  addBookmark = (bookmark) => {
    this.bookmarks.push(bookmark);
  };

  @action
  setBookmark = (bookmarkList) => {
    this.bookmarks = bookmarkList;
  };

  @action
  removeBookmark = (bookmark) => {
    this.bookmarks = this.bookmarks.filter(b => b !== bookmark);
  };

  @action clearBookmarks = () => {
    this.bookmarks = [];
  };

  @computed
  get bookmarkCount() {
    return this.bookmarks.length;
  }
}

export default new BookmarkStore();
