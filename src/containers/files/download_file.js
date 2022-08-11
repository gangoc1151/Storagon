import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchApi } from 'actions/api'
import { convertFilesize, DownloadType } from 'actions/constants'
import Token from 'actions/token'
import { decryptDownload } from './utils/downloader'

import encrypted_file from '../../assets/images/encrypted_file.png'
import utorrent from '../../assets/images/utorrent.png'
import idm from '../../assets/images/idm.png'
import { Stack, VStack, Heading, Icon, Flex, HStack, Text, SimpleGrid, Progress } from '@chakra-ui/react'
import { AiFillClockCircle, AiFillFolderOpen, AiFillFileZip, AiOutlineDownload, AiOutlineUser, AiOutlineFieldTime, AiFillLock } from "react-icons/ai";
import { Button, ButtonGroup } from '@chakra-ui/react'

//utils
import { shortenAddress } from 'actions/utils'

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   
function niceBytes(x){

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const Page = () => {
    
    const [fileUser, setFileUser] = useState('')
    const [fileCreated, setFileCreated] = useState('')
    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState(0)
    const [hashFile, setHashFile] = useState('')
    const { file_id, file_hash } = useParams()
    const [counter, setCounter] = useState(5)
    const [fileDownloadProcess, setFileDownloadProcess] = useState({})
    const user = Token.getUser()

    useEffect(() => {
        setTimeout(() => {
            if (counter > 0) {
                setCounter(counter - 1)
            }
        }, 1000)
    }, [counter])

    useEffect( async () => {
        if (file_id, file_hash) {
           await fetchApi('get', 'clapi/file/getFile/', { file_id, file_hash: file_hash })
                .then((data) => {
                    try {
                        setFileSize(data.file_size)
                        setFileName(data.file_name)
                        setFileUser(data.username)
                        setFileCreated(data.created_date)
                        setHashFile(data.file_hash)
                    } catch (error) {

                    }
                    console.log({ fileSearch: data })
                })
                .catch((error) => {
                    console.log({ error })
                })
        }
        
        console.log("users", user)

        return () => { }
    }, [])


    const normalDownload = () => {
        fetchApi('post', 'clapi/session/createDownloadSession/', { userFile_id: file_id, download_type: DownloadType.direct })
            .then((data) => {
                console.log({ data })
                if (data && data.download_link) {
                    decryptDownload(data.download_link.replace('localhost', '192.168.31.105'), data.file_size, data.file_name, setFileDownloadProcess)
                }
            })
            .catch((error) => {
                console.log({ error })
                alert('Cannot open downlink')
            })
    }

    // const onClick1 = () => {
    //   fetchApi('get', '/sf/download/62bab6518f40c9b5e0232c2a/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOnsiJG9pZCI6IjYyYmFiNjUxOGY0MGM5YjVlMDIzMmMyYSJ9LCJ0eXBlIjoxLCJ1aWQiOjUsImZpZCI6MTcsInNpZCI6OCwib2lkIjoxLCJzdGF0dXMiOjAsImRhdGEiOnsiY29ubmVjdGlvbl9saW1pdCI6MiwiZG93bmxvYWRfdHlwZSI6MywiZmlsZV9sb2NhdGlvbiI6InJlYWxmaWxlLzIwMjIvNS8yMC9lZWQ4ZTAzMWE3NDQ4ZDc5ZDU0MzExYTc2Y2Q1NzUwNiIsImZpbGVfbmFtZSI6ImRvd25sb2FkX2ZpbGUuanMiLCJmaWxlX3NpemUiOjQ4NzcsImlwX2FkZHJlc3MiOiIxNjIuMTU4LjE3MC4xNzkiLCJpc29fY29kZSI6IlVTIiwic3BlZWRfbGltaXQiOjEyMjg4MDAsIndlYnNpdGVfb3JpZ2luIjoiIiwid2Vic2l0ZV91cmwiOiIifSwiY3JlYXRlZCI6eyIkZGF0ZSI6MTY1NjQwMzU2MDY0Mn19.NDvxVtcRM-3e52vbKkxcEXAF9wwr5bOZ5eSKS8DNncA/download_file.js'
    //   ).then((data) => {
    //     console.log({data})
    //   })
    // }

    return (
      <>
      <VStack mx={'10px'}>
        <Stack marginTop={10} spacing={2}>
          <Heading as='h2' noOfLines={1}>
            {fileName}
          </Heading>
          <InfoWrapper >
            <HStack>
              <Icon as={AiFillClockCircle} boxSize={5} color={'#71C91D'}/>
              <Text fontWeight={'bold'}>Uploaded:</Text> 
              <Text wordBreak={'break-word'}>{fileCreated} </Text>
            </HStack>
          </InfoWrapper>
          <HStack>
              <Icon as={AiOutlineUser} boxSize={5} color={'#FF9048'}/>
              <Text fontWeight={'bold'}>File Size:</Text> 
              <Text wordBreak={'break-word'}>{niceBytes(fileSize)}</Text>
          </HStack>
          <HStack>
              <Icon as={AiFillLock} boxSize={5} color={'#71C91D'}/>
              <Text fontWeight={'bold'}>Hash Info:</Text> 
            <Text wordBreak={'break-word'}>{hashFile} </Text>
          </HStack>
          <VStack pt={'20px'}>
            <Flex>
              <VStack>
                <Icon as={AiFillFileZip} boxSize={'48px'} color={'#E96182'}/>
              </VStack>
              <Stack>
                <Button
                  onClick={normalDownload}
                  size='md'
                  h={'48px'}
                  border='2px'
                  color={'white'}
                  borderColor={'#014ABE'}
                  _hover={{
                    bgColor: '#014ABE'
                }}
                  bgColor={'#5388F1'}
                  disabled={fileDownloadProcess.progress}
                  // bgGradient={["linear(to-b, #BE2EE1, #5388F1, #5B24F3)"]}
                  rightIcon={<Icon as={AiOutlineDownload} boxSize={6}/>}
                >
                  Download file 
                </Button>
              </Stack>
            </Flex>
          </VStack>
          <HStack>
              <Icon as={AiFillLock} boxSize={5} color={'#71C91D'}/>
              <Text fontWeight={'bold'}>Download process:</Text>
              <Text>{fileDownloadProcess.progress ? fileDownloadProcess.progress + '%' : ''}</Text>
              
            {/* <Text wordBreak={'break-word'}>{JSON.stringify(fileDownloadProcess)}</Text> */}
          </HStack>
          <Progress
              value={fileDownloadProcess.progress}
              h={3}
              mt={2}
              borderRadius={10}
              colorScheme={'green'}
          />
        </Stack>
      </VStack>
    </>
        // <div className="padding-top-50">
        //     <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //         <div className="large-4 columns">
        //             <ul className="large-block-grid-1 testimonialsContainer">
        //                 <li className="testimonial-item">
        //                     <div className="testimonial-text">
        //                         <p className="text-center padding-top-20"><strong>File Information</strong></p>
        //                         <p>Name: <strong>{fileName}</strong></p>
        //                         <p>Size: <strong>{convertFilesize(fileSize)}</strong></p>
        //                     </div>
        //                 </li>
        //             </ul>
        //             <div className="show">
        //                 <div className="padding-top-20 padding-bottom-20">
        //                     <ul className="countdown">
        //                         <li> <span className="hours">00</span>
        //                             <p className="hours_ref">hours</p>
        //                         </li>
        //                         <li className="seperator">:</li>
        //                         <li> <span className="minutes">00</span>
        //                             <p className="minutes_ref">minutes</p>
        //                         </li>
        //                         <li className="seperator">:</li>
        //                         <li> <span className="seconds">{counter.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</span>
        //                             <p className="seconds_ref">seconds</p>
        //                         </li>
        //                     </ul>
        //                     <div id="progress"></div>
        //                 </div>

        //                 <div id="help_message_download" className="panel text-center">
        //                     <strong>Please choose your download type</strong>
        //                 </div>
        //                 <section className="btn-wrapper-download" >
        //                     <div className="download-btns small-12 columns">
        //                         <button onClick={normalDownload} className="button expand browser-download-btn hvr-hang text-justify" id="freedl" title="Download and decrypt file using browser"><img style={{ width: '28px', height: '28px', marginTop: '-7px' }} src={idm} />Download decrypted file by browser</button>
        //                     </div>
        //                 </section>
        //                 <input type="hidden" id="user_id" value="{{ user.profile.id }}" />
        //                 <input type="hidden" id="deviceId" value="" />
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}


const InfoWrapper = ({children}) => {
  return (
    <>
      <HStack display={{base: 'none', md: 'inherit'}} spacing={10} fontSize={'15px'}>
        {children}
      </HStack>
      <Stack display={{base: 'inherit', md: 'none'}} fontSize={'15px'}>
        {children}
      </Stack>
    </>
    
  )
}
export default Page