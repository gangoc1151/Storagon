import React from "react";
import {
  Box,
  Text,
  Stack,
  Progress
} from "@chakra-ui/react";

const DataDetails = ({ storageUsed, bandwidthUsed, storageSpace, monthlyBandwidth, folder, file }) => {
    return (
        <Stack
            borderRadius={10}
            boxShadow='lg'
            p={5}
            minH={'230px'}>
            <Text
                fontSize={'17px'}
                fontWeight={'700'}
            >Total Data</Text>
            <Box>
                <Text
                    fontSize={'15px'}
                >
                    Used space: {storageUsed} bytes of {storageSpace}
                </Text>
                <Progress
                    value={80}
                    h={3}
                    mt={2}
                    borderRadius={10} colorScheme={'green'} />
                <Box>
                    <Text
                        fontSize={'12px'}
                    >You have total of {folder} folders with {file} files inside</Text>
                </Box>
            </Box>
            <Box>
                <Text
                    fontSize={'15px'}>
                    Used bandwidth: {bandwidthUsed} bytes of {monthlyBandwidth} bytes
                </Text>
                <Progress
                    value={80}
                    h={3}
                    mt={2}
                    borderRadius={10}
                    colorScheme={'green'}
                />
            </Box>
        </Stack>
    )
}

export default DataDetails