import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const Navbar = (props) => {
    return (
        <nav className="nav-wrapper amber darken-1">
            <div className="container">
                <Link to="/" className="brand-logo black-text"><i class="material-icons">pets</i>Пациенты клиники</Link>
            </div>
        </nav>
    )
}

export default withRouter(Navbar)
