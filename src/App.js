import {Fragment} from "react";
import '@shopify/polaris/build/esm/styles.css';
import DefaultLayout from "./Component/DefaultLayout/DefaultLayout.";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {baseUrl} from "./Utills/Constant";
import {routes} from "./Utills/Routes";
import "./style.css"


function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path={`${baseUrl}/`} element={<DefaultLayout/>}>
                        {routes.map((x, i) => {
                            return <Route key={i} path={x.path} element={<x.component />}/>
                        })
                        }
                        <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>

        </Fragment>
    );
}

export default App;
