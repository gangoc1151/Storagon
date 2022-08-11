import React, { Fragment, useState, useEffect, useCallback } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../pages/sessions/redux/action'
import Footer from 'components/Footer'
import Header from 'components/Header'
import { Stack, Alert, AlertTitle, AlertIcon, CloseButton, InputGroup, FormLabel, Input, Button, Flex, Box, Center, Text, FormControl, Link, Checkbox, InputLeftElement, Icon } from '@chakra-ui/react'
import { HiOutlineMail, HiOutlineLockClosed, HiUser } from 'react-icons/hi'

const { signUp, clearError } = actions

const Page = ({ history }) => {
    const [error, setError] = useState(false)
    const [token, setToken] = useState(null)
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const fetching = useSelector(state => state.auth.fetching)
    const errorString = useSelector(state => state.auth.errorString)

    useEffect(() => {
        dispatch(clearError())

        return () => {
        }
    }, [])

    const onSignup = (event) => {
        event.preventDefault()

        if (password != confirmPassword) {
            setError(true)
            return
        } else {
            setError(false)
        }
        if (!token) {
            alert('Please confirm the reCaptcha')
            return
        }

        dispatch(signUp(username, password, email, token))
    }

    return (
        <Flex direction='column' minH='100vh'>
            <Header />
            <Center bg='white' flex={1}>
                <Box
                    spacing={8} mx='auto' maxW='lg'
                    bg='main.3'
                    zIndex={1000}
                    px={{ base: '4', md: '10' }}
                    py='16px'
                    shadow='base'
                    rounded={{ sm: 'lg' }}
                >
                    <form onSubmit={onSignup}>
                        <Stack spacing='24px' padding='16px'>
                            <Text width='100%' textAlign='center' color='white' fontSize='30px' fontWeight='500'>Create An Account</Text>
                            {errorString && errorString.length > 0 &&
                                <Alert status='error' style={{ marginBottom: 8 }}>
                                    <AlertIcon />
                                    <AlertTitle>{errorString}</AlertTitle>
                                    <CloseButton position='absolute' right='8px' top='8px' />
                                </Alert>
                            }
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement height='full'>
                                        <Icon as={HiUser} boxSize='16px' />
                                    </InputLeftElement>
                                    <Input placeholder='Username' _placeholder={{ color: 'text.3' }} height='55px' fontSize='14px' color='white' value={username} onChange={event => setUsername(event.target.value)} required />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement height='full'>
                                        <Icon as={HiOutlineLockClosed} boxSize='16px' />
                                    </InputLeftElement>
                                    <Input placeholder='Password' _placeholder={{ color: 'text.3' }} type='password' height='55px' fontSize='14px' color='white' value={password} onChange={event => setPassword(event.target.value)} required />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement height='full'>
                                        <Icon as={HiOutlineLockClosed} boxSize='16px' />
                                    </InputLeftElement>
                                    <Input placeholder='Confirm Password' _placeholder={{ color: 'text.3' }} type='password' height='55px' fontSize='14px' color='white' value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement height='full'>
                                        <Icon as={HiOutlineMail} boxSize='16px' />
                                    </InputLeftElement>
                                    <Input placeholder='Email' _placeholder={{ color: 'text.3' }} type='email' height='55px' fontSize='14px' color='white' value={email} onChange={event => setEmail(event.target.value)} required />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <Flex align='flex-start'>
                                    <Checkbox required boxSize='16px' />
                                    <Text marginLeft='8px' fontSize='14px' lineHeight='16px'>I have read and agree to the <Link href="/tos" target="_blank">{'Terms & Conditions'}</Link></Text>
                                </Flex>
                            </FormControl>
                            <ReCAPTCHA
                                sitekey="6LeAKwQTAAAAADQGSxeqaWehXOFJwuVIgWPEiQrX"
                                onChange={(value) => setToken(value)}
                            />
                            <Button height='55px' borderRadius='4px' bg='main.4' color='white' fontSize='16px' fontWeight='500' type='submit' isLoading={fetching}>Register</Button>

                        </Stack>
                    </form>
                </Box>
            </Center>
        </Flex>
    )
}

export default Page