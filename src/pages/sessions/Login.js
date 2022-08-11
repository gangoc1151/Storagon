import React, { Fragment, useEffect, useState, useRef } from "react";
import actions from "./redux/action";
import { useDispatch, useSelector } from "react-redux";

import {
  Stack,
  Button,
  Flex,
  Box,
  Center,
  Text,
  Image,
  SimpleGrid,
  Heading,
  Grid,
  GridItem,
  Circle,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { NotAllowedIcon, LinkIcon } from "@chakra-ui/icons";

import { CheckIcon } from "@chakra-ui/icons";
import {IoWalletOutline} from "react-icons/io5"
import { networkParams } from "../../networks";
import { toHex, truncateAddress } from "../../utils";
import { fetchApi, fetchApiLogin, apiUrl } from "actions/api";
import { takeLatest, put, call, fork } from "redux-saga/effects";
import axios from "axios";
import {
  VStack,
  useDisclosure,
  HStack
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { useWeb3React } from "@web3-react/core";
import { useToastHook } from "../../components/Toast";

//image
import metaMask from "../../assets/images/login/metamask.svg";
import WalletConnect from "../../assets/images/login/walletconnect.svg";
import CoinBase from "../../assets/images/login/Coinbase.svg";
import StoragonIcon from "../../assets/images/logo/icon-storagon.png";
import Token from "../../actions/token";

//component
import WalletConnectButton from "components/login/WalletConnetButton";
import WalletContent from "components/login/WalletContent";

//connector
import { connectors } from "../../connectors";

const { logOut, clearError, forgotPassword, loginMetaMask, getKeySign } =
  actions;

const Page = ({ history }) => {
  const [state, newToast] = useToastHook();

  const [showLogin, setShowLogin] = useState(true);
  
  const refForm = useRef(null);
  const dispatch = useDispatch();
  const fetching = useSelector((state) => state.auth.fetching);
  const errorString = useSelector((state) => state.auth.errorString);
  const successString = useSelector((state) => state.auth.successString);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();

  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const messageNotification = (message) => {
    newToast({ message: message, status: "success" });
  };

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  // Connect to wallet
  async function connect(connectorss) {
    if (connectorss == connectors.injected){
      const checkingMetaMask = handleEthereum()
      if (!checkingMetaMask) {
        window.open('https://metamask.app.link/dapp/app.storagon.io/login', '_blank')
      }
    }
    
    try {
      await activate(connectorss);
      setProvider("injected");
    } catch (ex) {
      console.log('error', ex);
    }
  }

  // async function testGetSign() {
  //   try {
  //     await activate(connectors.injected);
  //     setProvider("injected");
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  //   await axios.get(apiUrl + "/clapi/web3/web3auth/").then((res) => {
  //     const resData = res.data;
  //     console.log({ data: resData });
  //     if (resData.success) {
  //       signMessage(resData.token);
  //     }
  //   });
  // }

  // const handleNetwork = (e) => {
  //   const id = e.target.value;
  //   setNetwork(Number(id));
  // };

  // const handleInput = (e) => {
  //   const msg = e.target.value;
  //   setMessage(msg);
  // };

  // const switchNetwork = async () => {
  //   try {
  //     await library.provider.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: toHex(network) }],
  //     });
  //   } catch (switchError) {
  //     if (switchError.code === 4902) {
  //       try {
  //         await library.provider.request({
  //           method: "wallet_addEthereumChain",
  //           params: [networkParams[toHex(network)]],
  //         });
  //       } catch (error) {
  //         setError(error);
  //       }
  //     }
  //   }
  // };

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

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
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
      console.log('token: ', { data: resData });
      if (resData.success) {
        signMessage(resData.token);
      }
    });
  }
  
