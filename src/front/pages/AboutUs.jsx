export const AboutUs = () => {
    return (
        <div className="container-fluid p-0" style={{ background: "#5C73F2" }}>

            {/* ================= HERO SECTION ================= */}
            <div className="container py-5 text-white text-center">
                <h1 className="display-4 fw-bold mb-3">About Trastenado</h1>

                <div className="mx-auto" style={{ maxWidth: "850px" }}>
                    <p className="lead">
                        Trastenado was born as our final project at 4Geeks Academy, but it quickly became much more than just an academic assignment.
                    </p>

                    <p>
                        This is our first project as developers — a product built with passion, dedication, and countless hours of learning, problem-solving, and teamwork.
                        We are a team of three aspiring developers who are eager to grow in the tech industry. Every line of code in this project represents progress, resilience,
                        and the ambition to turn ideas into real solutions.
                    </p>

                    <p>
                        Trastenado is not perfect — and that’s exactly why we’re proud of it. It represents our journey, our mistakes, our improvements,
                        and our evolution as professionals. We truly hope you enjoy exploring it, and who knows — maybe one day it will grow into something real and impactful.
                    </p>
                </div>
            </div>


            {/* ================= TEAM SECTION ================= */}
            <div className="container py-5">
                <h2 className="text-center text-white fw-bold mb-5">Meet the Team</h2>

                <div className="row g-4">

                    {/* ===== Member 1 ===== */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4">
                            <img
                                src="/your-image-1.jpg"
                                alt="Team Member"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">Your Name</h4>
                            <p className="text-muted mb-2">Frontend Developer</p>
                            <p>
                                Focused on building the user interface and creating a smooth, responsive experience.
                                Responsible for layout structure, component logic, and UI consistency.
                            </p>

                            <div className="mt-3">
                                <a href="#" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                                <a href="#" className="text-dark fs-5">
                                    <i className="fa-brands fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ===== Member 2 ===== */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4">
                            <img
                                src="/your-image-2.jpg"
                                alt="Team Member"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">Teammate Name</h4>
                            <p className="text-muted mb-2">Backend Developer</p>
                            <p>
                                Worked on database structure, authentication logic, and API integration.
                                Ensured data flow efficiency and secure user management.
                            </p>

                            <div className="mt-3">
                                <a href="#" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                                <a href="#" className="text-dark fs-5">
                                    <i className="fa-brands fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ===== Member 3 ===== */}
                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4">
                            <img
                                src="/your-image-3.jpg"
                                alt="Team Member"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">Teammate Name</h4>
                            <p className="text-muted mb-2">Full Stack Developer</p>
                            <p>
                                Contributed across both frontend and backend areas, helping integrate features,
                                optimize performance, and maintain overall project structure.
                            </p>

                            <div className="mt-3">
                                <a href="#" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                                <a href="#" className="text-dark fs-5">
                                    <i className="fa-brands fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {/* ================= WHAT WE LEARNED SECTION ================= */}
            <div className="container py-5 text-white text-center">
                <h2 className="fw-bold mb-4">What We Learned Building This</h2>

                <div className="row g-4 mt-3">

                    <div className="col-md-4">
                        <i className="fa-solid fa-lightbulb fs-1 mb-3"></i>
                        <h5 className="fw-bold">Problem Solving</h5>
                        <p>Turning challenges into opportunities through creative thinking and persistence.</p>
                    </div>

                    <div className="col-md-4">
                        <i className="fa-solid fa-people-group fs-1 mb-3"></i>
                        <h5 className="fw-bold">Team Collaboration</h5>
                        <p>Learning how to communicate, plan, and build together as a real development team.</p>
                    </div>

                    <div className="col-md-4">
                        <i className="fa-solid fa-code fs-1 mb-3"></i>
                        <h5 className="fw-bold">Real-World Development</h5>
                        <p>Designing, coding, debugging, and deploying a complete full-stack application.</p>
                    </div>

                </div>
            </div>


            {/* ================= SLOGAN SECTION ================= */}
            <div className="container py-5 text-center">
                <h2 className="fw-bold text-white display-6">
                    Smart storage for modern living.
                </h2>
            </div>

        </div>
    );
};
