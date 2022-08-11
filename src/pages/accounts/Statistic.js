import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import actions from './redux/action'
import Token from 'actions/token'

import { useTable, useSortBy } from 'react-table'
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box, Flex, Container, Text, Stack, TableContainer, TableCaption, Tfoot, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'

import DownloadSessions from '../../components/statistic/DownloadSessions'
import Overview from '../../components/statistic/Overview'

const { getStatistic, getDownloadSession } = actions

const Page = ({ history }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.currentUser)
    const userStatistic = useSelector(state => state.account.statistic)
    const userDownloadSession = useSelector(state => state.account.downloadSessions)
    const [fromDate, setFromDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'))
    const [type, setType] = useState('overview')
    const [perpage, setPerpage] = useState(25)

    useEffect(() => {
        getData(type, fromDate, toDate)

        return () => { }
    }, [])

    const getData = (view_type, from_date, to_date, page_size = perpage) => {
        if (view_type == 'overview') {
            dispatch(getStatistic(from_date, to_date))
        } else if (view_type == 'downloadSessions') {
            if (page_size === 0) {
                dispatch(getDownloadSession(from_date, to_date, null, null, user ? user.id : 0))
            } else {
                dispatch(getDownloadSession(from_date, to_date, 1, page_size, user ? user.id : 0))
            }

        }
    }

    const changeType = (view_type) => {
        setType(view_type)

        getData(view_type, fromDate, toDate)
    }

    const onChangeToDate = (event) => {
        setToDate(event.target.value)

        getData(type, fromDate, event.target.value)
    }

    const onChangeFromDate = (event) => {
        setFromDate(event.target.value)

        getData(type, event.target.value, toDate)
    }

    const onChangePerpage = (event) => {
        setPerpage(parseInt(event.target.value))

        getData(type, fromDate, toDate, parseInt(event.target.value))
    }

    const transactionStatsitic = userStatistic ? userStatistic : {}
    const downloadCounts = userDownloadSession && userDownloadSession.results ? userDownloadSession.results : []


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
                Header: 'To convert',
                accessor: 'fromUnit',
            },
            {
                Header: 'Into',
                accessor: 'toUnit',
            },
            {
                Header: 'Multiply by',
                accessor: 'factor',
                isNumeric: true,
            },
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data }, useSortBy)

    return (
        <Fragment>
            <Flex
                    justify={'center'}
                >
                <Container 
                    mt={'10px'}

                    maxW={'1450px'}
                    mr={{base: '0px', md: '10px'}}
                    ml={{base: '0px', md: '60px'}}>
                    <Tabs>
                        <TabList>
                        <Tab _selected={{ color: 'white', bg: 'blue.500', borderTopRadius: 5 }}>Overview</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blue.500', borderTopRadius: 5 }}>Download Sessions</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blue.500', borderTopRadius: 5 }}>Download Count Chart</Tab>
                        <Tab _selected={{ color: 'white', bg: 'blue.500', borderTopRadius: 5 }}>My Original User</Tab>
                        </TabList>

                        <TabPanels>
                        <TabPanel>
                            <Overview/>
                        </TabPanel>
                        <TabPanel>
                            <DownloadSessions />
                        </TabPanel>
                        <TabPanel>
                            <p>three!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>three!</p>
                        </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Container>
            </Flex>


            
            {/* <Flex>
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
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Flex> */}

        </Fragment>

    )
}

export default Page