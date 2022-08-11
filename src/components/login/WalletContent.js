import React from "react";
import {
  Stack,
  Box,
  Text,
  Image,
  Heading,
  Circle,
  Divider,
  VStack,
   HStack

} from "@chakra-ui/react";
import LoginImage from "../../assets/images/login/login-image.png";

const WalletContent = () => {
  return (
    <>
      <Stack
        justifyContent="center"
        bgGradient={["linear(to-b, #4DDEF0, #2C5FF3, #9426F5)"]}
        borderTopLeftRadius={27}
        borderBottomLeftRadius={{ base: 0, md: 27 }}
        borderTopRightRadius={{ base: 27, md: 0 }}
        py={10}
        px={5}
      >
        <VStack>
          <Image
            src={LoginImage}
            objectFit={"contain"}
            boxSize={{ base: '200px',md: "300px" }}
          />
        </VStack>

        <Box>
          <Heading color="white" fontSize={{base: '20px', md:"30px"}}>
            Connect Your Wallet
          </Heading>
        </Box>
        <Box>
          <Text color="white" fontSize={"14px"}>
            Create a cloud account for relay server access, and manage
            your wallet or your files.
          </Text>
        </Box>
        <HStack py={5} px={1}>
          <Circle size="10px" bg="white"></Circle>
          <Divider
            width={"60px"}
            borderColor="white"
            orientation="horizontal"
          />
          <Circle size="10px" bg="white"></Circle>
          <Divider
            width={"60px"}
            borderColor="white"
            orientation="horizontal"
          />
          <Circle size="10px" bg="white"></Circle>
        </HStack>
      </Stack>
    </>
  )
}

export default WalletContent