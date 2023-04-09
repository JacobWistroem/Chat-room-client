import React, { useContext, useEffect, useState } from 'react';
import { chatActions } from './../chat/chatSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import socketContext from '../../app/socketContext';
import { Button, ButtonGroup, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { menuActions, getAllJoinedRooms, getAllRooms } from './menuSlice';
import { message, room } from '../../types/defaultTypes';
import StandardDialog from './../components/standardDialog';


interface menu {
  pageHandler: any,
  userID: string,
  username: string
}

const Menu = ({ pageHandler, userID, username }: menu) => {
  const socket = useContext(socketContext);
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(getAllRooms);
  const [openRoom, setRoomOpen] = useState(false);
  const handleModalRoomOpen = () => setRoomOpen(true);
  const handleModalRoomClose = () => setRoomOpen(false);


  const createRoom = (name: string) => {
    socket.emit("createRoom", name, (response: any) => {
      if (!response) {
        throw new Error('Empty response on createRoom call')
      }

      handleModalRoomClose();
      loadDashboardData();
    });
  };

  const loadDashboardData = () => {
    socket.emit('getAllRooms', (rooms: room[]) => dispatch(menuActions.setRooms(rooms)));
    socket.emit('getJoinedRooms', userID, (rooms: room[]) => dispatch(menuActions.setJoinedRooms(rooms)));
  }
  /**
   * Change view to chat with the provided room id
   * @param roomID the ID of the room to view
   */
  const onViewHandler = (roomID: string) => {
    dispatch(chatActions.resetState());
    dispatch(chatActions.setRoomID(roomID));
    socket.emit("initChatRoom", roomID, (messages: message[]) => dispatch(chatActions.setMessages(messages)));
    pageHandler(1);
  }

  /**
   * Add user to the specified room 
   * @param roomID the ID of the room to join
   */
  const onJoinHandler = (roomID: string) => {
    socket.emit("joinRoom", roomID, userID, (response: any) => loadDashboardData())
  };

  /**
   * Delete the specified room
   * @param roomID the ID of the room to delete
   */
  const onDeleteHandler = (roomID: string) => {
    socket.emit("deleteRoom", roomID, () => loadDashboardData());
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  socket.onAny(() => {
    console.log("An event has been emitted")
  });

  console.log(rooms);

  return (<>
    <Container>
      <StandardDialog
        open={openRoom}
        title="Create room"
        description="You can use a room to chat with other users"
        confirmEvent={createRoom}
        cancelEvent={handleModalRoomClose}
      />

      <TableContainer sx={{ marginTop: 10 }} component={Paper}>
        <ButtonGroup sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 10px 0 10px' }}>
          <Typography>Logged in as: {username}</Typography>
          <Button onClick={handleModalRoomOpen}>Create Room</Button>
        </ButtonGroup >
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Users</TableCell>
              <TableCell align="left">Messages</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow
                key={room.uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {room.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {("users" in room) ? room.users.length : 0}
                </TableCell>
                <TableCell component="th" scope="row">
                  {("messages" in room) ? room.messages.length : 0}
                </TableCell>
                <TableCell component="th" scope="row" align='right' size='small'>
                  <ButtonGroup>
                    {(room.users.includes(userID)) && (<Button onClick={() => onViewHandler(room._id)}>View</Button>)}
                    {(!room.users.includes(userID)) && (<Button onClick={() => onJoinHandler(room._id)}>Join</Button>)}
                    <Button onClick={() => onDeleteHandler(room._id)}>Delete</Button>
                  </ButtonGroup >
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  </>)
}

export default Menu;