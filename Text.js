import {
    Typography
} from "@mui/material";
export default function Text(props) {
    return(
      <>
      <Typography align="left" variant="h6">
        {props.title}
      </Typography>
      <Typography align="left" variant="body1">
        {props.text}
      </Typography>
      </>
    )
  }