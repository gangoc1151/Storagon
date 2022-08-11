import React from 'react'
import AppScreenWrapper from 'components/AppScreenWrapper'
import { Link, Stack, Text, Flex, Box, Spacer } from '@chakra-ui/react'
import header_bg from '../../assets/images/header_alt-3_bg.jpg'

const Page = ({ history }) => {

    return (
        <AppScreenWrapper>
            <Stack
                align='center'
                backgroundColor='gray.1'
                backgroundImage={header_bg}
                backgroundRepeat='no-repeat'
                backgroundPosition='bottom'
                minHeight='490px'
                padding='64px 0px 16px 0px'
                width='100%'
            >
                <Flex width='100%' maxWidth='1110px' align='center' spacing='16px'>
                    <Box marginRight='16px' bg='white' height='1px' flex={1} />
                    <Text fontSize='28px' color='white' fontWeight='500' textAlign='center'>About Us</Text>
                    <Box marginLeft='16px' bg='white' height='1px' flex={1} />
                </Flex>
                <Box sx={{ display: 'flex !important', alignItems: 'center !important', justifyContent: 'center !important' }} height='200px'>
                    <Text textAlign='center' color='white' fontWeight='900' fontSize='40px'>{'Privacy Company'}</Text>
                </Box>
            </Stack>
            <Stack maxWidth='1110px' padding='32px' fontSize='16px' lineHeight='24px' letterSpacing='1px'>
                <Text>When we launched Storagon early 2015, global mass surveillance by rogue governments under the pretext of fighting terrorism
                    was still a wild conjecture and its proponents were often touted as conspiracy theorists.
                    Anything short of <i>security by design</i> ("we cannot gain access to your data without you being able to find out"),
                    for which strong end-to-end encryption is an essential prerequisite, now seems grossly insufficient.</Text>
                <Spacer />
                <Text>
                    Storagon was architected around the simple fact that cryptography, for it to be accepted and used, must not interfere with usability.
                    Storagon is fully accessible without prior software installs and remains the only cloud storage provider with browser-based high-performance end-to-end encryption.
                    The only visible signs of the crypto layer operating under Storagon's hood are the entropy collection during signup, the lack of a password reset feature and the novel (and browser-specific) ways file transfers are conducted.
                    Today, millions of business and personal users rely on Storagon to securely and reliably store and serve petabytes of data and we believe that this success is the result of Storagon's low barrier to entry to a more secure cloud.
                </Text>
                <Spacer />
                <Text>We are constantly hiring. If you are an outstanding software engineer and would like to join our global team, please do not hesitate to submit your CV to <Link color='blue' href="mailto:jobs@storagon.com">jobs@storagon.com</Link></Text>
            </Stack>
        </AppScreenWrapper>
    )
}

export default Page