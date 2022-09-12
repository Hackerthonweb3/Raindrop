import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    colors: {
        brand: {
            50: '#7de3ff',
            100: '#4dd7ff',
            200: '#26ccfe',
            300: '#14b2e5',
            400: '#0085ab',
            500: '#006381',
            600: '#003c50',
            700: '#00161f',
        },
        brandLight: {
            300: '#e4fbf9',
            400: '#c4ede9',
            500: '#a1e0db',
            600: '#7dd4cb',
            /*400: '#5cc8bd',
            500: '#45afa4',
            600: '#348880',
            700: '#24615b',
            800: '#123b37',
            900: '#001512',*/
        },
        yellow: {
            50: '#fffadb',
            100: '#fef1af',
            200: '#fce880',
            300: '#fade4f',
            400: '#f9d520',
            500: '#dfbb06',
            600: '#ae9200',
            700: '#7c6800',
            800: '#4a3e00',
            900: '#1b1500',
        }
    },
    fonts: {
        body: `'DM Sans', sans-serif`,
        inter: `'Inter', sans-serif`
    }
})