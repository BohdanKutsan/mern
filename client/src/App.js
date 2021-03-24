import React from 'react'
import {BrowserRouter as Route}  from 'react-router-dom'
import {useRoutes} from "./pages/routes";
import {useAuth} from "./hooks/auth.hook";
import 'materialize-css'
import {AuthContext} from "./context/AuthContext";
import {Nawbar} from "./components/Navbar";
import {Loader} from "./components/Loader";


function App() {
    const {token, logout, login, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader />
    }

return (
    <AuthContext.Provider value={{
        token, login, logout, userId, isAuthenticated
    }}>
        <Route>
            {isAuthenticated && <Nawbar />}
            <div className="container">
                {routes}
            </div>
        </Route>
    </AuthContext.Provider>
)
}

export default App
