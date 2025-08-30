import Dislocator from "dislocator";
import NetworkInterface from "./NetworkInterface";
import Api from "./Api";
import configureStore from "../store";

export default class ServiceLocator extends Dislocator {
  constructor() {
    super();

    this.register("networkInterface", () => {
      return new NetworkInterface();
    });

    this.register("api", ({ networkInterface }) => {
      return new Api({ networkInterface });
    });

    this.register("store", serviceLocator => configureStore(serviceLocator));
  }
}
