import React from 'react'
import { Outlet, Link } from "react-router-dom";


const Navbar =()=>{
	const email = localStorage.getItem('email')
	const clearCatche = ()=>{
		localStorage.clear()
	}
	return(
		<div>
			<nav className="navbar navbar-expand-md fixed-top" style={{ backgroundColor: '#1974D2' }}>
		      <span className="navbar-brand text-white mx-3">LiveEdit</span>
		      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#non">
		        collapse
		      </button>
		      <div className="collapse navbar-collapse" id='non'>
		        <ul className="navbar-nav ms-auto d-flex flex-row">
		          <li className="nav-item">
		            <a className="nav-link text-white" href="/annotates">{email}</a>
		          </li>
		          <li className="nav-item dropdown">
		            <Link to="/">
		                <button className="btn btn-success" style={{border: '1px solid white'}} onClick={clearCatche}>Logout</button>
		            </Link>

		          </li>
		        </ul>
		      </div>
		    </nav>
		</div>
		)
}
export default Navbar