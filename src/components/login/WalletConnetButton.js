import React from "react";
import {
  Button,
  Box,
  Text,
  Image,
  VStack,
  Stack
} from "@chakra-ui/react";

const WalletConnectButton = ({onClick, image, buttonLabel}) => {
  return (
    <>
      <Button
        h={"160px"}
        borderRadius="10px"
        color="#F68211"
        onClick={onClick}
        bgColor={'rgba(255, 255, 255, 0.5);'}
        _hover={{
          bgColor: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Stack
          w={'full'}
          h={'full'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <VStack
            w={'55px'}
            h={'55px'}
            justifyContent={'center'}
            bg={'white'}
            mx={5}
            borderRadius={'full'}
          >
            <Image
                src={image}
                objectFit={"contain"}
                boxSize={"40px"}
                opacity={'100%'}
            />
          </VStack>
          
          <Text
            
           fontSize={{ base: "15px", lg: "17px" }}>
              {buttonLabel}
          </Text>
        </Stack>
    </Button>
    </>
  )
}

export default WalletConnectButton