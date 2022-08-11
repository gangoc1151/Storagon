import moment from 'moment'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Token from '../actions/token'
import logo_icon from '../assets/images/logo/storagon-logo.svg'
import { useDispatch } from 'react-redux'
import {
    Flex,
    Image,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Center,
    HStack,
    Box,
    IconButton,
    Avatar,
    CloseButton,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    Button,
    MenuDivider,
    Stack,
    Collapse,
    AvatarBadge,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    SmallCloseIcon,
    ArrowForwardIcon
} from '@chakra-ui/icons';
import { IoFileTrayFullOutline, IoPersonCircleOutline } from "react-icons/io5";

import actions from 'pages/sessions/redux/action'

import logotext from "../assets/images/logo/storagon-logo.svg"
const { logOut } = actions

const MobileNav = () => {
    return (
        <Stack
            bg={'white'}
            p={4}
            display={{ md: 'none' }}>
            {LinkItems.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>

    )
}

const LinkItems = [
  {
    name: 'File Management',
    icon: IoFileTrayFullOutline,
    subLinks: [
        {
            name: 'File Management',
            path: '/fm2'
        }
    ]
  },
  {
      name: 'Profile',
      icon: IoPersonCircleOutline,
      subLinks: [
          {
              name: 'Overview',
              path: '/'
          },
          {
              name: 'Profile',
              path: '/profile'
          },
          {
              name: 'Billing history',
              path: '/billing'
          },
          {
              name: 'Statistic',
              path: '/statistic'
          },
          {
              name: 'Inbox',
              path: '/inbox'
          },
          {
              name: 'Report',
              path: '/report'
          },
          {
              name: 'Redeem',
              path: '/redeem'
          },
      ]
  }
];

const MobileNavItem = ({ name, icon, subLinks }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={subLinks && onToggle}>
      <Flex
        py={2}
        as={Link}
        justify={'space-between'}
        align={'center'}
        _hover={{
            textDecoration: 'none',
        }}>
        <Flex
          alignItems={'center'}
        >
          <Icon
            fontSize={30}
            _groupHover={{
                color: 'white',
            }}
            as={icon}
          />
          <Text
              px={5}
              fontWeight={600}
              color={'gray.600'}>
              {name}
          </Text>
        </Flex>

        {subLinks && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>
      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
              mt={2}
              pl={4}
              borderLeft={1}
              borderStyle={'solid'}
              borderColor={'gray.200'}
              align={'start'}>
              {subLinks &&
                  subLinks.map((child) => (
                      <Link key={child.name} py={2} href={child.path}>
                          {child.name}
                      </Link>
                  ))}
          </Stack>
      </Collapse>
    </Stack>
  );
};


const Header = ({ history }) => {
    const user = Token.getUser()
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    const cancelRef = React.useRef()
    let is_authenticated = true
    if (user && user.profile && user.profile.fields && user.profile.fields.plan_expired) {
        is_authenticated = true
    }

    const logout = () => {
        dispatch(logOut())
    }

    return (

        <Flex
            bgGradient={["linear(to-l, #d4ecff, #eaf5ff, #ffffff)"]}
            height="12"
            alignItems="center"
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
        >
            {/* <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Logout Account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You want to log out.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={onClose} ml={3}>
                                Logout
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog> */}
            <Box>
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    variant="outline"
                    aria-label="open menu"
                    onClick={onToggle}
                    icon={
                        isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                    }
                />
                <Box
                    position='absolute'
                    w='full'
                    zIndex={1000}
                >
                    <Collapse in={isOpen} animateOpacity>
                        <MobileNav />
                    </Collapse>
                </Box>
            </Box>
            <Image
                src={logotext} w='120px'
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
            </Image>
            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    color={'#3ebbee'}
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    bgGradient={'linear(to-r, #E37EE3, #8099FB)'}
                                    size={'sm'}
                                    src={
                                        '#'
                                    }
                                    right="1"
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="xs" color="gray.600">
                                        Account
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem as={Link} href='/'>
                                Profile
                            </MenuItem>
                            <MenuItem as={Link} href='/statistic'>
                                Inbox
                            </MenuItem>
                            {/* <MenuItem>Billing</MenuItem> */}
                            <MenuDivider />
                            <MenuItem onClick={onOpen}>
                                Sign out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>


        </Flex>

    )

}

export default Header