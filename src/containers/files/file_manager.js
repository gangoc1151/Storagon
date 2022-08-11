import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchApi } from 'actions/api'
import { Base64, reverse, generateEncryptionKey } from './utils/index'
import Resumable from './utils/resumable'
import CryptoJS from 'crypto-js'
// import { message as messageNotification } from 'antd'
import { useToast, Button, Box, Flex, Checkbox, Stack, Wrap, WrapItem, Heading, Icon } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import 'devextreme/dist/css/dx.light.css';
import Modal from 'react-modal'
import loading from '../../assets/images/loading.gif'

import FileManager, {
    Permissions,
    Details, Column, ItemView,
} from 'devextreme-react/file-manager'
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider'
import { convertFilesize, server_url } from 'actions/constants'
import { useToastHook } from "../../components/Toast";

import { MdContentCopy } from "react-icons/md";




const Page = forwardRef(({uploadFileCallback}, ref) => {
  const dispatch = useDispatch()
  const fileManager = useRef(null)
  const [downloadLinks, setDownloadLinks] = useState([])
  const [downloadFetching, setDownloadFetching] = useState(false)

  const [state, newToast] = useToastHook();

  const messageNotification = (message) => {
    newToast({ message: message, status: "error" });
  };

  useImperativeHandle(ref, () => ({
      refreshFile(){
          fileManager.current.instance.refresh()
      }
  }))
  const getItems = async (event) => {
      console.log({ getItems: event })

      let response = await fetchApi('get', 'clapi/file/listFileAndFolder/', { folder_id: event.key })
      console.log({ files: response })

      let allFiles = []
      if (response) {

          const current_files = response && response.fileList ? JSON.parse(response.fileList) : []
          const current_folders = response && response.folderList ? JSON.parse(response.folderList) : []
          current_folders.map((item) => {
              allFiles.push({ key: item.pk.toString(), name: item.fields.name, isDirectory: true })
          })
          current_files.map((item) => {
              const fileDic = response && response.fileInfoDict && response.fileInfoDict[item.pk] ? response.fileInfoDict[item.pk] : {}
              allFiles.push({ key: 'file-' + item.pk.toString(), extension: item.fields.file_name.match(/\.[0-9a-z]+$/i)[0], name: item.fields.file_name, ...item.fields, ...fileDic, file_size: convertFilesize(fileDic.file_size) })
          })

          console.log({ allFiles })
      }

      return allFiles
  }

  const createDirectory = async (parentDirectory, name) => {
      let response = await fetchApi('post', 'clapi/file/newFolder/', { folder_name: name, folder_id: parentDirectory.key })
      if (response) {
          fileManager.current.instance.refresh()
      } else {
          console.log('Something wrong. We cannot create your folder')
          messageNotification('Something wrong. We cannot create your folder')
      }
  }

  const renameItem = async (item, newName) => {
      if (item.key.indexOf('file-') >= 0) {
          const extension = (/[.]/.exec(newName)) ? /[^.]+$/.exec(newName) : undefined
          if (!extension) {
              messageNotification('Your file name is invalid. Extension is missing')
          } else {
              let response = await fetchApi('post', 'clapi/file/editFile/', { file_id: item.key.replace('file-', ''), file_name: newName })

              if (response) {
                  // fileManager.current.instance.refresh()
              } else {
                  messageNotification('Something wrong. We cannot rename your file')
              }
          }

      } else {
          let response = await fetchApi('post', 'clapi/file/editFolder/', { folder_id: item.key, name: newName })

          if (response) {
              // fileManager.current.instance.refresh()
          } else {
              messageNotification('Something wrong. We cannot rename your folder')
          }
      }
  }

  const deleteItem = async (file) => {
      if (file.key && file.key.length > 0) {
          if (file.key.indexOf('file-') >= 0) {
              await fetchApi('post', 'clapi/file/deleteFile/', { file_id: file.key.replace('file-', '') })
          } else {
              await fetchApi('post', 'clapi/file/deleteFolder/', { folder_id: file.key })
          }
      }
  }

  const uploadFileChunk = (upload_file, uploadInfo, destintionDirectory) => {
      console.log({ upload_file, uploadInfo, destintionDirectory })

      if (upload_file && uploadFileCallback) {
          uploadFileCallback(upload_file, destintionDirectory)
      }
  }

  const downloadItems = (items) => {
      let files = items.map((item) => item.key.replace('file-', ''))
      fetchApi('get', 'clapi/file/getLink/', { file_id: files })
          .then((data) => {
              console.log(data)
              if (data && data.download_url_no_filename_list) {
                  setDownloadLinks(data.download_url_no_filename_list)
              } else if (data && data.error) {
                  messageNotification(data.error)
              } else {
                  messageNotification('Cannot get download link')
              }
              // if (data.download_url_no_filename_list && data.download_url_no_filename_list.length > 0) {
              //     window.open(data.download_url_no_filename_list[0], '_blank')
              // }
          })
          .catch((error) => {
              console.log({ error })
              messageNotification('Cannot get download link')
          })
  }

  const moveItem = async (file, destination) => {
      if (file.key && file.key.length > 0) {
          if (file.key.indexOf('file-') >= 0) {
              await fetchApi('post', 'clapi/file/moveFile/', { file_id: file.key.replace('file-', ''), folder_id: destination.key })
          } else {
              await fetchApi('post', 'clapi/file/moveFolder/', { folder_id: file.key, to_folder_id: destination.key })
          }
      }
  }

  const fileSystemProvider = new CustomFileSystemProvider({
      getItems,
      createDirectory,
      renameItem,
      deleteItem,
      uploadFileChunk,
      downloadItems,
      moveItem,
  })

  const closeDownloadModal = () => {
      setDownloadLinks([])
  }

  return (
    <Box
    ml={{base: 0, md: '70px'}}
    mx={'1px'}
    >
      <FileManager
        rootFolderName='Cloud Storagon'
        ref={fileManager}
        fileSystemProvider={fileSystemProvider}
        notifications={{ showPanel: false, showPopup: false }}
        upload={{maxFileSize: 1000 * 1024 * 1024, chunkSize: 1000 * 1024 * 1024}}
        style={{flex: 1}}
      >
        <ItemView>
          <Details>
            <Column dataField="thumbnail" />
            <Column dataField="name" cssclassName={false ? 'premium-file' : undefined} />
            <Column dataField="file_size" caption='Size' width={100} />
            <Column dataField="last_download_date" dataType={'datetime'} caption='Last Download Date' width={150} />
            <Column dataField="created_date" dataType={'datetime'} caption='Upload Date' width={150} />
            <Column dataField="download_count" caption='Total Download' width={120} />
            <Column dataField="download_count_24h" caption='Today Download' width={120} />
          </Details>
        </ItemView>
          <Permissions
              create={true}
              download={true}
              move={true}
              remove={true}
              rename={true}
              upload={true}
              delete={true}
          />

      </FileManager>
      <Modal
        isOpen={downloadLinks.length > 0}
        onRequestClose={closeDownloadModal}
        style={customStyles}
        appElement={document.getElementById('root')}
      >   
        <Heading as='h2' size='lg'>
            Download
        </Heading>
        <div className="row" style={{ overflowY: 'scroll', flex: 1 }}>
            <div className="large-12 columns">
              <h5 className='text-center'>List download links</h5>
              <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                  <Tbody>
                    <Tr>
                      <Td flex={'1'}>
                        {downloadLinks.map((item, index) => {
                          return (
                            <a key={index} href={item} target='_blank'>{server_url + item}</a>
                          )
                        })}
                      </Td>
                      {/* <Td w={'30px'}>
                        <Icon as={MdContentCopy} w={6} h={6} />
                      </Td> */}
                    </Tr>
                    <Tr>
                      <Td>
                        {downloadLinks.map((item, index) => {
                          return (
                            <a key={index} href={item} target='_blank'>{server_url + item}</a>
                          )
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        {downloadLinks.map((item, index) => {
                          return (
                            <a key={index} href={item + '?auto=torrent'} target='_blank'>{server_url + item + '?auto=torrent'}</a>
                          )
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        {downloadLinks.map((item, index) => {
                          return (
                            <a key={index} href={item + '?auto=browser'} target='_blank'>{server_url + item + '?auto=browser'}</a>
                          )
                        })}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>{downloadLinks.map((item, index) => {
                        return (
                          <a key={index} href={item + '?auto=direct'} target='_blank'>{server_url + item + '?auto=direct'}</a>
                        )
                        })}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
                {/* <table className="table fixed_layout" role="grid">
                    <tbody className='original' id="download_url_list">
                        {downloadLinks.map((item, index) => {
                            return (
                                <tr key={`normal-${index}`}><td><a href={item} target='_blank'>{server_url + item}</a></td></tr>
                            )
                        })}
                    </tbody>
                    <tbody id="no_key_url_list">
                        {downloadLinks.map((item, index) => {
                            return (
                                <tr key={`no-key-${index}`}><td><a href={item} target='_blank'>{server_url + item}</a></td></tr>
                            )
                        })}
                    </tbody>
                    <tbody id="torrent_url_list">
                        {downloadLinks.map((item, index) => {
                            return (
                                <tr key={`torrent-${index}`}><td><a href={item + '?auto=torrent'} target='_blank'>{server_url + item + '?auto=torrent'}</a></td></tr>
                            )
                        })}
                    </tbody>
                    <tbody id="browser_url_list">
                        {downloadLinks.map((item, index) => {
                            return (
                                <tr key={`browser-${index}`}><td><a href={item + '?auto=browser'} target='_blank'>{server_url + item + '?auto=browser'}</a></td></tr>
                            )
                        })}
                    </tbody>
                    <tbody id="direct_url_list">
                        {downloadLinks.map((item, index) => {
                            return (
                                <tr key={`direct-${index}`}><td><a href={item + '?auto=direct'} target='_blank'>{server_url + item + '?auto=direct'}</a></td></tr>
                            )
                        })}
                    </tbody>
                </table> */}
            </div>
        </div>
        <Wrap 
            alignItems={'center'}
            pt={'10px'}
            direction={'row'}
        >   
        
            <WrapItem>
                <Checkbox 
                    id="not-include-file-key" 
                    name="option" 
                    required
                >
                    No File Key
                </Checkbox>
            </WrapItem>
            <WrapItem>
                <Checkbox 
                    id="auto-download-torrent" 
                    name="option" 
                    required
                >Torrent Link</Checkbox>
            </WrapItem>
            
            <WrapItem>
                <Checkbox 
                    id="auto-free-download" 
                    name="option" 
                    required
                >Browser Link
                </Checkbox>
            </WrapItem>
            
            <WrapItem>
                <Checkbox 
                    id="auto-direct-download" 
                    name="option" 
                    required
                >Direct Link
                </Checkbox>
            </WrapItem>
            
            <WrapItem>
                <Checkbox 
                    id="normal-downloady" 
                    name="option" 
                    defaultChecked 
                    required
                >Normal Link
                </Checkbox>
            </WrapItem>
            
        </Wrap>
        <div className="row padding-top-10">
            {/* <div className="small-12 medium-12 large-12 columns left text-left">
                <input type="checkbox" id="not-include-file-key" name="option" required />
                <label htmlFor="not-include-file-key">No File Key</label>
                <input type="checkbox" id="auto-download-torrent" rel="torrent" name="option" required />
                <label htmlFor="auto-download-torrent">Torrent Link</label>
                <input type="checkbox" id="auto-free-download" rel="browser" name="option" required />
                <label htmlFor="auto-free-download">Browser Link</label>
                <input type="checkbox" id="auto-direct-download" rel="direct" name="option" required />
                <label htmlFor="auto-direct-download">Direct Link</label>
                <input type="checkbox" id="normal-download" rel="direct" name="option" checked required />
                <label htmlFor="normal-download">Normal Link</label>
            </div> */}
            {/* <div className="small-4 medium-4 large-4 columns left text-left">
                    <a className="button tiny" id="copy_links_to_clipboard">Copy links</a>
                </div> */}
        </div>
      </Modal>
    </Box>
  )
})

export default Page

const customStyles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        top: '100px',
        opacity: 1,
        left: '0',
        margin: '0 auto',
        maxWidth: '62.5em',
        right: '0',
        width: '60%',
        position: 'absolute', padding: '1.875rem',
        backgroundColor: 'white',
        border: 'solid 1px #666',
        boxWhadow: '0 0 10px rgba(0,0,0,0.4)',
        maxHeight: '60%'
    },
    overlay: {
        backgroundColor: '#000000cc',
        zIndex: 2000,
    }
}