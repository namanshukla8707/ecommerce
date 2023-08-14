import React from 'react'
import { Rating } from "@material-ui/lab";

import profilePng from "../../images/profilePng.png";

const ReviewCard = ({ review }) => {
    const options = {
      size: 'medium',
      value: review.rating,
      precision: 0.5,
      readOnly: true,
    };
  return (
    <div className='reviewCard'>
          <img src={profilePng} alt="User" />
          <p>{review.name}</p>
          <Rating {...options}/>
          <span className='reviewCard-span'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard
