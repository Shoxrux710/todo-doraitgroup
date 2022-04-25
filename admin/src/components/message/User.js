import React, { useState, useEffect } from 'react';
import person from '../../images/human-clipart-old-boy-8.png'

const User = ({ user, setArray, show, array, setChecked, checked, setAvatarImage }) => {

  const boxAdd = (id) => {
    setArray(id)
    setChecked(id)
  }

  const images = user.avatar ? user.avatar.fileName : ''

  return (
    <div className="form_check">
      <div className="user">
        {images ? <img src={`/avatar/${images}`} alt="" /> : <img src={person} alt="" />}
        <span>{user.name}</span>
      </div>
      <input 
      type="radio"  
      name="contact" 
      checked={checked === user._id}
      value={`${user._id}`}
      onChange={(e) => {
        setAvatarImage(user.avatar.fileName)
        boxAdd(e.target.value)}}
      ></input>
      
      {/* <div
        onClick={() => boxAdd(user._id)}
        className={boolean ? "circle active" : "circle"}
      ></div> */}

    </div>
  );
};

export default User;
