import { FormControl, InputLabel, Select } from "@mui/material";
export default function DropDown(props){
    return (<FormControl fullWidth style={{ width: "50%" }}>
            <InputLabel id="demo-simple-select-label">
              {props.label}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.dest}
              label="Starting Point"
              onChange={props.selectChange}
            >
              {props.getMenu()}
            </Select>
          </FormControl>
    )
  
          
  }