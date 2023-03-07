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
class MyProfile extends Component {
  state = {
    myProfileApiStatus: apiStatusConstants.initial,
    myProfileDetails: {},
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    this.setState({
      myProfileApiStatus: apiStatusConstants.inProgress,
    })
    const myProfileUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(myProfileUrl, options)
    const data = await response.json()
    // console.log(response.ok)
    if (response.ok) {
      this.setState({
        myProfileApiStatus: apiStatusConstants.success,
        myProfileDetails: data.profile,
      })
    } else {
      this.setState({myProfileApiStatus: apiStatusConstants.failure})
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

  renderMyProfileLoaderView = () => (
    <div className="my-profile-loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  // render my profile section success view
  renderMyProfileSuccessView = () => {
    const {myProfileDetails} = this.state
    return (
      <div className="myProfile-content">
        <div className="profileDetails-container">
          <img
            className="profile-img"
            src={myProfileDetails.profile_pic}
            alt="my profile"
          />
          <div className="details-container">
            <h1 className="my-profile-user-name">
              {myProfileDetails.user_name}
            </h1>
            <div className="stats-container">
              <div className="stat">
                <span className="stat-n">{myProfileDetails.posts_count}</span>{' '}
                posts
              </div>
              <div className="stat">
                <span className="stat-n">
                  {myProfileDetails.followers_count}
                </span>{' '}
                Followers
              </div>
              <div className="stat">
                <span className="stat-n">
                  {myProfileDetails.following_count}
                </span>{' '}
                Following
              </div>
            </div>
            <p className="user-id">{myProfileDetails.user_id}</p>
            <p className="user-bio">{myProfileDetails.user_bio}</p>
          </div>
        </div>
        <ul className="my-profile-stories">
          {myProfileDetails.stories.map(eachItem => (
            <li key={eachItem.id} className="story-container">
              <img
                className="profile-story-img"
                src={eachItem.image}
                alt="my story"
              />
            </li>
          ))}
        </ul>
        <hr className="hr-line" />
        <div className="posts-heading">
          <BsGrid3X3 size={30} className="grid-icon" />
          <h1 className="post-heading">Posts</h1>
        </div>
        {myProfileDetails.posts.length === 0 ? (
          <div className="no-posts-container">
            <BiCamera size="30" />
            <h1>No Posts Yet</h1>
          </div>
        ) : (
          <div className="posts-imgs-container">
            {myProfileDetails.posts.map(eachItem => (
              <img
                key={eachItem.id}
                className="profile-post-img"
                src={eachItem.image}
                alt="my post"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  renderMyProfileSection = () => {
    const {myProfileApiStatus} = this.state
    switch (myProfileApiStatus) {
      case apiStatusConstants.success:
        return this.renderMyProfileSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderMyProfileLoaderView()
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

export default MyProfile
