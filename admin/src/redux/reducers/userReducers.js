import { USER_TO_PROFILE, LOGOUT, PROFILE_IMAGES, COUNT, TASK_SHOW, TASK_ID } from '../action/Types'

const authData = JSON.parse(window.localStorage.getItem('auth'))
const initilAuth = authData ? !!authData.token : false
const initialToken = authData ? authData.token : null
const initilRole = authData ? authData.role : null
const initilId = authData ? authData.id : null


const initilState = {
    auth: initilAuth,
    role: initilRole,
    token: initialToken,
    id: initilId,
    image: null,
    count: null,
    task: true,
    taskId: null
}

const userReducers = (state = initilState, action) => {

    switch (action.type) {
        case USER_TO_PROFILE:

            const auth = action.payload.token ? true : false

            return {
                ...state,
                auth: auth,
                token: action.payload.token,
                role: action.payload.role,
                id: action.payload.id
            }

        case LOGOUT:

            return {
                ...state,
                auth: false,
                token: null,
                role: null,
                id: null
            }
        case PROFILE_IMAGES:

            return {
                ...state,
                image: action.payload
            }
        case COUNT:

            return {
                ...state,
                count: action.payload
            }

        case TASK_SHOW:

            return {
                ...state,
                task: action.payload
            }

        case TASK_ID:

            return {
                ...state,
                taskId: action.payload
            }

        default:
            return state
    }
}

export default userReducers