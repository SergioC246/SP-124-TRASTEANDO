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
import { Clients } from "./pages/Clients";
import { Companies } from "./pages/Companies";
import { CreateCompanies } from "./pages/CreateCompanies";
import { CompanieDetails } from "./pages/CompanieDetails";
import { AdminUserDetails } from "./pages/AdminUserDetails";
import { Location } from "./pages/Location";
import { LocationCreate } from "./pages/LocationCreate";
import { LocationDetails } from "./pages/LocationDetails";
import { LocationEdit } from "./pages/LocationsEdit";




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
      <Route path="/clients" element={<Clients />} />

      {/* Rutas company */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanieDetails />} />

      {/* Rutas location */}
      <Route path="/location" element={<Location />} />
      <Route path="/location-create" element={<LocationCreate />} />
      <Route path="/location-details/:id" element={<LocationDetails />} />
      <Route path="/location-edit" element={<LocationEdit />} />

    </Route>
  )
)