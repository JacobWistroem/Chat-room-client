import React, { useState, KeyboardEvent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ButtonGroup, TextField } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface standardDialog {
    open: boolean,
    title: string,
    description: string,
    confirmEvent: any,
    cancelEvent: any
}

const StandardDialog = ({ open, title, description, confirmEvent, cancelEvent }: standardDialog) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            confirmEvent(input)
        }
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={cancelEvent}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            {title}
                        </Typography>
                        <Typography id="transition-modal-title" variant="body1" component="h2">
                            {description}
                        </Typography>
                        <TextField label="Name" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
                        <ButtonGroup>
                            <Button onClick={() => confirmEvent(input)}>Create</Button>
                            <Button onClick={cancelEvent}>Cancel</Button>
                        </ButtonGroup >
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default StandardDialog;