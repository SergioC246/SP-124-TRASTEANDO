import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logo-trasteando.png";

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
		<header className="navbar-light header-sticky">
			<nav className="navbar navbar-expand-xl navbar-light">
				<div className="container px-2">

					<a className="navbar-brand" href="/">
						<img src={logo} alt="logo"
							height="70"
							className="light-mode-item navbar-brand-item" />
						<span className="fw-bold fs-5" style={{ color: "#5C73F2" }}>
							Trasteando
						</span>
					</a>

					{!role && (
						<>
							<div className="nav-brand d-flex align-items-start gap-4">
								<div className="nav-item dropdown">
									<a className="nav-link dropdown-toggle center-link fw-bold"
										role="button"
										data-bs-toggle="dropdown">
										<i className="fa-regular fa-circle-user me-2 nav-icon"></i>
										Login
									</a>

									<ul className="dropdown-menu shadow border-0 rounded-3">
										<li>
											<Link className="dropdown-item d-flex gap-2 align-items-center" to="/client/login">
												<i className="fa-regular fa-user nav-icon" style={{ color: "#5C73F2" }}></i>
												Client
											</Link>
										</li>
										<li>
											<Link className="dropdown-item d-flex  gap-2 align-items-center" to="/companies/login">
												<i className="fa-regular fa-building nav-icon" style={{ color: "#5C73F2" }}></i>
												Company
											</Link>
										</li>
									</ul>
								</div>

								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle center-link fw-bold"
										role="button"
										data-bs-toggle="dropdown"
									>
										<i className="fa-solid fa-house me-2 nav-icon"></i>
										Services
									</a>

									<ul className="dropdown-menu shadow border-0 rounded-3">
										<li>
											<Link className="dropdown-item d-flex gap-2 align-items-center" to="/client/private/locations">
												<i className="fa-regular fa-map nav-icon" style={{ color: "#5C73F2" }}></i>
												Locations
											</Link>
										</li>
										<li>
											<Link className="dropdown-item d-flex gap-2 align-items-center" to="/client/private/storages/:locationId">
												<i className="fas fa-box-open nav-icon" style={{ color: "#5C73F2" }}></i>
												Storages
											</Link>
										</li>
									</ul>
								</li>
							</div>

							<div className="d-flex align-items-center gap-2">
								<Link
									to="/chat"
									className="btn rounded-pill px-3 fw-semibold anfitrion-btn">
									Become a host
								</Link>

								<div className="dropdown">
									<button
										className="btn menu-btn"
										data-bs-toggle="dropdown">
										<i className="fa-solid fa-circle-question nav-icon" style={{ color: "#5C73F2" }}></i>
									</button>
									<ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2">
										<li className="dropdown-item">
											<i className="fa-solid fa-phone nav-icon" style={{ color: "#5C73F2" }}></i> +34 600 000 000
										</li>
										<Link to="/chat" className="dropdown-item d-flex justify-content-center align-items-center">
											<i className="fas fa-comments me-2 nav-icon" style={{ color: "#5C73F2" }}></i>
											Chat
										</Link>
									</ul>
								</div>
							</div>
						</>
					)}



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

					{role === "company" && (
						<>
							<li className="nav-item ms-2">
								<Link to="/companies/private" className="btn btn-outline-warning">
									Company Private
								</Link>
							</li>
						</>
					)}

					{/*{/* ==== Solo CLient ==== */}

					{role === "client" && (
						<>
							<div className="center-nav d-flex align-items-center gap-1">
								<li className="nav-item ms-2">
									<Link to="/client/private/leases" className="btn btn-outline-warning">
										<i className="fa-solid fa-file-contract"></i>My leases
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
							</div>
						</>
					)}

					{/* ==== Logout si hay alguien logueado ==== */}
					{role && (
						<li className="nav-item ms-2">
							<button className="btn btn-danger"
								onClick={handleLogout}>Logout</button>
						</li>
					)}
				</div>
			</nav>
		</header>
	);
};