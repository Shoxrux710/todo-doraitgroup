import React, { useEffect, useState } from 'react';
import person from '../../images/human-clipart-old-boy-8.png'

const Create = ({ create, setArray, array, show }) => {

  const [boolean, setBoolean] = useState(false)
  const boxAdd = (id) => {
    if (!boolean) setArray([...array, id])
    else {
      const newBox = array.filter(item => item !== id)
      setArray(newBox)
    }
    setBoolean(!boolean)
  }

  useEffect(() => {
    setBoolean(false)
  }, [show])


  const images = create.avatar ? create.avatar.fileName : ''



  return (
    <div className="form_check">
      <div className="user">
        {images ?  <img src={`/avatar/${images}`} alt="" /> : <img src={person} alt="" />}
        <span>{create.name}</span>
      </div>
      <div
        onClick={() => boxAdd(create._id)}
        className={boolean ? "circle active" : "circle"}
      ></div>
    </div>
  );
};

export default Create;



