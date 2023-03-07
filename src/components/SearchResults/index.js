import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import PostCard from '../PostCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class SearchResults extends Component {
  state = {
    postsApiStatus: apiStatusConstants.initial,
    postsList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = async () => {
    this.setState({
      postsApiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput} = this.state
    console.log(searchInput)
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

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dddkunsox/image/upload/v1678003423/instaClone/Group_1_msj8fk.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onClickTryAgain}>
        Try again
      </button>
    </div>
  )

  renderPostsLoaderSpinner = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="posts-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
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

  renderPostsView = () => {
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

  onChangeSearchInputSmall = event => {
    this.setState(
      {
        searchInput: event.target.value,
      },
      this.getPosts,
    )
  }

  onChangeSearchInput = value => {
    this.setState(
      {
        searchInput: value,
      },
      this.getPosts,
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="search-results-container">
        <Header
          searchInputValue={searchInput}
          onChangeSearchInput={this.onChangeSearchInput}
          getPosts={this.getPosts}
        />
        <div className="mobile-search-container">
          <input
            type="search"
            placeholder="Search Caption"
            className="mobile-search-input"
            onChange={this.onChangeSearchInputSmall}
            value={searchInput}
          />
          <button
            type="button"
            className="search-button"
            onClick={this.getPosts}
          >
            <FaSearch testid="searchIcon" />
          </button>
        </div>
        {this.renderPostsView()}
      </div>
    )
  }
}

export default SearchResults
