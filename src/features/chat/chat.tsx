import React, { useContext, useEffect, KeyboardEvent } from 'react';
import { chatActions, getAllMessages, getInput, getJoinedUsers, getRoom, getRoomID, getUserID } from './chatSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import socketContext from '../../app/socketContext';
import Button from '@mui/material/Button';
import { Container, Paper, Stack, TextField, Typography } from '@mui/material';
import Item from '../components/Item';
import { user, room } from '../../types/defaultTypes';

interface chat {
    pageHandler: any,
    userID: string,
    username: string
}

const Chat = ({ pageHandler, userID, username }: chat) => {
    const socket = useContext(socketContext);
    const dispatch = useAppDispatch();
    const messages = useAppSelector(getAllMessages);
    const input = useAppSelector(getInput);
    const roomID = useAppSelector(getRoomID);
    const room: room = useAppSelector(getRoom);
    const joinedUsers = useAppSelector(getJoinedUsers);

    const handleSend = () => {
        if (input === '') {
            return;
        }
        socket.emit("createMessage", input, roomID);
        dispatch(chatActions.changeInput(''))
    }


    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    useEffect(() => {
        const handleMessages = (type: string, content: any) => {
            switch (type) {
                case 'addMessage': {
                    dispatch(chatActions.addMessage(content));
                    break;
                }
                case 'initMessages': {
                    dispatch(chatActions.setMessages(content));
                    break;
                }
            }
        };

        socket.emit('getJoinedUsers', roomID, (users: user[]) => dispatch(chatActions.getJoinedUsersList(users)));
        socket.emit('getRoom', roomID, (room: room) => dispatch(chatActions.setRoom(room)));

        socket.on('message', handleMessages);
        return () => {
            socket.off('message', handleMessages);
        };
    }, [socket, dispatch]);

    return (
        <Container maxWidth="sm" sx={{ height: '500px' }}>
            <Paper variant="outlined" sx={{ margin: 1 }}>
                <Paper sx={{ display: 'flex' }}>
                    <Button sx={{ margin: 1 }} onClick={() => pageHandler(0)} variant="outlined">Back</Button>
                    <Typography variant="h4" sx={{ margin: '8px 15px' }}>{(room) ? room.name : ''}</Typography>
                </Paper>

                <Stack
                    direction="column"
                    spacing={1}
                    style={{
                        height: '500px',
                        overflowY: 'auto',
                        flexWrap: 'nowrap',
                        margin: 3,
                        padding: 1,

                    }}
                    alignItems="flex-start"
                    flexDirection="column-reverse"
                >
                    <Stack sx={{ width: '100%' }}>
                        {messages.map((msg) => (
                            <Stack
                                key={msg._id}
                                sx={{
                                    padding: '0 5px',
                                    margin: '8px!important',
                                    maxWidth: '65%',
                                    flexDirection: (userID === msg.user_id) ? 'row-reverse' : 'row',

                                }}
                                direction="column"
                                alignSelf={(userID === msg.user_id) ? 'flex-start' : 'flex-end'}
                            >
                                <Item sx={{
                                    display: 'inline-block',
                                    wordBreak: 'break-word',
                                    minHeight: '22px',
                                    textAlign: 'start',
                                    backgroundColor: (userID === msg.user_id) ? '#50affc' : '#a3a3a3',
                                    color: 'white'
                                }}>
                                    {msg.content}
                                </Item>
                                <div style={{ display: 'flex', margin: '0 5px' }}>
                                    <Typography variant="caption" display="block" sx={{ alignSelf: 'flex-end' }} gutterBottom>{(msg.user_id in joinedUsers) ? joinedUsers[msg.user_id].name : ''}</Typography>
                                </div>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
                <Paper variant='outlined' sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        label="Standard"
                        variant="standard"
                        sx={{ width: '65%' }}
                        value={input}
                        onChange={(e) => dispatch(chatActions.changeInput(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="contained" onClick={handleSend}>
                        send Message
                    </Button>
                </Paper>
            </Paper>
        </Container >
    )
}

export default Chat;