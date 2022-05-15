import { ThemeProvider } from "@emotion/react";
import AppBar from "@mui/material/AppBar";
import { createTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Find from './Find.js';
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(31,59,109)",
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
          <Route exact path="/" element={<Find />} style={{overflowY:"scroll"}}/>
          <Route exact path="/:roomId" element={<Find />} style={{overflowY:"scroll"}}/>

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