// checking metamask install
  function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      return true
    } else {
      return false
    }
  }

  return (
    <Fragment>
      <Flex
        direction="column"
        pl={{base: 0, md:'70px'}}
      >
        <VStack maxW={"full"} pt={5} pb={5} flexGrow={"1"}>
          <Grid
            templateColumns="repeat(5, 1fr)"
            spacing={{ base: 5, md: 10 }}
            mt={{base: 10, md: "auto"}}
            mb={{base: 10, md: "auto"}}
            px={5}
            maxW={"6xl"}
          >
            <GridItem colSpan={{ base: 5, md: 2 }} display={{base: 'none', md: 'block'}}>
              <WalletContent></WalletContent>
            </GridItem>
            <GridItem
              colSpan={{ base: 5, md: 3 }}
              // bg='blue.300'
              bgGradient={["linear(to-tr, #8C67FF, #FF97F5, #FFE7A5)"]}
              borderTopRightRadius={{ base: 27, md: 27 }}
              borderBottomRightRadius={27}
              borderTopLeftRadius={{base: 27, md: 0}}
              borderBottomLeftRadius={{ base: 27, md: 0 }}
              py={{base: 5, md: 0}}
            >
              <Stack spacing={4}>
                <Heading
                  fontSize={{ base: "xl", lg: "2xl" }}
                  pt={5}
                  px={5}
                  color={"white"}
                >
                  <Center>Wallet connection</Center>
                </Heading>
                <Box w={"full"} h={"1px"} bgColor={"white"} />
                {!active && (
                  <SimpleGrid
                    columns={{ base: 2 }}
                    spacing={5}
                    gridGap={{ base: "1", md: 2, lg: 5 }}
                    w={"full"}
                    alignItems="center"
                    px={5}
                    pb={3}
                  >
                    <WalletConnectButton
                      onClick={() => {
                        connect(connectors.injected);
                      }}
                      image={metaMask}
                      buttonLabel={'Meta Mask'}
                    />
                    <WalletConnectButton
                      onClick={() => {
                        connect(connectors.walletConnect);
                      }}
                      image={WalletConnect}
                      buttonLabel={'Wallet Connect'}
                    />
                    <WalletConnectButton
                      onClick={() => {
                        activate(connectors.coinbaseWallet);
                      }}
                      image={CoinBase}
                      buttonLabel={'CoinBase Wallet'}
                    />
                  </SimpleGrid>
                )}
                {active && (
                  <VStack spacing={4} align="stretch">
                    <Center>
                      <HStack mt="60px">
                        <VStack>
                          <Circle size={{base: "50px", sm: '60px', lg: "80px"}} bg="white">
                            <Image
                              src={StoragonIcon}
                              objectFit={"cover"}
                              boxSize={{base:"40px", sm: '50px', lg: "70px"}}
                              mx={{ base: 2, lg: 5 }}
                            />
                          </Circle>
                          <Center color="white" fontWeight={'bold'} fontSize={{base:'12px', sm: '15px'}}>Storagon</Center>
                        </VStack>
                        <Divider
                          variant="dashed"
                          width={{base: "40px", sm:'60px', lg: "80px"}}
                          borderColor="white"
                          borderWidth="1px"
                          orientation="horizontal"
                        />
                        <Circle size={{base: '40px', sm: "50px"}} bg="#27BE27">
                          <Icon as={CheckIcon} boxSize={{base: '20px', sm: "30px"}}color="white" />
                        </Circle>
                        <Divider
                          variant="dashed"
                          width={{base: "40px", sm:'60px', lg: "80px"}}
                          borderColor="white"
                          borderWidth="1px"
                          orientation="horizontal"
                        />
                        <VStack>
                          <Circle size={{base: "50px", sm: '60px', lg: "80px"}} bg="white">
                            <Icon
                              as={IoWalletOutline}
                              boxSize={{base:"40px", sm: '50px', lg: "70px"}}
                              mx={{ base: 2, lg: 5 }}
                              color={{base: '#862df4'}}
                            />
                          </Circle>
                          <Center color="white" fontWeight={'bold'} fontSize={{base:'12px', sm: '15px'}}>Your Wallet</Center>
                        </VStack>
                      </HStack>
                    </Center>
                    <Flex
                      justify="space-between"
                      width="100%"
                      maxWidth="1110px"
                      direction={{ base: "column", md: "row" }}
                      color="white"
                    >
                      <Stack
                        spacing="16px"
                        textAlign="center"
                        align="center"
                        padding="32px 16px"
                      >
                        <Text fontSize="14px">
                          Storagon stores all your media and makes it available to
                          you anytime you want it, anywhere you go, on any device
                          you have. With Storagon your files are always with you.
                        </Text>
                      </Stack>
                    </Flex>
                    <Center>
                      <Stack direction={{base:'column', sm: "row"}} spacing={4}>
                        <Button
                          leftIcon={<NotAllowedIcon />}
                          bg="white"
                          color="black"
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
                      </Stack>
                    </Center>
                  </VStack>
                )}
              </Stack>
            </GridItem>
          </Grid>
        </VStack>
      </Flex>
    </Fragment>
  );
};

export default Page;
