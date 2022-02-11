import { ThemeProvider } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import { createTheme, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Find from './Find.js';
import MainPage from "./MainPage.js";
import TourPage from './TourPage.js';
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(0,73,144)",
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="h6">Virtual Campus Guide</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
      <Router>
        
        <Routes>
          <Route exact path="" element={<MainPage />} style={{overflow:"hidden"}}/>
          <Route exact path="/tour" element={<TourPage />} />
          <Route exact path="/tour/find" element={<Find />} style={{overflowY:"scroll"}}/>
          <Route exact path="/tour/find/:roomId" element={<Find />} style={{overflowY:"scroll"}}/>

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
