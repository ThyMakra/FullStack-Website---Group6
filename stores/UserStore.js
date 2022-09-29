import { observable, action, computed, makeObservable } from "mobx";

class UserStore {
  @observable user;

  constructor() {
    makeObservable(this);
  }

  @action setUser = (user) => {
    this.user = user;
  };

  @action clearUser = () => {
    this.user = null;
  };
}

export default new UserStore();
