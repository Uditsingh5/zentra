import React from 'react'

const FollowButton = ({name, classes, action}) => {
  return (
    <button className = {`bg-[#CE97FF] text-gray-700 hover:text-gray-300 px-4 py-2 ${classes} rounded-2xl`} onClick = {action}>
      {name}
    </button>
  )
}

export default FollowButton