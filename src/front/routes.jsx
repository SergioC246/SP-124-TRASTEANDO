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
//import { ClientList } from "./pages/ClientList";
//import { ClientCreate } from "./pages/ClientCreate";
//import { ClientDetails } from "./pages/ClientDetails";
//import { ClientEdit } from "./pages/ClientEdit";
import { StorageList } from "./pages/StorageList";
import { StorageCreate } from "./pages/StorageCreate";
import { StorageDetails } from "./pages/StorageDetails";
import { StorageEdit } from "./pages/StorageEdit";




export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      {/* Rutas adminUser */}
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-create" element={<AdminUserCreate />} />
      <Route path="/admin-edit" element={<AdminUserEdit />} />
      <Route path="/admin-details/:id" element={<AdminUserDetails />} />

      {/* Rutas client 
      <Route path="/clients" element={<Clients />} />*/}

      {/* Rutas company */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanieDetails />} />

      {/* Rutas storage */}
      <Route path="/storages" element={<StorageList />} />
      <Route path="/storages/create" element={<StorageCreate />} />
      <Route path="/storages/:id/edit" element={<StorageEdit />} />
      <Route path="/storages/:id" element={<StorageDetails />} />

    </Route>
  )
)