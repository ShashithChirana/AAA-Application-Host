import Signup from "./signup/Signup";
import Login from "./login/Login";
import Home from "./Home/Home"; // Import Home component
import Admin from "./Admin/Admin"; // Import Admin component
import User from "./User/User"; // Import User component
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const route = createBrowserRouter([
    {
      path: "/", // Default route for Home page
      element: <Home />,
    },
    {
      path: "/signup", // Route for Signup page
      element: <Signup />,
    },
    {
      path: "/login", // Route for Login page
      element: <Login />,
    },
    {
      path: "/admin", // Route for Admin page
      element: <Admin />,
    },
    {
      path: "/user", // Route for User page
      element: <User />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
