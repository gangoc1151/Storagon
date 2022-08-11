import { Center, Divider, Flex, Link, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const Footer = ({ }) => {
    return (
        <Center bg='main.3'>
            <Stack maxWidth='1110px' width='100%' spacing='32px' padding='32px 0px 8px 0px' color='white'>
                <Flex justify='space-between' color='text.1' fontSize='12px'>
                    <Stack>
                        <Text fontSize='16px' color='white' fontWeight='500'>Company</Text>
                        <Link to="/about" target="_blank">About us</Link>
                        <Link to="/blog" target="_blank">Blog</Link>
                        <Link to="/devs" target="_blank">Developers</Link>
                    </Stack>

                    <Stack>
                        <Text fontSize='16px' color='white' fontWeight='500'>Tools</Text>
                        <Link to="">Sync Client</Link>
                        <Link to="">Mobile Apps</Link>
                        <Link to="/download-tool" target="_blank">Desktop Apps</Link>
                    </Stack>

                    <Stack>
                        <Text fontSize='16px' color='white' fontWeight='500'>Information</Text>
                        <Link to="/support" target="_blank">Support</Link>
                        <Link to="/takedown" target="_blank">Takedown Guidance</Link>
                        <Link to="/cprnotice" target="_blank">Copyright Notice</Link>
                    </Stack>

                    <Stack>
                        <Text fontSize='16px' color='white' fontWeight='500'>Legal</Text>
                        <Link to="/tos" target="_blank">Terms of Service</Link>
                        <Link to="/privacy" target="_blank">Privacy Policy</Link>
                        <Link to="/copyright" target="_blank">Copyright</Link>
                    </Stack>
                </Flex>
                <Divider />
                <Text textAlign='center'>© Copyright Storagon, all rights reserved. </Text>
            </Stack>
        </Center>
    )
}

export default Footer