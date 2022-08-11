import React, { Fragment, ReactNode, useState, useEffect } from 'react';
import axios from "axios";
import { Box, Text, SimpleGrid, Input,
    Progress, Grid, GridItem, Container, VStack, Stack, Button, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image, Divider, Circle, HStack, Center, Icon ,Table, Thead, Tbody, Tr, Th, Td, chakra} from '@chakra-ui/react'
import { Link as ReachLink } from 'react-router-dom'

import { fetchApi, apiUrl } from 'actions/api'

import { FaCrown, FaDollarSign } from "react-icons/fa";
import StoragonIcon from "../../assets/images/logo/icon-storagon.png";
import metaMask from "../../assets/images/login/metaMask.png";
import { CheckIcon, NotAllowedIcon, LinkIcon, TriangleDownIcon, TriangleUpIcon  } from "@chakra-ui/icons";
import { useWeb3React } from "@web3-react/core";



//redux
import { useDispatch, useSelector } from 'react-redux'
import actions from './redux/action'
import authActions from 'pages/sessions/redux/action'
import { AccountStatusFilter, AccountTypeFilter, convertFilesize } from 'actions/constants'
import { useTable, useSortBy } from 'react-table'
import { useToastHook } from "../../components/Toast";

//utils
import { shortenAddress } from 'actions/utils';

//components
import DataDetails from '../../components/account/DataDetails'
import AccountLimitations from 'components/account/AccountLimitations';
import Billing from '../accounts/Billing'


const { getPlan, getBalance, getStorage, getStatistic, logOut, clearError, forgotPassword, loginMetaMask, getKeySign } = actions
const { getProfile } = authActions

export default function Overview() {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const userPlan = useSelector((state) => state.account.plan)
  const userBalance = useSelector((state) => state.account.balance)
  const userStorage = useSelector((state) => state.account.storage)
  const [isProcessingResendActivationEmail, setIsProcessingResendActivationEmail] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [affiliateModal, setAffiliateModal] = useState(false)

  useEffect(() => {
    dispatch(getProfile())
    dispatch(getPlan())
    dispatch(getBalance())
    dispatch(getStorage())
    return () => { }
  }, [])

  const applyAffiliate = () => {
    setAffiliateModal(true)
  }

  const closeAffiliateModal = () => {
    setAffiliateModal(false)
  }

  const submitAffiliate = (event) => {
    event.preventDefault()

    setFetching(true)
    fetchApi('post', 'clapi/user/applyToBecomeAffiliate/', { website_address: '' })
      .then((data) => {
        console.log({ data })
        setFetching(false)
        // if (data && data.error) {
        //     message.error(data.error)
        // } else {
        //     message.success('You have applied to become affiliate successfully, please wait for us to processing your application')
        // }
      })
      .catch((error) => {
        setFetching(false)
        console.log({ error })
      })
  }

  const resendActivationEmail = async () => {
      setIsProcessingResendActivationEmail(true)
      const response = await fetchApi('post', 'clapi/user/resendActivationEmail/', {})
      console.log({ response })
      setIsProcessingResendActivationEmail(false)
      // if(response){
      alert('Successful! Please check your email to confirm')

      // } else {
      //     alert('Failed! Please check your email again!')
      // }
  }

  const accountType = user ? AccountTypeFilter[user.profile.fields.account_type] : ''
  const accountStatus = user ? AccountStatusFilter[user.profile.fields.account_status] : ''

  const user_plan_id = user ? user.profile.fields.plan_id : 0
  const monthly_bandwidth = userPlan ? userPlan.planConfigDict[user_plan_id].download_bandwidth : 1
  const download_speed = userPlan ? userPlan.planConfigDict[user_plan_id].download_speed : 0
  const download_wait = (user_plan_id === 0) ? '30 seconds' : 'No wait'
  const access_premium_files = (user_plan_id === 0) ? 'No' : 'Yes'
  const access_premium_tools = (user_plan_id === 0) ? 'No' : 'Yes'
  const premiumStatus = (user_plan_id > 0) ? 'Premium' : 'User'
  const planExpired = user ? user.profile.fields.plan_expired : null
  const storageSpace = user ?  user.profile.fields.storage_space  : ''
  const email = user ? user.profile.fields.email : ''
  const userName = user ? user.profile.fields.full_name : ''
  const storageUsed = userStorage ? userStorage.storage_used : 0
  const bandwidthUsed = userStorage ? userStorage.download_bandwidth : 0
  const folder = userStorage ? userStorage.folder_count : 0
  const file = userStorage ? userStorage.file_count : 0

  const pointBalance = userBalance ? userBalance[1].fields.amount : 0

  return (
    <Fragment>
      <Flex
        justify={'center'}
      >
        <Container
          maxW={'1440px'}
          mr={{base: '0px', md: '10px'}}
          ml={{base: '0px', md: '60px'}}
        >
          <Grid
            gap={3}
            templateColumns='repeat(6, 1fr)'>
            <GridItem
              colSpan={{ base: 6, xl: 2 }}
              colStart={{ base: 1, md: 2 }}
              colEnd={{ md: 6 }}
            >
            <AccountDetails 
                Username={userName} 
                Email={email}
                EnableEditEmail={false}
                EditEmail={''}
                Status={accountStatus} 
                AccountType={accountType} 
            />
              <DataDetails 
                storageUsed={storageUsed} 
                bandwidthUsed={bandwidthUsed} 
                storageSpace={storageSpace} 
                monthlyBandwidth={monthly_bandwidth} 
                folder={folder} 
                file={file} />
              <WalletConection />
            </GridItem>
            <GridItem
              colSpan={{ base: 6, xl: 4 }}
              colStart={{ base: 1, md: 2 }}
              colEnd={{ md: 6 }}
            >
              <AccountLimitations 
                Bandwidth={monthly_bandwidth} 
                DownloadSpeed={download_speed} 
                DownloadWait={download_wait} 
                PremiumFile={access_premium_files} 
                PremiumTool={access_premium_tools} />
              <StatusInfo 
                premiumStatus={premiumStatus} 
                planExpired={planExpired} pointBalance={pointBalance} />
              {/* <BillingHistory /> */}
              {/* <Billing /> */}
            </GridItem>
          </Grid>
        </Container>
      </Flex>
    </Fragment>
  )
}



