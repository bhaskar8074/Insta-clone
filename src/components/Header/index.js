import {Link, withRouter} from 'react-router-dom'
import {useState} from 'react'
import {FaBars, FaSearch} from 'react-icons/fa'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {
    searchInputValue,
    onChangeSearchInput,
    getPosts,
    onClickInput,
    onClickHome,
  } = props
  const onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleOnchange = event => {
    onChangeSearchInput(event.target.value)
  }

  const onClickSearchBtn = () => {
    getPosts()
    onClickInput()
  }

  const onClickSearchResults = () => {
    onClickInput()
  }

  const onClickHandleHome = () => {
    onClickHome()
  }

  return (
    <>
      <nav className="desktop-navbar">
        <div className="logo-and-name-container">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dddkunsox/image/upload/v1677307380/instaClone/insta_clone_logo_mo3kap.png"
              alt="website logo"
              className="insta-logo"
            />
          </Link>

          <h1 className="insta-share">Insta share</h1>
        </div>
        <ul className="desktop-navItems">
          <li className="search-bar-container">
            <Link to="/" className="link-item">
              <input
                type="search"
                placeholder="Search Caption"
                className="search-input"
                onChange={handleOnchange}
                value={searchInputValue}
                onClick={onClickSearchResults}
              />
            </Link>
            <button
              type="button"
              className="search-button"
              onClick={onClickSearchBtn}
            >
              <FaSearch testid="searchIcon" />
            </button>
          </li>
          <li className="nav-item" onClick={onClickHandleHome}>
            <Link to="/" className="link-item">
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/my-profile" className="link-item">
              <span>Profile</span>
            </Link>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="logout-button"
              onClick={onClickLogoutBtn}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <nav className="mobile-navbar">
        <div className="logo">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dddkunsox/image/upload/v1677307380/instaClone/insta_clone_logo_mo3kap.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </div>
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </button>
        {showMenu && (
          <div className={`menu-popup ${showMenu ? 'show' : ''}`}>
            <ul className="menu-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/my-profile">Profile</Link>
              </li>
              <li>
                <Link to="/searchResults">Search</Link>
              </li>
              <li>
                <button
                  className="mobile-logout-btn"
                  type="button"
                  onClick={onClickLogoutBtn}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}
export default withRouter(Header)
