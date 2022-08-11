import React, { Fragment, useState, useEffect } from 'react'
import Footer from 'components/Footer'
import Header from 'components/Header'
import DownloadFile from 'containers/files/download_file'
import { Stack } from '@chakra-ui/react'

const Page = ({ history }) => {

    return (
        <Fragment>
          <Stack
            h={'100vh'}
            bgGradient={["linear(to-l, #d4ecff, #eaf5ff, #ffffff)"]}>
            <DownloadFile />
          </Stack>
        </Fragment>
    )
}

export default Page