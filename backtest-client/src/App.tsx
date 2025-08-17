import './App.css'
import {observer} from 'mobx-react-lite';
import {RootStoreProvider} from "./store/RootStore.tsx";
import {MainPage} from "./components/MainPage.tsx";

function App() {
  return (
      <Application />
  )
}


const Application = observer(() => {

  return (
      <RootStoreProvider>
          <CurrentPage/>
      </RootStoreProvider>

  )

});

const CurrentPage = observer(() => {
    return <MainPage />
});

export default App
