import React from 'react'
import QRCode from "react-qr-code";

import {
  Stack,
  FormLabel,
  Button,
  Text,
  FormControl,
  useColorModeValue,
  Heading,
  VStack,
  HStack,
  Switch
} from "@chakra-ui/react";

const QRCodeComponent = () => {
    return (
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
          QR code
        </Heading>
        <VStack>
          <QRCode value="https://app.storagon.io/" size={150} level={'L'}/>
        </VStack>
        <FormControl display='flex' alignItems='center' justifyContent={'space-between'}>
          <FormLabel htmlFor='email-alerts' mb='0' fontWeight={'bold'}>
            Enable QR code
          </FormLabel>
          <Switch id='email-alerts' />
        </FormControl>
        <HStack alignItems='center' justifyContent={'space-between'} >
          <Stack>
            <Text fontWeight={'bold'} fontSize={'md'}>QR code link</Text>
            <Text fontSize={'13px'} color={'gray.400'}>https://app.storagon.io/</Text>
          </Stack>
          <Button>Copy Link</Button>
        </HStack>
        
      </Stack>
    )
}

export default QRCodeComponent