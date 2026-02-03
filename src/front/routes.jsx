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
import { Leases } from "./pages/Leases";
import { LeasesCreate } from "./pages/LeasesCreate";
import { LeasesEdit } from "./pages/LeasesEdit";
import { LeasesDetails } from "./pages/LeasesDetails";




export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-create" element={<AdminUserCreate />} />
      <Route path="/admin-edit" element={<AdminUserEdit />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanieDetails />} />
      <Route path="/leases" element={<Leases/>} />
      <Route path="/leasesCreate" element={<LeasesCreate/>} />
      <Route path="/leasesEdit/:id" element={<LeasesEdit/>} />
      <Route path="/leasesDetails/:id" element={<LeasesDetails/>} />      
    </Route>
  )
)