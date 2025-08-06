import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "bootstrap/dist/js/bootstrap.min"
import "./assets/css/sharedStyle.css"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { Login } from "./pages/Login"
import AppContext from "./context/context.jsx"
import { Alert } from "./components/Alert.jsx"
import {BrowserRouter, } from "react-router-dom"
import { MainRoute } from "./pages/main.route.jsx"
import { Loading } from "./components/Loading.jsx"

function App() {
  // console.log("main.route")
  return (
    <>
      <AppContext>
          <Loading/>
          <BrowserRouter>
              <MainRoute />
          </BrowserRouter>
          <Alert/>
      </AppContext>
    </>
  )
}

export default App
