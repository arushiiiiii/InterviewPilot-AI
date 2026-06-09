import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import { useNavigate } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><h1>Home Page</h1></Protected> // like this we can make any route inaccessible if there is no user. We just have to wrap that route with Protected component and it will check if there is a user or not. If there is a user then it will render the children otherwise it will redirect to login page.
    }
])