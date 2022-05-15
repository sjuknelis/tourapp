import {
    Collapse, List, ListItem, ListItemText
} from "@mui/material";
import Text from "./Text.js";
export default function AdditionalInfo(props){
    return(
      <Collapse in={props.open} timeout="auto">
        <List disablePadding>
          {props.data.map((text, index) => (
            <>
            <ListItem
              key={index}
              sx={{ pl: 8 }}
            >
              <ListItemText primary={<Text title={"Information"} text={text}/>}/>
            </ListItem>
            </>
          ))}
        </List>
      </Collapse>
    )
  }