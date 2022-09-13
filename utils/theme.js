import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    colors: {
        brand: {
            100: '#7de3ff',
            200: '#4dd7ff',
            500: '#26ccfe',
            400: '#14b2e5',
            500: '#0085ab',
            600: '#006381',
            700: '#003c50',
            800: '#00161f',
        },
        brandLight: {
            //300: '#e4fbf9',
            //400: '#c4ede9',
            //500: '#a1e0db',
            //600: '#7dd4cb',
            /*400: '#5cc8bd',
            500: '#45afa4',
            600: '#348880',
            700: '#24615b',
            800: '#123b37',
            900: '#001512',*/
            300: '#e4fbf9',
            400: '#c4ede9',
            500: '#a1e1da',
            600: '#7cd5cb',
            700: '#5bc9bd',
            800: '#44b0a3',
            900: '#34897f',
            /*700: '#23615b',
            800: '#123b36',
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