import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
export default function TourPage() {
  const theme = useTheme();
  const height = theme.mixins.toolbar.minHeight+50;
  return (
    <div
      style={{
        height: "calc(100vh - "+height+"px)",
        width: "100%"
      }}
    >
        <ButtonBase href="/tour/find" style={{width: "calc(100% - 30px)", height: "50%",margin:"15px"}}>
        <Card
          variant="outlined"
          
          style={{
            textDecoration:"none",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage:"url(https://testinnovators.com/sites/testinnovators.com/files/noblesandgreenough.jpg)",backgroundSize:"cover",backgroundPosition:"center"
          }}
        >
          <h1 style={{color:"rgb(0,73,144)"}}>Find my class</h1>
        </Card>
        </ButtonBase>
        
    </div>
  );
}