const StatusInfo = ({ premiumStatus, planExpired, pointBalance }) => {
    return (
        <SimpleGrid
            columns={{ base: 1, xl: 2 }}
            spacing={5}
            minH={'230px'}
        >
            <Grid
                gap={5}
                templateColumns='repeat(3, 1fr)'
                bgGradient={['linear(to-r, #FCAC76, #FBBC83, #F2A5B0, #E781E7)',
                ]}
                p={5}
                borderRadius={10}
                shadow={'md'}
                alignItems={'center'}
                spacing={5}>
                <GridItem
                    colSpan={{ base: 3, sm: 1 }}
                >
                    <VStack
                        width={'110px'}
                        height={'110px'}
                        textAlign={'center'}
                        ml={'auto'}
                        mr={'auto'}
                        justifyContent={'center'}
                        bgColor={'#FF7D74'}
                        borderRadius={'50%'}
                        borderColor={'white'}
                        borderWidth={'2px'}
                    >
                        <FaCrown size={'50px'} color={'white'} />
                    </VStack>
                </GridItem>

                <GridItem
                    colSpan={{ base: 3, sm: 2 }}
                    textAlign={{ base: 'center', sm: 'left' }}
                >
                    <Text color={'white'}>
                        Premium Status: {premiumStatus}
                    </Text>
                    <Text
                        my={2} color={'white'}>
                        Plan expired in: {planExpired}
                    </Text>
                    <Button
                        borderRadius={'20px'}
                        bgColor='white'
                        h={'30px'}
                        fontSize={'15px'}
                        color={'#FF7D74'}
                    >Extend your premium</Button>
                </GridItem>
            </Grid>
            <Grid
                bgGradient={'linear(to-r, #E37EE3, #8099FB, #8691FB, #9977FB)'}
                p={5}
                gap={5}
                templateColumns='repeat(3, 1fr)'
                borderRadius={10}
                shadow={'md'}
                alignItems={'center'}
                spacing={5}>
                <GridItem
                    colSpan={{ base: 3, sm: 1 }}
                >
                    <VStack
                        width={'110px'}
                        height={'110px'}
                        ml={'auto'}
                        mr={'auto'}
                        textAlign={'center'}
                        justifyContent={'center'}
                        bgColor={'#FF7D74'}
                        borderRadius={'50%'}
                        borderColor={'white'}
                        borderWidth={'2px'}
                    >
                        <FaDollarSign
                            size={'50px'} color={'white'}
                        />
                    </VStack>
                </GridItem>

                <GridItem
                    colSpan={{ base: 3, sm: 2 }}
                    textAlign={{ base: 'center', sm: 'left' }}
                >
                    <Text color={'white'}>
                        Point: {pointBalance}
                    </Text>
                    <Text
                        my={2} color={'white'}
                    >
                        You can use this point to exchange to premium.
                    </Text>
                    <Button
                        borderRadius={'20px'}
                        bgColor='white'
                        h={'30px'}
                        fontSize={'15px'}
                        color={'#FF7D74'}
                    >Exchange your premium</Button>
                </GridItem>
            </Grid>
        </SimpleGrid>
    )
}

