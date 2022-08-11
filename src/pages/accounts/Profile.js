import React, { Fragment, useState, useEffect } from 'react'
import QRCode from "react-qr-code";
import Profile from 'containers/accounts/profile'
import {
  Stack,
  Alert,
  AlertTitle,
  AlertIcon,
  CloseButton,
  InputGroup,
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
  Center,
  Text,
  FormControl,
  Image,
  Container,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Heading,
  Grid,
  GridItem,
  Circle,
  Divider,
  Icon,
  VStack,
  HStack,
  InputRightElement,
  Link,
  Avatar,
  AvatarBadge,
  IconButton,
  Drawer,
  DrawerContent,
  Switch
} from "@chakra-ui/react";
import { SmallCloseIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import SideBar from 'components/SideBarWithHeader'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import loading from '../../assets/images/loading.gif'

import actions from './redux/action'
import authActions from 'containers/sessions/redux/action'
import Token from 'actions/token'

//component
import QrCodeComponent from "../../components/profile/QrCodeComponent"

const { getProfile, updateProfile } = authActions

const Page = ({ history }) => {
  const dispatch = useDispatch()
  const user = Token.getUser()
  const fetching = useSelector(state => state.auth.fetching)

  const [fullname, setFullname] = useState(Object.keys(user).length ? user.profile.fields.full_name : '')

  const [walletAddress, setwalletAddress] = useState(Object.keys(user).length ? user.profile.fields.full_name : '')

  const [enableEditUser, setEnableEditUser] = useState(true)
  const [enableEditEmail, setEnableEditEmail] = useState(true)


  const [email, setEmail] = useState(Object.keys(user).length ? user.profile.fields.email : '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    dispatch(getProfile())

    return () => { }
  }, [])

  onsubmit = (event) => {
    event.preventDefault()

    if (newPassword != confirmPassword) {
      message.error('New password and confirm new password are not match')
      return
    }
    dispatch(updateProfile({ full_name: fullname, email: email, old_password: currentPassword, password: newPassword }))
  }
  

  return (
    <Fragment>
      <Box>
        <Flex
          align={'center'}
          justify={'center'}
          >
          <VStack
            mt={'100px'}
            direction="column"
            align={'center'}
            justify={'center'}
            spacing='4'
          > 
            <SimpleGrid columns={{base: 1, lg: 2}} spacing={10} >
              <Stack>
                <Stack
                  spacing={4}
                  w={'full'}
                  maxW={'md'}
                  bg={useColorModeValue('white', 'gray.700')}
                  rounded={'xl'}
                  boxShadow={'lg'}
                  p={6}
                >
                  <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile
                  </Heading>
                  <FormControl id="userName">
                    <Stack direction={['column', 'row']} spacing={6}>
                      <Center>
                        <Avatar size="xl" src="#">
                          <AvatarBadge
                            as={IconButton}
                            size="sm"
                            rounded="full"
                            top="-10px"
                            colorScheme="red"
                            aria-label="remove Image"
                            icon={<SmallCloseIcon />}
                          />
                        </Avatar>
                      </Center>
                      <Center w="full">
                        <Button w="full">Change profile image</Button>
                      </Center>
                    </Stack>
                  </FormControl>
                  <FormControl id="userName" isRequired>
                    <FormLabel>Wallet address</FormLabel>
                    <Input
                      placeholder="UserName"
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      value={walletAddress} 
                      isReadOnly={true}
                      onChange={(event) => setFullname(event.target.value)}
                    />
                  </FormControl>
                  {/* <FormControl id="userName">
                    <FormLabel>
                      User Name 
                      <Button 
                        variant='link' 
                        color={'blue.500'}
                        onClick={() => setEnableEditUser(!enableEditUser)}
                      >Edit
                      </Button>
                    </FormLabel>
                    <Input
                      placeholder="Enter user name"
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      // isDisabled={enableEditUser}
                      value={fullname}
                      onChange={(event) => setFullname(event.target.value)}
                    />
                  </FormControl> */}
                  <FormControl id="email">
                    <FormLabel>
                      Email address 
                      {/* <Button 
                        variant='link' 
                        color={'blue.500'}
                        onClick={() => setEnableEditEmail(!enableEditEmail)}
                      >
                        Edit
                      </Button> */}
                    </FormLabel>
                    <Input
                      placeholder="your-email@example.com"
                      _placeholder={{ color: 'gray.500' }}
                      type="email"
                      // isDisabled={enableEditEmail}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </FormControl>
                </Stack>
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}>

                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      w="full"
                      _hover={{
                        bg: 'blue.500',
                      }}
                      onClick={onsubmit} type="submit"
                    >
                      Update
                    </Button>
                  </Stack>
              </Stack>
              <Stack>
                <QrCodeComponent/>
                <Stack
                  spacing={4}
                  w={'full'}
                  maxW={'md'}
                  bg={useColorModeValue('white', 'gray.700')}
                  rounded={'xl'}
                  boxShadow={'lg'}
                  p={6}
                >
                  <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Subscription
                  </Heading>
                  <FormControl id="subscription">
                    <FormLabel>Subscription</FormLabel>
                    <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                      <GridItem colSpan={2} h='10'>
                        <Button rounded={'full'} border='2px'
                          borderColor='Black.500' colorScheme='white' variant='outline'>Free User</Button>
                      </GridItem>
                      <GridItem colStart={4} colEnd={6} h='10'>
                        <Link href='https://storagon.io/pricing/' isExternal>
                          <Button bgGradient={["linear(to-r, #d653c5, #e35cbb, #fd9385)"]} color={'white'} _hover={{
                            bgGradient: ["linear(to-l, #d653c5, #e35cbb, #fd9385)"],
                          }}
                          >Upgrade to Pro</Button>
                        </Link>

                      </GridItem>
                    </Grid>

                  </FormControl>
                  <Link href='https://storagon.io/pricing/' isExternal>
                    <Button w='full' >See The Pro Benefits <ArrowForwardIcon /> </Button>
                  </Link>

                </Stack>
                
              </Stack>
            </SimpleGrid>
          </VStack>
        </Flex>
      </Box>



    </Fragment>


  )
}

const ChangePassword = () => {
      {/* <FormControl id="email">
      <FormLabel>Current password</FormLabel>
      <Input
        placeholder="Current password"
        _placeholder={{ color: 'gray.500' }}
        type="password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
      />
    </FormControl>
    <FormControl id="password" isRequired>
      <FormLabel>New password</FormLabel>
      <Input
        placeholder="New password"
        _placeholder={{ color: 'gray.500' }}
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
      />
    </FormControl>
    <FormControl id="confirm_password" isRequired>
      <FormLabel>Confirm new password</FormLabel>
      <Input
        placeholder="confirm Password"
        _placeholder={{ color: 'gray.500' }}
        type="password"
        value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
      />
    </FormControl> */}
}

export default Page