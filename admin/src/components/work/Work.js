import React, { useState, useEffect } from 'react'
import WorkTop from './work-top/WorkTop';
import Edit from './edit/Edit'
import './work.css'

const Work = ({ workOne, workTwo, workThree, getOne, workGroup, show, onGroup, setGroupName, groupName }) => {



    const group = workGroup[0] ? workGroup[0].group : 'group'

    console.log("sdfsdf", group)

    return (
        <div className='work'>
            <div className='select'>
                <p
                    className={show ? 'active' : ''}
                    onClick={() => show ? '' : onGroup(group)}
                >Group</p>
                <p
                    className={show ? '' : 'active'}
                    onClick={() => show ? onGroup('') : ''}
                >Staff</p>
            </div>
            {
                groupName ? <div className='work_top'>
                    {
                        workGroup.map(items => {
                            return (
                                <WorkTop
                                    setGroupName={setGroupName}
                                    groupName={groupName}
                                    key={items._id}
                                    items={items}
                                />
                            )
                        })
                    }
                </div> : ''
            }
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
                                    edit={items.array}
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
                                    edit={items.array}
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
                                    edit={items.array}
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