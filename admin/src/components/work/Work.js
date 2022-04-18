import React from 'react'
import { AiOutlineMore } from 'react-icons/ai';
import Edit from './edit/Edit'
import './work.css'

const Work = ({ workOne, workTwo, workThree, getOne }) => {

    

    return (
        <div className='work'>
            <div className='select'>
               <p className='active'>Group</p>
               <p>Staff</p>
            </div>
            <div className='work_card'>
                <div className='work_item'>
                    <div className='title'>Berildi</div>
                    {
                        workOne.map(items => {
                            return (
                                <Edit
                                    items={items}
                                    key={items._id}
                                    getOne={getOne}
                                />
                            )
                        })
                    }
                </div>
                <div className='work_item'>
                    <div className='title'>Jarayonda</div>
                    {
                        workTwo.map(items => {
                            return (
                                <Edit
                                    items={items}
                                    key={items._id}
                                    getOne={getOne}
                                />
                            )
                        })
                    }
                </div>
                <div className='work_item'>
                    <div className='title'>Tugatildi</div>
                    {
                        workThree.map(items => {
                            return (
                                <Edit
                                    items={items}
                                    key={items._id}
                                    getOne={getOne}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Work