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
import { CompanyDetails } from "./pages/CompanyDetails";
import { Leases } from "./pages/Leases";
import { LeasesCreate } from "./pages/LeasesCreate";
import { LeasesEdit } from "./pages/LeasesEdit";
import { LeasesDetails } from "./pages/LeasesDetails";
import { AdminUserDetails } from "./pages/AdminUserDetails";
import { Location } from "./pages/Location";
import { LocationCreate } from "./pages/LocationCreate";
import { LocationDetails } from "./pages/LocationDetails";
import { LocationEdit } from "./pages/LocationsEdit";
import { ClientList } from "./pages/ClientList";
import { ClientCreate } from "./pages/ClientCreate";
import { ClientDetails } from "./pages/ClientDetails";
import { ClientEdit } from "./pages/ClientEdit";
import { StorageList } from "./pages/StorageList";
import { StorageCreate } from "./pages/StorageCreate";
import { StorageDetails } from "./pages/StorageDetails";
import { StorageEdit } from "./pages/StorageEdit";
import { ClientLogin } from "./pages/ClientLogin";
import { ClientPrivate } from "./pages/ClientPrivate";
import { Clients } from "./pages/Clients";

import { CompanyLogin } from "./pages/CompanyLogin";
import { CompanyPrivate } from "./pages/CompanyPrivate";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminPrivate } from "./pages/AdminPrivate";
import { ClientSignup } from "./pages/ClientSignup";
import { ClientLocations } from "./pages/ClientLocations";
import { StoragesPrivateDetails } from "./pages/StoragesPrivateDetails";
import { StoragesPrivateList } from "./pages/StoragesPrivateList";
import { StoragePrivateCheckout } from "./pages/StoragePrivateCheckout";
import { CompanyLocations } from "./pages/CompanyLocations";
import { CompanyStorages } from "./pages/CompanyStorages";
import { CompanyStoragesDetails } from "./pages/CompanyStoragesDetails";
import { CompanyLocationsCreate } from "./pages/CompanyLocationsCreate";




export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      {/* Rutas adminUser */}
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-create" element={<AdminUserCreate />} />
      <Route path="/admin-edit" element={<AdminUserEdit />} />
      <Route path="/admin-details/:id" element={<AdminUserDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/private" element={<AdminPrivate />} />

      {/* Rutas client */}
      <Route path="/clients" element={<ClientList />} />
      <Route path="/clients/new" element={<ClientCreate />} />
      <Route path="/clients/:id" element={<ClientDetails />} />
      <Route path="/clients/:id/edit" element={<ClientEdit />} />
      <Route path="/clients" element={<Clients />} />     
      <Route path="/client/login" element={<ClientLogin />} />
      <Route path="/client/private" element={<ClientPrivate />} />
      <Route path="/client/signup" element={<ClientSignup />} />
      <Route path="/client/private/locations" element={<ClientLocations />} />
      <Route path="/client/private/storages/:locationId" element={<StoragesPrivateList />} />
      <Route path="/client/private/storage/:storageId" element={<StoragesPrivateDetails />} />
      <Route path="/client/private/checkout/:storageId" element={<StoragePrivateCheckout />} />
      
            
      {/* Rutas company */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="/companies/login" element={<CompanyLogin />} />
      <Route path="/companies/private" element={<CompanyPrivate />} />
      <Route path="/companies/private/locations" element={<CompanyLocations />} />
      <Route path="/companies/private/locations/create" element={<CompanyLocationsCreate />} />
      <Route path="/companies/private/storages" element={<CompanyStorages />} />
      <Route path="/companies/private/storages/:id" element={<CompanyStoragesDetails />} />

      {/* Rutas location */}
      <Route path="/location" element={<Location />} />
      <Route path="/location-create" element={<LocationCreate />} />
      <Route path="/location-details/:id" element={<LocationDetails />} />
      <Route path="/location-edit/:id" element={<LocationEdit />} />

      {/* Rutas leases */}
      <Route path="/leases" element={<Leases/>} />
      <Route path="/leasesCreate" element={<LeasesCreate/>} />
      <Route path="/leasesEdit/:id" element={<LeasesEdit/>} />
      <Route path="/leasesDetails/:id" element={<LeasesDetails/>} />      
      <Route path="/leases" element={<Leases />} />
      <Route path="/leasesCreate" element={<LeasesCreate />} />
      <Route path="/leasesEdit/:id" element={<LeasesEdit />} />
      <Route path="/leasesDetails/:id" element={<LeasesDetails />} />

      {/* Rutas storage */}
      <Route path="/storages" element={<StorageList />} />
      <Route path="/storages/create" element={<StorageCreate />} />
      <Route path="/storages/:id/edit" element={<StorageEdit />} />
      <Route path="/storages/:id" element={<StorageDetails />} />


    </Route>
  )
);
