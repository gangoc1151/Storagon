import React from 'react'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { Flex, Stack } from '@chakra-ui/react'

const AppScreenWrapper = ({ children }) => {

    return (
        <Flex direction='column' minH='100vh'>
            <Header />
            <Stack spacing='0px' flex={1} align='center' width='100%'>
                {children}
            </Stack>
            <Footer />
        </Flex>
    )
}

export default AppScreenWrapper