const AccountDetails = ({ Username, Email, Status, AccountType, EnableEditEmail,EditEmail, onClick }) => {
  return (
    <Box
      my={5}
      backgroundColor={'white'}
      p={5}
      borderRadius={10}
      boxShadow='lg'
      minH={'370px'}
    >
      <Text
        fontSize={'17px'}
        fontWeight={'700'}>
        Account Details
      </Text>
      <Box>
        <Stack
          justifyContent={'space-between'}
          py={2}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box>
            <Text
              fontSize={'15px'}
              color={'#777777'}
            >Username</Text>
            <Text
              fontSize={'16px'}
              color={'black'}
            >{Username ? shortenAddress(Username) : ''}</Text>
          </Box>
        </Stack>
        <Stack
          justifyContent={'space-between'}
          py={2}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box>
            <Text
                fontSize={'15px'}
                color={'#777777'}
            >Email</Text>
            {
              EnableEditEmail ? 
                <Input  placeholder={EditEmail} size='sm' /> 
                : <Text fontSize={'16px'}
                      color={'black'}
                  >{Email ? Email : 'No Email'}</Text>
            }
          </Box>
          <Button
              borderRadius={'10px'}
              _hover={{bgColor:'#65A6DD'}
              }
              bgColor='#65A6FF'
              size={'sm'}
              color={'white'}
          >{EnableEditEmail ? 'Cancel' : 'Edit'}</Button>
        </Stack>
          <Stack
              justifyContent={'space-between'}
              py={2}
              direction={{ base: 'column', sm: 'row' }}
          >
              <Box>
                  <Text
                      fontSize={'15px'}
                      color={'#777777'}
                  >Status</Text>
                  <Text
                      fontSize={'16px'}
                      color={'black'}
                  >{Status}</Text>
              </Box>
              <Button
                  borderRadius={'10px'}
              _hover={{bgColor:'#65A6DD'}
              }
                  bgColor='#65A6FF'
                  size={'sm'}
                  color={'white'}
              >Resend</Button>
          </Stack>
          <Stack
              justifyContent={'space-between'}
              py={2}
              direction={{ base: 'column', sm: 'row' }}
          >
              <Box>
                  <Text
                      fontSize={'15px'}
                      color={'#777777'}
                  >Account Type</Text>
                  <Text
                      fontSize={'16px'}
                      color={'black'}
                  >{AccountType}</Text>
              </Box>
          </Stack>
          <Stack
            justifyContent={'space-between'}
            py={2}
          >

          {/* <Button 
            borderRadius={'20px'} 
            bgGradient={["linear(to-r, #d653c5, #e35cbb, #fd9385)"]} 
            color={'white'} 
            _hover={{
            bgGradient: ["linear(to-l, #d653c5, #e35cbb, #fd9385)"],
          }}
          >Update personal details</Button> */}

          </Stack>
          {/*  */}
      </Box>
    </Box>
  )
}

