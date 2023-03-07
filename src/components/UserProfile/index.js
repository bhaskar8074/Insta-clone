/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class UserProfile extends Component {
  state = {
    userProfileApiStatus: apiStatusConstants.initial,
    userProfileDetails: {},
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    this.setState({
      userProfileApiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const userProfileUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(userProfileUrl, options)
    const data = await response.json()
    // console.log(response.ok)
    if (response.ok) {
      this.setState({
        userProfileApiStatus: apiStatusConstants.success,
        userProfileDetails: data.user_details,
      })
    } else {
      this.setState({userProfileApiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dddkunsox/image/upload/v1677916608/instaClone/server_fail_c0hzrr.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getMyProfileData}>
        Try again
      </button>
    </div>
  )

  // render loader view
  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  // render my profile section success view
  renderMyProfileSuccessView = () => {
    const {userProfileDetails} = this.state
    return (
      <div className="myProfile-content">
        <div className="profileDetails-container">
          <img
            className="profile-img"
            src={userProfileDetails.profile_pic}
            alt="user profile"
          />
          <div className="details-container">
            <h1 className="my-profile-user-name">
              {userProfileDetails.user_name}
            </h1>
            <div className="stats-container">
              <div className="stat">
                <span className="stat-n">{userProfileDetails.posts_count}</span>{' '}
                posts
              </div>
              <div className="stat">
                <span className="stat-n">
                  {userProfileDetails.followers_count}
                </span>{' '}
                Followers
              </div>
              <div className="stat">
                <span className="stat-n">
                  {userProfileDetails.following_count}
                </span>{' '}
                Following
              </div>
            </div>
            <p className="user-id">{userProfileDetails.user_id}</p>
            <p>{userProfileDetails.user_bio}</p>
          </div>
        </div>
        <ul className="my-profile-stories">
          {userProfileDetails.stories.map(eachItem => (
            <li key={eachItem.id} className="story-container">
              <img
                className="story-img"
                src={eachItem.image}
                alt="user story"
              />
            </li>
          ))}
        </ul>
        <hr className="hr-line" />
        <div className="posts-heading">
          <BsGrid3X3 size={30} className="grid-icon" />
          <h1 className="post-heading">Posts</h1>
        </div>
        {userProfileDetails.posts.length === 0 ? (
          <div className="no-posts-container">
            <BiCamera size="30" />
            <h1>No Posts Yet</h1>
          </div>
        ) : (
          <div className="posts-imgs-container">
            {userProfileDetails.posts.map(eachItem => (
              <img
                key={eachItem.id}
                className="profile-post-img"
                src={eachItem.image}
                alt="user post"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  renderMyProfileSection = () => {
    const {userProfileApiStatus} = this.state
    switch (userProfileApiStatus) {
      case apiStatusConstants.success:
        return this.renderMyProfileSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="my-profile-container">
        <Header />
        {this.renderMyProfileSection()}
      </div>
    )
  }
}

export default UserProfile
