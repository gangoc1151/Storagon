import { extendTheme } from '@chakra-ui/react'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'

const colors = {
  main: {
    1: '#5A5A5A',
    2: '#2D4364',
    3: '#222D3A',
    4: '#C5645B'
  },
  text: {
    1: '#aaaaaa',
    2: '#67484e',
    3: '#eeeeee'
  },
  teal: {
    500: '#91D5FB'
  },
  gray: {
    500: 'rgba(201, 201, 201, 0.35)'
  }
}

const fonts = {
  body: 'Poppins',
  heading: 'Poppins'
}

export const theme = extendTheme({
  colors,
  fonts,
  styles: {
    global: () => ({
      body: {
        bgGradient: "linear(to-l, #d4ecff, #eaf5ff, #ffffff)"
      },
    }),
  }
})
