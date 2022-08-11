import React, { Fragment, useState, useEffect } from 'react'

import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box, Flex, Text, Stack, TableContainer, Tfoot, Heading } from '@chakra-ui/react'

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Overview = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <Box>
      <Flex
        justifyContent={'space-between'}
      >
        <Heading 
          fontSize={'30px'}
          color={'blackAlpha.700'}>Overview</Heading>
        <Stack direction={{base: 'column', md: 'row'}}>
          <Stack
            mx={2}>
            <Text>From</Text>
            {/* https://www.npmjs.com/package/react-datepicker */}
            <Box
              border={'1px solid'}
              borderColor={'blackAlpha.300'}
              borderRadius={5} p={1}>
              <DatePicker
                selected={startDate} 
                onChange={(date) => setStartDate(date)} />
            </Box>
          </Stack>
          <Stack
            mx={2}>
            <Text>To</Text>
            <Box
              border={'1px solid'}
              borderColor={'blackAlpha.300'}
              borderRadius={5} p={1}>
              <DatePicker 
                selected={endDate} 
                onChange={(date) => setEndDate(date)} />
            </Box>
            
          </Stack>
        </Stack>
      </Flex>
      <Box 
        my={2}
        h={'1px'}
        w={'full'}
        bgColor={'blackAlpha.200'}
      />
      <TableContainer>
        <Table >
          <Thead>
            <Tr >
              <StatisticTh>Date</StatisticTh>
              <StatisticTh>Downloads</StatisticTh>
              <StatisticTh>Premium Sales</StatisticTh>
              <StatisticTh>Re-bills</StatisticTh>
              <StatisticTh>Site Sales</StatisticTh>
              <StatisticTh>Referrals</StatisticTh>
              <StatisticTh>Referrals PPD</StatisticTh>
              <StatisticTh>Total</StatisticTh>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td border={'1px solid'}>2022-05-02</Td>
              <Td border={'1px solid'}>0/0$</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0</Td>
            </Tr>
            <Tr>
              <Td border={'1px solid'}>2022-05-02</Td>
              <Td border={'1px solid'}>0/0$</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0</Td>
            </Tr>
            <Tr>
              <Td border={'1px solid'}>2022-05-02</Td>
              <Td border={'1px solid'}>0/0$</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0</Td>
            </Tr>
            <Tr>
              <Td border={'1px solid'}>2022-05-02</Td>
              <Td border={'1px solid'}>0/0$</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0 / 0</Td>
              <Td border={'1px solid'}>0</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr _last={{borderBottom: '1px solid'}}>
              <StatisticTh>2022-05-02</StatisticTh>
              <StatisticTh>0/0$</StatisticTh>
              <StatisticTh>0 / 0</StatisticTh>
              <StatisticTh>0 / 0</StatisticTh>
              <StatisticTh>0 / 0</StatisticTh>
              <StatisticTh>0 / 0</StatisticTh>
              <StatisticTh>0 / 0</StatisticTh>
              <StatisticTh>0</StatisticTh>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  )
}

const StatisticTh = chakra(Th, {
  baseStyle: {
    fontSize: '15px',
    border: '1px solid'
    
  }
})
const StatisticTd = chakra(Td, {
  baseStyle: {
    fontSize: '15px',
    border: '1px solid'
  },
})
export default Overview