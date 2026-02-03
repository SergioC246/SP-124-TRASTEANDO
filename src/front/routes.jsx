// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { AdminUsers } from "./pages/AdminUsers"
import { AdminUserCreate } from "./pages/AdminUserCreate";
import { AdminUserEdit } from "./pages/AdminUserEdit";
import { Companies } from "./pages/Companies";
import { CreateCompanies } from "./pages/CreateCompanies";
import { CompanieDetails } from "./pages/CompanieDetails";
import { AdminUserDetails } from "./pages/AdminUserDetails";
import { ClientList } from "./pages/ClientList";
import { ClientCreate } from "./pages/ClientCreate";
import { ClientDetails } from "./pages/ClientDetails";
import { ClientEdit } from "./pages/ClientEdit";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      {/* Rutas adminUser */}
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-create" element={<AdminUserCreate />} />
      <Route path="/admin-edit" element={<AdminUserEdit />} />
      <Route path="/admin-details/:id" element={<AdminUserDetails />} />

      {/* Rutas client */}

      {/* Rutas company */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanieDetails />} />
      <Route path="/clients" element={<ClientList />} />
      <Route path="/clients/new" element={<ClientCreate />} />
      <Route path="/clients/:id" element={<ClientDetails />} />
      <Route path="/clients/:id/edit" element={<ClientEdit />} />
  
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    {/*<Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >*/}

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      {/*<Route path="/" element={<Home />} />*/}

    </Route>
  )
);
