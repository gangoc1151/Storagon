import React, { Fragment, useState, useEffect } from 'react'

import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box, Flex, Text, Stack, TableContainer, Tfoot, Heading, Button } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

import {ChevronDownIcon} from '@chakra-ui/icons'

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DownloadSessions = () => {
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
      <Flex
        alignItems={'center'}
      >
        <Menu 
        >
          <MenuButton  
            mt={'25px'} 
            p={2}
            transition='all 0.2s'
            borderRadius='md'
            borderWidth='1px'
            _hover={{ bg: 'gray.400' }}
            _expanded={{ bg: 'blue.400' }}
            _focus={{ boxShadow: 'outline' }} 
           >
            Actions<ChevronDownIcon />
          </MenuButton>
          <MenuList>
            <MenuItem>Download</MenuItem>
            <MenuItem>Create a Copy</MenuItem>
            <MenuItem>Mark as Draft</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Attend a Workshop</MenuItem>
          </MenuList>
        </Menu>
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
      </Flex>
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
            <Th>Date</Th>
            <Th>Downloads</Th>
            <Th>Premium Sales</Th>
            <Th>Re-bills</Th>
            <Th>Site Sales</Th>
            
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td >2022-05-02</Td>
            <Td >0/0$</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>
          </Tr>
          <Tr>
            <Td >2022-05-02</Td>
            <Td >0/0$</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>

          </Tr>
          <Tr>
            <Td >2022-05-02</Td>
            <Td >0/0$</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>

          </Tr>
          <Tr>
            <Td >2022-05-02</Td>
            <Td >0/0$</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>
            <Td >0 / 0</Td>

          </Tr>
        </Tbody>
        <Tfoot>
          <Tr >
            <Th>2022-05-02</Th>
            <Th>0/0$</Th>
            <Th>0 / 0</Th>
            <Th>0 / 0</Th>
            <Th>0 / 0</Th>
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
export default DownloadSessions