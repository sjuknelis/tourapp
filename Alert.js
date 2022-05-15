import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import {useState} from 'react';
function Alert(props){
    const [open,setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    return(
        <div>
            <Snackbar
              anchorOrigin={{ vertical: '', horizontal: '' }}
              open={open}
              onClose={handleClose}
              message={"Nice job, you have located "+props.place}
              severity="success"
              action={
                <IconButton size="small" aria-label="close" color="inherit">
                  <Close fontSize="small" />
                </IconButton>
              }
            />
        </div>
    )
}