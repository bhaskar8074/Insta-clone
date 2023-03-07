import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {FcPrevious, FcNext} from 'react-icons/fc'
import Slider from 'react-slick'
import Header from '../Header'
import PostCard from '../PostCard'

// eslint-disable-next-line import/no-unresolved
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    storiesApiStatus: apiStatusConstants.initial,
    postsApiStatus: apiStatusConstants.initial,
    storiesList: [],
    postsList: [],
    searchInput: '',
    showStories: true,
  }

  componentDidMount() {
    this.getStories()
    this.getPosts()
  }

  getStories = async () => {
    this.setState({
      storiesApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const storiesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(storiesUrl, options)

    const storiesData = await response.json()
    if (response.ok) {
      // console.log(storiesData)
      this.setState({
        storiesApiStatus: apiStatusConstants.success,
        storiesList: storiesData.users_stories,
      })
    } else {
      this.setState({
        storiesApiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = value => {
    this.setState(
      {
        searchInput: value,
      },
      this.getPosts,
    )
  }

  onClickInput = () => {
    this.setState({
      showStories: false,
    })
  }

  onClickHome = () => {
    this.setState({
      showStories: true,
    })
  }

  getPosts = async () => {
    this.setState({
      postsApiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const postUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    // UPDATE POST API STATUS LOADING
    const response = await fetch(postUrl, options)
    const postsData = await response.json()
    // console.log(response.ok)
    if (response.ok) {
      this.setState({
        postsApiStatus: apiStatusConstants.success,
        postsList: postsData.posts,
      })
    } else {
      this.setState({
        postsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderStoriesView = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: <FcPrevious />,
      nextArrow: <FcNext />,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
      ],
    }
    const {storiesApiStatus, storiesList} = this.state
    // console.log(storiesList)
    switch (storiesApiStatus) {
      case apiStatusConstants.success:
        return (
          <ul className="ul-stories">
            <Slider {...settings}>
              {storiesList.map(eachItem => (
                <div key={eachItem.user_id}>
                  <div className="story">
                    <div className="story-img-container">
                      <img
                        src={eachItem.story_url}
                        alt="user story"
                        className="story-img"
                      />
                    </div>

                    <Link
                      className="link-li-item"
                      to={`/user-profile/:${eachItem.user_id}`}
                    >
                      <p className="name">{eachItem.user_name}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </ul>
        )

      default:
        return null
    }
  }

  renderStoriesLoaderSpinner = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="stories-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderPostsLoaderSpinner = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="posts-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getPosts()
  }

  onClickStoriesTryAgain = () => {
    this.getStories()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="home-failure-img"
        src="https://res.cloudinary.com/dddkunsox/image/upload/v1678040916/instaClone/Icon_ot4cxo.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onClickTryAgain}>
        Try again
      </button>
    </div>
  )

  renderStoriesFailureView = () => (
    <div className="failure-view-container">
      <img
        className="home-failure-img"
        src="https://res.cloudinary.com/dddkunsox/image/upload/v1678040916/instaClone/Icon_ot4cxo.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onClickStoriesTryAgain}>
        Try again
      </button>
    </div>
  )

  renderPostsSuccessView = () => {
    const {postsList} = this.state
    const showPostList = postsList.length > 0

    return showPostList ? (
      <div className="all-posts-container">
        <ul className="posts-list">
          {postsList.map(eachItem => (
            <PostCard key={eachItem.post_id} postDetails={eachItem} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-search-results-found">
        <img
          className="no-search-results-img"
          src="https://res.cloudinary.com/dddkunsox/image/upload/v1678003423/instaClone/Group_1_msj8fk.png"
          alt="search not found"
        />
        <h1>Search Not Found</h1>
        <p>Try different keyword or search again</p>
      </div>
    )
  }

  renderPosts = () => {
    const {postsApiStatus} = this.state

    switch (postsApiStatus) {
      case apiStatusConstants.success:
        return <div>{this.renderPostsSuccessView()}</div>
      case apiStatusConstants.inProgress:
        return this.renderPostsLoaderSpinner()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  renderStories = () => {
    const {storiesApiStatus} = this.state
    switch (storiesApiStatus) {
      case apiStatusConstants.success:
        return this.renderStoriesView()
      case apiStatusConstants.inProgress:
        return this.renderStoriesLoaderSpinner()
      case apiStatusConstants.failure:
        return this.renderStoriesFailureView()

      default:
        return null
    }
  }

  render() {
    const {searchInput, showStories} = this.state
    return (
      <div>
        <Header
          searchInputValue={searchInput}
          onChangeSearchInput={this.onChangeSearchInput}
          getPosts={this.getPosts}
          onClickInput={this.onClickInput}
          onClickHome={this.onClickHome}
        />
        <div className="home-content-container">
          {showStories ? (
            <div className="stories-container">{this.renderStories()}</div>
          ) : (
            <h1 className="search-results-heading">Search Results</h1>
          )}
          <div className="posts-container">{this.renderPosts()}</div>
        </div>
      </div>
    )
  }
}

export default Home