const WalletConection = () => {
    const [state, newToast] = useToastHook();
    const messageNotification = (message) => {
        newToast({ message: message, status: "success" });
    };

    const { library, chainId, account, activate, deactivate, active } =
        useWeb3React();
    const dispatch = useDispatch();

    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [network, setNetwork] = useState(undefined);
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    function asciiToHex(str) {
        if (!str) return "0x00";
        var hex = "";
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? "0" + n : n;
        }
        return "0x" + hex;
    }

    const signMessage = async (msg) => {
        if (!library) return;
        try {
            console.log("===signMessage");
            var hex_token = asciiToHex(msg);
            const signature = await library.provider.request({
                method: "personal_sign",
                params: [hex_token, account],
            });
            console.log({ msg: msg, signature: signature });
            dispatch(loginMetaMask(account.toLowerCase(), msg, signature));
            messageNotification("Connected to Storagon");
        } catch (error) {
            setError(error);
        }
    };

    const refreshState = () => {
        window.localStorage.setItem("provider", undefined);
        setNetwork("");
        setMessage("");
        setSignature("");
        setVerified(undefined);
    };

    const disconnect = () => {
        refreshState();
        deactivate();
        dispatch(logOut());
    };

    async function handleLoginMetaMask() {
        await axios.get(apiUrl + "/clapi/web3/web3auth/").then((res) => {
            const resData = res.data;
            console.log({ data: resData });
            if (resData.success) {
                signMessage(resData.token);
            }
        });
    }

    return (
        <Box
            my={5}
            bgGradient={["linear(to-b, #4DDEF0, #2C5FF3, #9426F5)"]}
            p={5}
            borderRadius={10}
            boxShadow='lg'
            minH={'230px'}
        >
            <Text
                fontSize={'17px'}
                fontWeight={'700'} color={'white'}>
                Wallet conection
            </Text>
            <VStack my={3} spacing={4} align="stretch">
                <Center>
                    <HStack >
                        <VStack>
                            <Circle size="60px" bg="white">
                                <Image
                                    src={StoragonIcon}
                                    objectFit={"cover"}
                                    boxSize={"40px"}
                                    mx={{ base: 2, lg: 5 }}
                                />
                            </Circle>
                            <Center color="white">Storagon</Center>
                        </VStack>

                        <Divider
                            variant="dashed"
                            width={"30px"}
                            borderColor="white"
                            borderWidth="1px"
                            orientation="horizontal"
                        />
                        <Circle size="30px" bg="#27BE27">
                            <Icon as={CheckIcon} boxSize={"10px"} color="white" />
                        </Circle>
                        <Divider
                            variant="dashed"
                            width={"30px"}
                            borderColor="white"
                            borderWidth="1px"
                            orientation="horizontal"
                        />
                        <VStack>
                            <Circle size="60px" bg="white">
                                <Image
                                    src={metaMask}
                                    objectFit={"cover"}
                                    boxSize={"40px"}
                                    mx={{ base: 2, lg: 5 }}
                                />
                            </Circle>
                            <Center color="white">Meta Mask</Center>
                        </VStack>
                    </HStack>
                </Center>
                <Center>
                    <HStack direction="row" spacing={4}>
                        <Button
                            leftIcon={<NotAllowedIcon />}
                            bg="white"
                            color="black"
                            size={'sm'}
                            onClick={disconnect}
                        >
                            <Box display={"flex"} alignItems={"center"} w={"full"}>
                                <Text fontSize={{ base: "15px", lg: "17px" }}>
                                    Disconnect
                                </Text>
                            </Box>
                        </Button>
                        {!isLoggedIn && (
                            <Button
                                leftIcon={<LinkIcon />}
                                bg="white"
                                color="black"
                                onClick={handleLoginMetaMask}
                            >
                                <Box
                                    display={"flex"}
                                    alignItems={"center"}
                                    w={"full"}
                                >
                                    <Text fontSize={{ base: "15px", lg: "17px" }}>
                                        Login by wallet
                                    </Text>
                                </Box>
                            </Button>
                        )}
                    </HStack>
                </Center>
            </VStack>
        </Box>
    )
}
const BillingHistory = () => {
    const data = React.useMemo(
        () => [
            {
                fromUnit: 'inches',
                toUnit: 'millimetres (mm)',
                factor: 25.4,
            },
            {
                fromUnit: 'feet',
                toUnit: 'centimetres (cm)',
                factor: 30.48,
            },
            {
                fromUnit: 'yards',
                toUnit: 'metres (m)',
                factor: 0.91444,
            },

        ],
        [],
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'ID',
            },
            {
                Header: 'Plan',
                accessor: 'Plan',
            },
            {
                Header: 'Bill Amount',
                accessor: 'Bill Amount',
            },
            {
                Header: 'Date',
                accessor: 'Date',
            },
            {
                Header: 'Bill ID',
                accessor: 'Bill ID',
            }
        ],
        [],
    )
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy)
    return (
      <Box
        my={5}
        backgroundColor={'white'}
        p={5}
        borderRadius={10}
        boxShadow='lg'
        minH={'230px'}
      >
        <Text
          fontSize={'17px'}
          fontWeight={'700'}>
          Billing history
        </Text>
        <Box>
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isNumeric={column.isNumeric}
                    >
                      {column.render('Header')}
                      <chakra.span pl='4'>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label='sorted descending' />
                          ) : (
                            <TriangleUpIcon aria-label='sorted ascending' />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <Tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                          <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                              {cell.render('Cell')}
                          </Td>
                      ))}
                  </Tr>)
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>

    )
}
