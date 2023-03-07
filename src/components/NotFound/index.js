import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found">
    <div className="not-found-container">
      <img
        className="page-not-found-img"
        src="https://res.cloudinary.com/dddkunsox/image/upload/v1677910936/instaClone/not_found_syjqee.png"
        alt="page not found"
      />
      <h1 className="page-notfound-heading">Page Not Found</h1>
      <p className="page-notfound-para">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <Link to="/">
        <button type="button">Home Page</button>
      </Link>
    </div>
  </div>
)

export default NotFound
