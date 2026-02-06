import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {

	const navigate = useNavigate()

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<span className="navbar-brand mb-0 h1">Trasteando</span>
				</Link>
				<div className="collapse navbar-collapse show">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">

						<li className="nav-item">
							<Link to="/demo">
								<button className="btn btn-primary">No esperes más y alquila tu trastero ;-)</button>
							</Link>
						</li>

						<li className="nav-item ms-2">
							<Link to="/clients" className="btn btn-outline-secondary" >
								Clients
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/storages" className="btn btn-outline-success" >
								Storages
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/admin-users" className="btn btn-outline-secondary" >
								Admins
							</Link>
						</li><li className="nav-item ms-2">
							<Link to="/admin/login" className="btn btn-outline-secondary" >
								Admin Login
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/companies" className="btn btn-outline-secondary">
								Companies
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/companies/login" className="btn btn-outline-secondary">
								Company Login
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/companies/private" className="btn btn-outline-secondary">
								Company Private
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/location" className="btn btn-outline-secondary">
								Locations
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/leases">
								<button className="btn btn-primary">Leases</button>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

