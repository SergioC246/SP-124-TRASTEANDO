import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="collapse navbar-collapse show">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">

						<li className="nav-item">
							<Link to="/demo">
								<button className="btn btn-primary">Check the Context in action</button>
							</Link>
						</li>

						<li className="nav-item ms-2">
							<Link to="/clients" className="btn btn-outline-secondary" >
								Clients
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/admin-users" className="btn btn-outline-secondary" >
								AdminUser
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link to="/companies">
								<button className="btn btn-primary">Companies</button>
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

