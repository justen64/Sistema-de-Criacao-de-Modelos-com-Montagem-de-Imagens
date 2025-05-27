import { Navbar } from "./components/NavBar";
import { LoginProvider } from "./context/LoginContext";
import { Rotas } from "./routes/routes";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <LoginProvider>
        <BrowserRouter>
          <ToastContainer theme="colored" />
          <Rotas />
        </BrowserRouter>
      </LoginProvider>
    </>
  );
}

export default App;
