import actions from './action'
import { TransactionTypeFilter } from 'actions/constants'

const initState = {
    uploadFiles: [],
    fileProgress: {},
    fileSpeed: {},
    showPanel: false
};

export default function appReducer(state = initState, action) {
    console.log(action)
    let files = [...state.uploadFiles]
    var filter = null
    switch (action.type) {
        case actions.UPDATE_PROGRESS:
            return { ...state, fileProgress: {...state.fileProgress, [action.file_id]: action.progress} }
        case actions.UPDATE_SPEED:
            return { ...state, fileSpeed: {...state.fileSpeed, [action.file_id]: action.speed} }
        case actions.UPDATE_UPLOADER:
            filter = files.filter((item) => item.file_id == action.file_id)
            if (filter && filter.length > 0){
                const index = files.indexOf(filter[0])
                let file = filter[index]
                file = {...file, ...action.props}
                files[index] = file
            }
            return { ...state, uploadFiles: files }
        case actions.ADD_UPLOADER:
            filter = files.filter((item) => item.file_id == action.file.file_id)
            if (!filter || filter.length == 0) {
                files.push(action.file)
            } else {
                const index = files.indexOf(filter[0])
                files[index] = action.file
            }
            return { ...state, uploadFiles: files }
        case actions.UPDATE_TRANSFER:
            return { ...state, showPanel: action.showPanel }
        default:
            return state
    }
}
