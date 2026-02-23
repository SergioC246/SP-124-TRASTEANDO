import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logo-trasteando.jpg"

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
		<div className="container px-2">
			<nav className="navbar navbar-expand-lg bg-white py-2 mt-3">

				<Link className="navbar-brand d-flex align-items-center me-4 ms-2" to="/">
					<img src={logo} alt="Trasteando"
						height="60"
						className="me-2" />
					<span className="fw-bold fs-5" style={{ color: "#5C73F2" }}>
						Trasteando
					</span>
				</Link>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarContent">

					<ul className="navbar-nav me-auto gap-2">
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle text-dark fw-semibold"
								role="button"
								data-bs-toggle="dropdown">
								Login
							</a>

							<ul className="dropdown-menu shadow border-0 rounded-3">
								<li>
									<Link className="dropdown-item d-flex align-items-center gap-2" to="/client/login">
										<i className="fa-regular fa-user" style={{ color: "#5C73F2" }}></i>
										Client
									</Link>
								</li>
								<li>
									<Link className="dropdown-item d-flex align-items-center gap-2" to="/companies/login">
										<i className="fa-regular fa-building" style={{ color: "#5C73F2" }}></i>
										Company
									</Link>
								</li>

							</ul>
						</li>

						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle text-dark fw-semibold"
								role="button"
								data-bs-toggle="dropdown"
							>
								Services
							</a>

							<ul className="dropdown-menu shadow border-0 rounded-3">
								<li>
									<Link className="dropdown-item d-flex align-items-center gap-2" to="/client/private/locations">
										<i className="fa-regular fa-map" style={{ color: "#5C73F2" }}></i>
										Locations
									</Link>
								</li>
								<li>
									<Link className="dropdown-item d-flex align-items-center gap-2" to="/client/private/storages/:locationId">
										<i className="fas fa-box-open" style={{ color: "#5C73F2" }}></i>
										Storages
									</Link>
								</li>
							</ul>
						</li>
					</ul>

					<div className="d-flex align-items-center gap-2 me-2">
						<Link to="/chat" className="btn btn-primary rounded-pill fw-semibold border">
							<i className="fas fa-comments me-1"></i>
							Chat
						</Link>

						<div className="dropdown">
							<button
								className="btn btn-link fw-semibold text-dark dropdown-toggle"
								data-bs-toggle="dropdown"
							> Contact us
							</button>
							<ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded">
								<li className="dropdown-item">
									<i className="fa-solid fa-phone" style={{ color: "#5C73F2" }}></i> +34 600 000 000
								</li>
							</ul>
						</div>
						<Link
							to="#"
							className="btn rounded-pill px-4 fw-semibold anfitrion-btn">
							Hazte Anfitrión
						</Link>
					</div>



					{/* ==== Solo Admin ====

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
									<Link to="/locations-public" className="btn btn-outline-warning" >
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

					{/*{role === "company" && (
							<>
								<li className="nav-item ms-2">
									<Link to="/companies/private" className="btn btn-outline-warning">
										Company Private
									</Link>
								</li>
							</>
						)}

						{/*{/* ==== Solo CLient ==== */}

					{/*{role === "client" && (
							<>
								<li className="nav-item ms-2">
									<Link to="/client/private/leases" className="btn btn-outline-warning">
										My leases
									</Link>
								</li>
								<li className="nav-item ms-2">
									<Link to="/search" className="btn btn-outline-warning">
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
						)} */}

					{/* ==== Logout si hay alguien logueado ==== */}
					{role && (
						<li className="nav-item ms-2">
							<button className="btn btn-danger"
								onClick={handleLogout}>Logout</button>
						</li>
					)}
				</div>
			</nav>
		</div>
	);
};

