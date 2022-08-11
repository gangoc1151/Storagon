const actions = {
    ADD_UPLOADER: 'ADD_UPLOADER',
    UPDATE_PROGRESS: 'UPDATE_PROGRESS',
    UPDATE_TRANSFER: 'UPDATE_TRANSFER',
    UPDATE_SPEED: 'UPDATE_SPEED',
    UPDATE_UPLOADER: 'UPDATE_UPLOADER',
    addUploader: (file) => {
        return {
            type: actions.ADD_UPLOADER,
            file
        }
    },
    updateUploader: (file_id, props) => {
        return {
            type: actions.UPDATE_UPLOADER,
            file_id, props
        }
    },
    updateProgress: (file_id, progress) => {
        return {
            type: actions.UPDATE_PROGRESS,
            file_id, progress
        }
    },
    updateSpeed: (file_id, speed) => {
        return {
            type: actions.UPDATE_SPEED,
            file_id, speed
        }
    },
    updateTransfer: (showPanel) => {
        return {
            type: actions.UPDATE_TRANSFER,
            showPanel
        }
    }
}

export default actions
