import {createContext, type ReactNode} from 'react';
import {BackTestStore} from "./back-test-store.ts";
import {BackTestService} from "../service/back-test-service.ts";

export class RootStore {

  backTestStore: BackTestStore;
  constructor() {
    this.backTestStore = new BackTestStore(new BackTestService());
  }
}

const ROOT_STORE = new RootStore();
// eslint-disable-next-line react-refresh/only-export-components
export const RootStoreContext = createContext(ROOT_STORE);

export const RootStoreProvider = ({children}: {children: ReactNode}) => {
  return (
    <RootStoreContext.Provider value={ROOT_STORE}>{children}</RootStoreContext.Provider>
  );
};