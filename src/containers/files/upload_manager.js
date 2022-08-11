import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { fetchApi } from 'actions/api'
import { Base64, reverse, generateEncryptionKey } from './utils/index'
import Resumable from './utils/resumable'
import CryptoJS from 'crypto-js'
// import { message as messageNotification } from 'antd'
import {
    useToast, Button, Box, Flex, Stack, Icon, IconButton, Text, Spacer,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    HStack,
    Progress
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'

import { FaUpload, FaPlay, FaStop, FaExpandAlt } from "react-icons/fa";

import actions from './redux/action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faExpandAlt, faUpload } from '@fortawesome/free-solid-svg-icons'

import { convertFilesize } from 'actions/constants'

const { addUploader, updateProgress, updateTransfer, updateSpeed, updateUploader } = actions


let resumableObjList = {}
const Page = forwardRef(({ uploadFileCompleted }, ref) => {
    const dispatch = useDispatch()

    const fileProgress = useSelector(state => state.file.fileProgress)
    const fileSpeed = useSelector(state => state.file.fileSpeed)
    const uploadFiles = useSelector(state => state.file.uploadFiles)
    const showPanel = useSelector(state => state.file.showPanel)
    const messageNotification = useToast({
        title: 'Logged In',
        description: "Waiting for developers to build redirect pages",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
    })

    useImperativeHandle(ref, () => ({
        uploadFile(upload_file, destintionDirectory) {

            if (upload_file) {
                console.log('===upload');
                try {
                    var r = new Resumable({
                        target: '/sf/upload/',
                        chunkSize: 1 * 1024 * 1024,
                        simultaneousUploads: 1,
                        maxFiles: 1
                    })

                    r.on('fileAdded', (file) => {
                        console.log({ fileAdd: file })
                        var reader = new FileReader();
                        var md5 = CryptoJS.algo.MD5.create();
                        reader.onload = (fileEvent) => {
                            md5.update(CryptoJS.lib.WordArray.create(fileEvent.target.result))
                            md5.update(file.size.toString())
                            var file_hash = md5.finalize().toString(CryptoJS.enc.Hex)

                            r.key = generateEncryptionKey()
                            r.duplicated = false
                            dispatch(updateTransfer(true))

                            fetchApi('post', 'clapi/session/createUploadSession/', {
                                file_hash: file_hash,
                                file_size: file.size,
                                file_name: file.fileName,
                                folder_id: destintionDirectory.key,
                                erfk: reverse(Base64.encode(r.key))
                            })
                                .then((data) => {
                                    console.log(data)

                                    if (data && data.error) {
                                        messageNotification.error(data.error)
                                    } else if (data && data.upload_link) {
                                        r.opts.target = data.upload_link;
                                        r.duplicated = data.duplicated;
                                        r.uniqueIdentifier = data.session_id;

                                        if (data.encryptResumeFileKey) {
                                            r.key = Base64.decode(data.encryptResumeFileKey);
                                        }

                                        dispatch(
                                            addUploader(
                                                {
                                                    file_id: r.key,
                                                    file_size: file.size,
                                                    file_name: file.fileName,
                                                    stopped: false
                                                }
                                            )
                                        )

                                        resumableObjList[r.key] = r

                                        console.log({ key: r.key })

                                        file.initEncryptor(r.key)
                                        r.readyToUpload = true

                                        if (!r.isUploading()) {
                                            r.startDate = new Date();
                                            r.lastDate = new Date();
                                            r.lastProgress = 0.0;
                                        }
                                        r.upload();
                                    } else {
                                        messageNotification.error('Cannot upload your file at the moment')
                                    }

                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }

                        reader.readAsArrayBuffer(new Blob([file.file.slice(0, 1024 * 1024), file.file.slice(-1024 * 1024)]))

                        r.opts.target = '/sf/upload/'

                        if (file.size > 50 * 1024 * 1024) {
                            r.opts.chunkSize = 10 * 1024 * 1024;

                            r.opts.forceChunkSize = true;
                            console.log("Set chunk size to 10MB = " + r.getOpt('chunkSize'));
                            file.bootstrap();
                        }
                    })

                    r.on('fileError', (file, message) => {
                        try {
                            const errorResponse = JSON.parse(message);
                            if (errorResponse.error == "chunk is invalid") {
                                file.abort();
                                setTimeout(function () {
                                    file.retry();
                                }, 5000);
                            } else {
                                messageNotification.error('Upload failed due to ' + message)
                            }
                        } catch (error) {
                            console.log({ error })
                        }
                    })

                    r.on('fileSuccess', (file, message) => {
                        console.log({ success: file })
                        r = null;

                        if (uploadFileCompleted) {
                            uploadFileCompleted()
                        }
                        // fileManager.current.instance.refresh()
                        // dispatch(getFiles(currentFolder, 0, 50))
                    })

                    var progress = 0
                    r.on('progress', (file, message) => {
                        console.log({ r })
                        if (r.progress() < progress)
                            return

                        progress = r.progress();
                        dispatch(updateProgress(r.key, (progress * 100).toFixed(1)))

                        var curDate = new Date();
                        var curDuration = curDate - r.lastDate;
                        var incProgress = progress - r.lastProgress;
                        //update ui
                        var fileSize = r.getSize();
                        var curSpeed = (fileSize * incProgress) / curDuration;
                        var avgSpeed = (fileSize * progress) / (curDate - r.startDate);

                        if (curSpeed > 0 && curDuration > 1000) {
                            //change last progress
                            r.lastDate = curDate;
                            r.lastProgress = progress;
                        }

                        var correctSpeed = avgSpeed;
                        if (curSpeed < avgSpeed * 1.2 && curSpeed > avgSpeed * 0.3)
                            correctSpeed = curSpeed;
                        if (curSpeed >= 0 && curSpeed <= avgSpeed * 0.3)
                            correctSpeed = (avgSpeed + curSpeed) / 2;

                        console.log({ correctSpeed, progress })

                        dispatch(updateSpeed(r.key, correctSpeed.toFixed(2)))
                    })

                    r.on('cancel', () => {
                        console.log('upload cancel')
                        r = null
                    })

                    r.addFile(upload_file)
                } catch (error) {
                    console.log({ error })
                }
            }
        }
    }))

    const updateShowPanel = () => {
        dispatch(updateTransfer(!showPanel))
    }

    const stopUploadFile = (file_id) => {
        if (resumableObjList && resumableObjList[file_id]) {
            const resumable = resumableObjList[file_id]
            resumable.cancel()
            dispatch(updateUploader(file_id, { stopped: true }))
        }
    }

    const stopAll = () => {
        if (resumableObjList) {
            const keys = Object.keys(resumableObjList)
            keys.forEach(file_id => {
                const resumable = resumableObjList[file_id]
                resumable.cancel()
                dispatch(updateUploader(file_id, { stopped: true }))
            })
        }
    }

    return (
        <div id="panel" className={showPanel ? 'active' : ''}>
            <Box
            ml={{base: 0, md: '70px'}}
            mx={'1px'}
            >
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <HStack>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="open menu"
                            icon={<FaUpload />}
                            color={'red.600'}
                        />
                        <Text> File Transfer</Text>
                    </HStack>
                  
                    <HStack>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="open menu"
                            icon={<FaStop />}
                            color={'red.600'}
                            onClick={stopAll}
                        />
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="open menu"
                            icon={<FaExpandAlt />}
                            color={'red.600'}
                            onClick={updateShowPanel}
                        />
                    </HStack>
                    
                </Flex>
                <TableContainer id="upload-progress">
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption>Upload File Manager</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>File name</Th>
                                <Th>File size</Th>
                                <Th>Process</Th>
                                <Th>Status</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>

                            {uploadFiles.map((file, index) => {
                                const progress = fileProgress && fileProgress[file.file_id] ? fileProgress[file.file_id] : 0
                                const speed = fileSpeed && fileSpeed[file.file_id] ? fileSpeed[file.file_id] : 0

                                return (
                                    <Tr key={index.toString()} className='deactivate'>
                                        <Td width="40%">{file.file_name}</Td>
                                        <Td width="10%">{convertFilesize(file.file_size)}</Td>
                                        <Td className='progress-status'>
                                        <Progress
                                            value={progress}
                                            h={3}
                                            mt={2}
                                            borderRadius={10}
                                            colorScheme={'green'}
                                        /> </Td>
                                        {progress == 100 && <Td className='progress-status deactivate success'>{progress + '%'}</Td>}
                                        {progress < 100 && file.stopped && <Td className='progress-status deactivate success' style={{ color: '#d11e00' }}>Stopped</Td>}
                                        {progress < 100 && !file.stopped && <Td className='progress-status deactivate success' style={{ color: 'black' }}>{speed + ' KB/s (' + progress + '% )'}</Td>}
                                        <Td width="2%">
                                            <a onClick={() => stopUploadFile(file.file_id)}>
                                                <FontAwesomeIcon size='sm' icon={faStop} color='#d11e00' />
                                            </a>
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            {/* <nav className="top-bar" data-topbar role="navigation">
                <ul className="title-area">
                    <li className="name">
                        <h1>
                            <a>
                                <FontAwesomeIcon icon={faUpload} size='sm' color='#d11e00' style={{ marginRight: 8 }} />
                                File Transfer</a></h1>
                    </li>
                </ul>
                <section className="top-bar-section">
                    <ul className="right">
                        <li className="has-form show-for-large-up">
                            <a onClick={stopAll} id="cancel-all-progress">
                                <FontAwesomeIcon icon={faStop} size='sm' color='#d11e00' />
                            </a>
                        </li>
                        <li className="has-form show-for-large-up">
                            <a onClick={updateShowPanel} id="show-hide-panel">
                                <FontAwesomeIcon icon={faExpandAlt} size='sm' color='#d11e00' />
                            </a>
                        </li>
                    </ul>
                </section>
            </nav> */}
            {/* <table id="upload-progress">
                <thead>
                    <tr><th width="40%">File name</th>
                        <th width="10%">File size</th>
                        <th width="30%">Progress</th>
                        <th>Status</th>
                        <th width="2%">Action</th></tr>
                </thead>
                <tbody>
                    {uploadFiles.map((file, index) => {
                        const progress = fileProgress && fileProgress[file.file_id] ? fileProgress[file.file_id] : 0
                        const speed = fileSpeed && fileSpeed[file.file_id] ? fileSpeed[file.file_id] : 0

                        return (
                            <tr key={index.toString()} className='deactivate'>
                                <td width="40%">{file.file_name}</td>
                                <td width="10%">{convertFilesize(file.file_size)}</td>
                                <td className='progress-status'><div className='progress large-12 success round'><span className='meter' style={{ width: progress + '%' }}></span></div></td>
                                {progress == 100 && <td className='progress-status deactivate success'>Completed</td>}
                                {progress < 100 && file.stopped && <td className='progress-status deactivate success' style={{ color: '#d11e00' }}>Stopped</td>}
                                {progress < 100 && !file.stopped && <td className='progress-status deactivate success' style={{ color: 'black' }}>{speed + ' KB/s (' + progress + '% )'}</td>}
                                <td width="2%">
                                    <a onClick={() => stopUploadFile(file.file_id)}>
                                        <FontAwesomeIcon size='sm' icon={faStop} color='#d11e00' />
                                    </a>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table> */}
        </div>

    )
})

export default Page