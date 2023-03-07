/* eslint-disable react/no-unknown-property */
import {useState} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {FaRegComment} from 'react-icons/fa'
import {FcLike} from 'react-icons/fc'
import {BsHeart} from 'react-icons/bs'
import {BiShareAlt} from 'react-icons/bi'
import './index.css'

const PostCard = props => {
  const {postDetails} = props
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(postDetails.likes_count)
  const [showLoveAnimation, setShowLoveAnimation] = useState(false)
  const jwtToken = Cookies.get('jwt_token')
  const sendLikeToServer = async () => {
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts/${postDetails.post_id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          like_status: !liked,
        }),
      },
    )
    if (response.ok) {
      if (!liked) {
        setLikes(likes + 1)
      } else {
        setLikes(likes - 1)
      }
      setLiked(!liked)
    }
  }

  const onClickLike = async () => {
    sendLikeToServer()
    setShowLoveAnimation(true)

    // Reset the animation state after it finishes
    setTimeout(() => {
      setShowLoveAnimation(false)
    }, 1000)
  }

  return (
    <li className="post-card">
      <div className="profile-name-container">
        <img
          className="profile"
          src={postDetails.profile_pic}
          alt="post author profile"
        />
        <Link className="link-item" to={`/users/${postDetails.user_id}`}>
          <span>{postDetails.user_name}</span>
        </Link>
      </div>
      <div className="img-wrapper">
        <img
          className="post-img"
          src={postDetails.post_details.image_url}
          alt="post"
          onClick={onClickLike}
        />
        {showLoveAnimation && (
          <div className="love-animation">
            <span role="img" aria-label="Love symbol animation">
              ❤️
            </span>
          </div>
        )}
      </div>
      <div className="features">
        <div className="insta-features-container">
          {liked ? (
            <button
              className="feature-button"
              type="button"
              onClick={onClickLike}
              testid="unLikeIcon"
            >
              <FcLike color="#fff" size={30} />
            </button>
          ) : (
            <button
              className="feature-button"
              type="button"
              onClick={onClickLike}
              testId="likeIcon"
            >
              <BsHeart color="red" className="feature-icon" size={30} />
            </button>
          )}

          <button className="feature-button" type="button">
            <FaRegComment className="feature-icon" size={30} />
          </button>
          <button className="feature-button" type="button">
            <BiShareAlt className="feature-icon" size={30} />
          </button>
        </div>
        <span>
          <p className="Likes-count">{likes} likes</p>
        </span>
        <p className="caption">{postDetails.post_details.caption}</p>

        {postDetails.comments.slice(0, 2).map(eachItem => (
          <div key={eachItem.user_id} className="comment-container">
            <p className="comment">
              <span className="user-name">{eachItem.user_name}</span>
              {eachItem.comment}
            </p>
          </div>
        ))}
        <p className="time-stamp">{postDetails.created_at}</p>
      </div>
    </li>
  )
}

export default PostCard
