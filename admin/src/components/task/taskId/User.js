import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

const User = ({items, array, setArray}) => {

    const { count} = useSelector(state => state.userLogin)
    const [boolean, setBoolean] = useState(false)

    const boxAdd = (id) => {
        if (!boolean) setArray([...array, id])
        else{
            const newBox = array.filter(item => item !== id)
            console.log("array", array)
            setArray(newBox)
        }
        setBoolean(!boolean)

    }

    useEffect(() => {
        setBoolean(false)
    }, [count])


    return (
        <div className="form_check" key={items._id}>
            <div className="users">
                <span>{items.name}</span>
            </div>
            <div
                onClick={() => boxAdd(items._id)}
                className={boolean ? "circle active" : "circle"}
            ></div>
        </div>
    )
}

export default User