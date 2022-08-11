import React, { Fragment, useState, useEffect } from 'react'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Slider from 'react-slick'
import { Stack, Box, Icon, Heading, Divider, Text, Flex, HStack, Button, Center } from '@chakra-ui/react'
import { AiFillCloud, AiOutlineSync, AiFillLock } from 'react-icons/ai'
import header_bg from '../assets/images/header_alt-3_bg.jpg'
import { Link } from 'react-router-dom'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Page = ({ history }) => {

    return (
        <Stack spacing='0px'>
            <Header />
            <Stack spacing='0px' color='white'>
                <Stack
                    align='center'
                    backgroundColor='gray.1'
                    backgroundImage={header_bg}
                    backgroundRepeat='no-repeat'
                    backgroundPosition='bottom'
                    minHeight='490px'
                    padding='64px 0px 16px 0px'
                >
                    <Flex width='100%' maxWidth='1110px' align='center' spacing='16px'>
                        <Box marginRight='16px' bg='white' height='1px' flex={1} />
                        <Text color='white' fontSize='28px' fontWeight='500' textAlign='center'>Secure Cloud Storage</Text>
                        <Box marginLeft='16px' bg='white' height='1px' flex={1} />
                    </Flex>
                    <Stack
                        display='block'
                        height='200px'
                        width='90%' align='center' justify='center'
                    >
                        <Slider
                            infinite
                            slidesToScroll={1}
                            slidesToShow={1}
                            nextArrow={null}
                            prevArrow={null}
                            autoplay
                        >
                            <Box sx={{ display: 'flex !important', alignItems: 'center !important', justifyContent: 'center !important' }} height='200px'>
                                <Text textAlign='center' color='text.2' fontWeight='900' fontSize='40px'>{'YOUR FILES WHEREVER YOU ARE'}</Text>
                            </Box>
                            <Box sx={{ display: 'flex !important', alignItems: 'center !important', justifyContent: 'center !important' }} height='200px'>
                                <Text textAlign='center' color='text.2' fontWeight='900' fontSize='40px'>{'100% SAFE AND SECURE'}</Text>
                            </Box>
                        </Slider>
                    </Stack>

                    <Center fontSize='16px' fontWeight='600' padding='8px 32px' _hover={{ cursor: 'pointer' }} bg='transparent' color='white' border='1px solid white' borderRadius='4px' as={Link} to='/signup'>Get Started</Center>
                </Stack>
                <Stack width='100%' align='center' bg='white' padding='64px 0xp'>
                    <Heading fontSize='40px' color='main.1' fontWeight='900'>OUR FEATURES ARE UNBEATABLE</Heading>
                    <Flex justify='space-between' width='100%' maxWidth='1110px' direction={{ base: 'column', md: 'row' }} color='black'>
                        <Stack spacing='16px' textAlign='center' align='center' padding='32px 16px'>
                            <Icon as={AiFillCloud} color='main.4' boxSize='70px' />
                            <Text fontSize='18px' fontWeight='600'>All your media, anywhere you go</Text>
                            <Text fontSize='14px'>Storagon stores all your media and makes it available to you anytime you want it, anywhere you go, on any device you have. With Storagon your files are always with you.</Text>
                        </Stack>
                        <Stack spacing='16px' textAlign='center' align='center' padding='32px 16px'>
                            <Icon as={AiOutlineSync} color='main.4' boxSize='70px' />
                            <Text fontSize='18px' fontWeight='600'>Synchonize Your Files</Text>
                            <Text fontSize='14px'>Quickly and easily drag individual files to your folder app on your computer. It's a simple way to sync files straight to all your devices.</Text>
                        </Stack>
                        <Stack spacing='16px' textAlign='center' align='center' padding='32px 16px'>
                            <Icon as={AiFillLock} color='main.4' boxSize='70px' />
                            <Text fontSize='18px' fontWeight='600'>Complete Data Security</Text>
                            <Text fontSize='14px'>Unlike with other cloud storage providers, your data is encrypted & decrypted during transfer by your client devices only and never by us.</Text>
                        </Stack>
                    </Flex>
                </Stack>
            </Stack>
            <Footer />
        </Stack>
    )
}

export default Page