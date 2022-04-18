import {USER_TO_PROFILE, LOGOUT, PROFILE_IMAGES, COUNT, TASK_SHOW, TASK_ID} from './Types'


export const userInform = (items) => {
    
    window.localStorage.setItem('auth', JSON.stringify(items))

    return {
        type: USER_TO_PROFILE,
        payload: items
    }
}

export const logOut = () => {
    
    window.localStorage.removeItem('auth')

    return {
        type: LOGOUT
    }
}

export const profileImage = (items) => {

    return {
        type: PROFILE_IMAGES,
        payload: items
    }
}

export const countPost = (items) => {
    return {
        type: COUNT,
        payload: items
    }
}

export const taskShow = (items) => {
    return {
        type: TASK_SHOW,
        payload: items

    }
}

export const taskIdShow = (items) => {
    return {
        type: TASK_ID,
        payload: items

    }
}