import React from "react";
import {
  Box,
  Text,
  VStack,
  CircularProgress, CircularProgressLabel,
  SimpleGrid, GridItem
} from "@chakra-ui/react";

const AccountLimitations = ({ Bandwidth, DownloadSpeed, DownloadWait, PremiumFile, PremiumTool }) => {
    return (
        <Box
            my={5}
            backgroundColor={'white'}
            p={5}
            borderRadius={10}
            boxShadow='lg'
            minH={'370px'}
        >
            <Text fontSize={'17px'}
                fontWeight={'700'}>Account Limitations</Text>
            <SimpleGrid my={5}
                columns={{ base: 2, sm: 2, lg: 3, xl: 5 }} >
                <GridItem >
                    <AccountLimitItem
                        innerColor={'#0184FE'}
                        outerColor={'#CBE8FF'}
                        label={Bandwidth}
                        catergory={'Monthly Bandwidth'}
                    />
                </GridItem>
                <GridItem >
                    <AccountLimitItem
                        innerColor={'#E96182'}
                        outerColor={'#FFE5E9'}
                        label={DownloadSpeed}
                        catergory={'Download Speed'}
                    />
                </GridItem>
                <GridItem >
                    <AccountLimitItem
                        innerColor={'#20CACB'}
                        outerColor={'#E1FFFF'}
                        label={DownloadWait}
                        catergory={'Download Wait'}
                    />
                </GridItem>
                <GridItem >
                    <AccountLimitItem
                        innerColor={'#5767F2'}
                        outerColor={'#E5E8FF'}
                        label={PremiumFile}
                        catergory={'Premium files'}
                    />
                </GridItem>
                <GridItem >
                    <AccountLimitItem
                        innerColor={'#DA82FF'}
                        outerColor={'#F8E4FF'}
                        label={PremiumTool}
                        catergory={'Premium tools'}
                    />
                </GridItem>
            </SimpleGrid>
        </Box>

    )
}

const AccountLimitItem = ({
    innerColor, outerColor, label, catergory
}) => {
    return (
        <VStack mx={1}
            my={2}>
            <CircularProgress value={100} color={outerColor} thickness='5px' size={{base: '130px', sm: '150px'}} >
                <CircularProgressLabel>
                    <VStack>
                        <VStack
                            width= {{base: '90px', sm: '110px'}}
                            height= {{base: '90px', sm: '110px'}}
                            textAlign={'center'}
                            justifyContent={'center'}
                            bgColor={outerColor}
                            borderRadius={'50%'}
                            borderColor={innerColor}
                            borderWidth={'2px'}
                        >
                            <Text
                                m={2}
                                fontSize={{base: '13px', sm: '15px'}}
                                fontWeight={{base: '600', sm: '700'}}
                                color={innerColor}
                            >{label}</Text>
                        </VStack>
                    </VStack>

                </CircularProgressLabel>
            </CircularProgress>
            <Text
                bgColor={outerColor}
                color={innerColor}
                fontSize={{base: '12px', sm: '14px'}}
                fontWeight={{base: '600', sm: '700'}}
                mx={2}
                p={2}
                my={2}
                textAlign={'center'}
                borderRadius={'15px'}>
                {catergory}
            </Text>
        </VStack>
    )
}

export default AccountLimitations