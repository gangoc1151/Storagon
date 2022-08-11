import React, { useState } from 'react';
import { Link as ReachLink } from 'react-router-dom'
//chakra ui
import {
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  useDisclosure,
  Image,
  Stack,
  Collapse,
  IconButton,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider
} from '@chakra-ui/react';
//Logo
import logo from "../assets/images/logo/icon-storagon.svg"
import logotext from "../assets/images/logo/storagon-logo.svg"

//icons
import { IoFileTrayFullOutline, IoCloudCircleOutline, IoTrendingUpOutline } from "react-icons/io5";
import {RiBillLine} from 'react-icons/ri';
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdRedeem } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  HamburgerIcon,
  CloseIcon
} from '@chakra-ui/icons';
import {
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';




export default function SideBar({

}) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [Sidebar, openSidebar] = useState(false)

  return (
    <Box>
      {/* Destop Nav */}
      <Box minH="100vh" 
        float={'left'}
        pos={'fixed'}
        w={Sidebar ? '250px' : '70px'} 
        display={{base: 'none', md: 'block'}}  
        transition="all .5s ease-in-out"
        zIndex={10}
        bgGradient={["linear(to-b, #BE2EE1, #5388F1, #5B24F3)"]}
        _hover={{
          w: '250px'
        }}
        >
          <Icon
              cursor={'pointer'}
              display={Sidebar ? 'block': 'none'}
              fontSize={30}
              pos={'absolute'}
              as={GiHamburgerMenu}
              right={0}
              mr={'5px'}
              mt={'5px'}
              color='white'
            />
          <VStack
            py={'20px'}
             alignItems="center" justifyContent="center"
            // borderBottomColor={'gray.300'}
            // borderBottomWidth={'1px'}
            >
            <Image src={logo} boxSize={'40px'}></Image>
          </VStack>
        
          {LinkItems.map((link) => (
            <SideBarContent 
              key={link.name} 
              icon={link.icon}
              href={link.path}
              >
              {link.name}
            </SideBarContent>
          ))}
      </Box>

      {/* Mobile nav and header */}
      <Flex
          bgGradient={["linear(to-l, #d4ecff, #eaf5ff, #ffffff)"]}
          height="12"
          py={'10px'}
          pr={'10px'}
          pl={'2px'}
          borderBottomColor={'gray.300'}
          borderBottomWidth={'1px'}
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'flex-end' }}>
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
                bgGradient={["linear(to-b, #BE2EE1, #5388F1, #5B24F3)"]}
                borderColor={'gray.200'}
                
                color={'white'}>
                <MenuItem 
                  _focus={{
                    bg: 'transparent'
                  }}
                  _pressed={{
                    bg: 'transparent'
                  }}
                  as={Link} href='/profile'>
                    Profile
                </MenuItem>
                <MenuItem
                _focus={{
                    bg: 'transparent'
                  }} 
                   as={Link} href='/inbox'>
                    Inbox
                </MenuItem>
                <MenuDivider />
                <MenuItem
                _focus={{
                    bg: 'transparent'
                  }} 
                 onClick={onOpen}>
                    Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    </Box>
  );
}


const SideBarContent = ({ icon, href, children, ...rest }) => {
  return (
    <Link 
          
      style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}
      href={href}>
      <Flex
        mx={4}
        py={2}
        my={2}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        color={'white'}
        whiteSpace={'nowrap'}
        overflow={'hidden'}
        {...rest}>
        <Flex
          alignItems={'center'}
          justifyItems={'center'}>
          {icon && (
            <Icon
              fontSize={35}
              as={icon}
              color='white'
            />
          )}
          <Box
            mx={2}
            px={4}
            fontSize={'17px'}
            fontWeight={'bold'}
            >
            <Text>{children}</Text>
          </Box>
        </Flex>
      </Flex>
    </Link>
  );
};

const MobileNav = () => {

  return (
    <Stack
      bgGradient={["linear(to-b, #BE2EE1, #5388F1, #5B24F3)"]}
      p={4}
      color={'white'}
      display={{ md: 'none' }}>
        {LinkItems.map((navItem) => (
        <MobileNavItem key={navItem.name} {...navItem}/>
      ))}
    </Stack>
      
  )
}

const MobileNavItem = ({ name, icon, subLinks, path }) => {
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
        }}
        color={'white'}
        href={path}>
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
            // color={'gray.600'}
            >
            {name}
          </Text>
        </Flex>
      </Flex>
    </Stack>
  );
};


const LinkItems = [
  {
    name: 'Overview',
    icon: IoCloudCircleOutline,
    path: '/'
  },
  {
    name: 'File Management', 
    icon: IoFileTrayFullOutline,
    path: '/fm2'
  },
  {
    name: 'Billing history',
    icon: RiBillLine,
    path: '/billing'
  },
  {
    name: 'Statistic',
    icon: IoTrendingUpOutline,
    path: '/statistic'
  },
  {
    name: 'Report',
    icon: HiOutlineDocumentReport,
    path: '/report'
  },
  {
    name: 'Redeem',
    icon: MdRedeem,
    path: '/redeem'
  }
  
];
