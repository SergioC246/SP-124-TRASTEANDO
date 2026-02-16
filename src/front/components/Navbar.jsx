import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();
	const role = getUserRole(store);

	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<span className="navbar-brand mb-0 h1">Trasteando</span>
				</Link>
				<div className="collapse navbar-collapse show">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">

						{/* ==== Si no hay nadie logueado ==== */}

						{!role && (
							<>
								<li className="nav-item ms-2">
									<Link to="/client/login" className="btn btn-outline-primary">
										Login as client
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/companies/login" className="btn btn-outline-warning">
										Login as Company
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/admin/login" className="btn btn-outline-danger" >
										Login as Admin
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/storages" className="btn btn-outline-success" >
										Storages
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/locations-public" className="btn btn-outline-success" >
										Locations
									</Link>
								</li>
							</>
						)}

						{/* ==== Siempre visibles ==== */}

						{/* <li className="nav-item ms-2">
							<Link to="/location" className="btn btn-outline-success">
								Locations
							</Link>
						</li> */}
						{/* <li className="nav-item ms-2">
							<Link to="/client/login">
								<button className="btn btn-outline-secondary">Login as client</button>
							</Link>
						</li> */}
						<Link to="/chat" className="btn btn-outline-primary ms-2">
    						<i className="fas fa-comments"></i> Chat
						</Link>

						{/* ==== Solo Admin ==== */}

						{role === "admin" && (
							<>
								<li className="nav-item ms-2">
									<Link to="/clients-info" className="btn btn-outline-warning" >
										Clients
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/companies" className="btn btn-outline-warning">
										Companies
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/admin-users" className="btn btn-outline-warning" >
										Admins
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/location" className="btn btn-outline-warning" >
										Locations
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/admin/private" className="btn btn-outline-danger" >
										My Profile
									</Link>
								</li>
								
							</>
						)}

						{/* ==== Solo Company ==== */}

						{role === "company" && (
							<>
								<li className="nav-item ms-2">
									<Link to="/companies/private" className="btn btn-outline-warning">
										Company Private
									</Link>
								</li>
							</>
						)}

						{/* ==== Solo CLient ==== */}

						{role === "client" && (
							<>
								<li className="nav-item ms-2">
									<Link to="/client/private/leases" className="btn btn-outline-warning">
										My leases
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/client/private/" className="btn btn-outline-warning">
										Storages available
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/client/private/locations" className="btn btn-outline-warning">
										Locations available
									</Link>
								</li><li className="nav-item ms-2">
									<Link to="/client/private" className="btn btn-outline-warning">
										My Profile
									</Link>
								</li>
							</>
						)}

						{/* ==== Logout si hay alguien logueado ==== */}
						{role && (
							<li className="nav-item ms-2">
								<button className="btn btn-danger"
									onClick={handleLogout}>Logout</button>
							</li>

						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

