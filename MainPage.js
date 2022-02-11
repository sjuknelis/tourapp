import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";
export default function MainPage() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <div>
      
        <img
          src="https://www.nobles.edu/wp-content/uploads/2021/10/Castle-Fall-2-e1635168887611.jpg"
          style={{ width: "100%", height: "100vh",objectFit:"cover"}}
          alt="The Castle"
        />
      <div style={{position:"absolute",top:"50%",left:"50%"}}>
      <Button
        variant="contained"
        color="primary"
        endIcon={<ArrowForwardIosIcon />}
        style={{
          position: "absolute",
          top: "50%",
          left: "calc(50% - 100px)",
          width: "200px",
          height: "50px",
        }}
        href="/tour"
      >
        Start the tour
      </Button>
      </div>
    </div>
  );
}
