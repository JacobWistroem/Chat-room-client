import { blue } from "@mui/material/colors";
import createTheme from "@mui/material/styles/createTheme";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[600]
        },
        secondary: {
            main: '#f50057'
        },
        text: {
            primary: '#3d3d3d',
            secondary: '#666666'
        }
    }
});

export default theme;