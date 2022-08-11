import React, { Fragment, useRef } from 'react'
import Footer from 'components/Footer'
import Header from 'components/Header'
import FileManager from 'containers/files/file_manager'
import UploadManager from 'containers/files/upload_manager'
import { Stack, Alert, AlertTitle, AlertIcon, CloseButton, InputGroup, FormLabel, Input, Button, Flex, Box, Center, Text, FormControl } from '@chakra-ui/react'
import { Image, Container, SimpleGrid, StackDivider, useColorModeValue, Heading, Grid, GridItem } from '@chakra-ui/react';
const Page = ({ history }) => {

    const uploadRef = useRef()
    const fileRef = useRef()

    const onUploadFile = (upload_file, destintionDirectory) => {
        uploadRef.current.uploadFile(upload_file, destintionDirectory)
    }

    const uploadFileCompleted = () => {
        fileRef.current.refreshFile()
    }

    return (
        <Fragment>
            <Stack mt={'20px'}>
                <div className="content">
                    <div id="main">
                        <div autoscroll="">
                            <FileManager ref={fileRef} uploadFileCallback={onUploadFile} />
                            <UploadManager ref={uploadRef} uploadFileCompleted={uploadFileCompleted} />
                        </div>
                    </div>
                </div>
            </Stack>
        </Fragment>
    )
}

export default Page