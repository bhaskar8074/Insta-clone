import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <div className="input-box">
        <input
          id="username"
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          required
        />
        <label htmlFor="username">UserName</label>
        <i />
      </div>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <div className="input-box">
        <input
          id="password"
          type="password"
          value={password}
          onChange={this.onChangePassword}
          required
        />
        <label htmlFor="password">Password</label>
        <i />
      </div>
    )
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    })
  }

  clickOnSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    // console.log(userDetails)
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      // console.log(data)
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    const {errorMsg, showErrorMsg} = this.state
    // console.log(errorMsg)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dddkunsox/image/upload/v1677244621/instaClone/login_ig3izp.png"
          alt="website login"
          className="instagram-desktop-login-img"
        />

        <div className="box">
          <form onSubmit={this.clickOnSubmit}>
            <img
              src="https://res.cloudinary.com/dddkunsox/image/upload/v1677307380/instaClone/insta_clone_logo_mo3kap.png"
              alt="website logo"
              className="instagram-clone-logo"
            />
            <h1>Insta Share</h1>
            <div className="input-field-container">
              {this.renderUsernameField()}
            </div>
            <div className="input-field-container">
              {this.renderPasswordField()}
            </div>
            <button type="submit">Login</button>
            {showErrorMsg ? <p className="error-message">*{errorMsg}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
