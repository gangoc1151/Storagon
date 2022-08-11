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
                    <Text fontSize='28px' color='white' fontWeight='500' textAlign='center'>Copyright</Text>
                    <Box marginLeft='16px' bg='white' height='1px' flex={1} />
                </Flex>
                <Box sx={{ display: 'flex !important', alignItems: 'center !important', justifyContent: 'center !important' }} height='200px'>
                    <Text textAlign='center' color='white' fontWeight='900' fontSize='40px'>{'NOTICE OF ALLEGED INFRINGEMENT "NOTICE"'}</Text>
                </Box>
            </Stack>
            <Stack maxWidth='1110px' padding='32px' fontSize='16px' lineHeight='24px' letterSpacing='1px'>
                <p>We respect the copyright of others and require that users of our services comply with the laws of copyright. You are strictly prohibited from using our services to infringe copyright. You may not upload, download, store, share, display, stream, distribute, e-mail, link to, transmit or otherwise make available any files, data, or content that infringes any copyright or other proprietary rights of any person or entity. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us. If you believe that your content has been copied or used in a way that constitutes copyright infringement, please provide us with the following information:</p>
                <ol>
                    <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
                    <li>Identification of the copyrighted work claimed to have been infringed</li>
                    <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material including for example the uniform resource locator(s) (URL)</li>
                    <li>Your contact information, including your address, telephone number, and an email address</li>
                    <li>A statement by you that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
                    <li>A statement that the information in the notification is accurate, and, under penalty of perjury (unless applicable law says otherwise), that you are authorized to act on behalf of the copyright owner</li>
                </ol>
                <a href="/cprnotice" className="small button alert radius">You may submit notice here</a>
            </Stack>
        </AppScreenWrapper>
    )
}

export default Page