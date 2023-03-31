import React from "react";
import { Route, BrowserRouter as Router, Link, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Example } from "./Example";
import menuLogo from "../assets/bar-menu.svg";
import "./App.scss";

export class App extends React.Component<any, { showMenu: boolean; }> {
    public constructor(props: any) {
        super(props);
        this.state = { showMenu: false };
    }

    public componentDidMount(): void {
        
    }
    
    public render(): JSX.Element {       
        return (
            
            <Router>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <div className="container">
                        <Link className="navbar-brand" to="/">MEDFAR</Link>
                        <button className="navbar-toggler" style={{ color: "white" }} onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
                            <img src={menuLogo} alt="Medfar Logo" />
                        </button>
                        <div className={`navbar-collapse ${this.state.showMenu ? "collapse" : ""}`}>
                            <ul className="nav navbar-nav">
                                <li className="nav-item"><Link to="/example" className="nav-link">Example</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="container">
                    <Routes>
                        <Route path={"/"} element={<Home />} />
                        <Route path={"/example"} element={<Example />} />
                        {/* <Route path={"/exam"} element={<Exam />} /> */}
                        {/* Exam tab is removed, it is replaced by a User 
                        From Dialog which can be opened by "new button" 
                        which is on the right top corner in example page */}
                    </Routes>
                </main>
                <footer style={{ position: "fixed", bottom: 0, backgroundColor: "#eee", width: "100%", padding: "10px" }}>
                    <div className="container text-center">
                        <p>&copy; 2022 -  Medfar Solutions Cliniques</p>
                    </div>
                </footer>
            </Router>
        )
    }
}
