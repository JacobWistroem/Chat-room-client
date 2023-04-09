import React, { useContext, useState } from 'react';
import socketContext from './app/socketContext';
import Chat from './features/chat/chat';
import Menu from './features/menu/menu';
import './App.css';
import StandardDialog from './features/components/standardDialog';

function App() {
  const socket = useContext(socketContext);
  const [page, setPage] = useState(0);
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [openUser, setUserOpen] = useState((userID === ''));
  const handleModalUserClose = () => setUserOpen(false);

  const getUser = (usernameInput: string) => {
    console.log(usernameInput)
    socket.emit('getUser', usernameInput, (userID: any) => {
      if (userID) {
        setUserID(userID._id);
        setUsername(userID.name);
        setUserOpen(false);
      }
    });
  };

  /* useEffect(() => {
    socket.on('setUserID', (userID) => setUserID(userID));
    return () => {
      socket.off('setUserID');
    }
  }, []); */

  console.log(userID);

  return (
    <div className="App">
      <StandardDialog
        open={openUser}
        title="Set user"
        description="Insert your username to start chatting"
        confirmEvent={getUser}
        cancelEvent={handleModalUserClose}
      />
      {((page === 0 && userID !== "") && (<Menu pageHandler={setPage} userID={userID} username={username} />))}
      {((page === 1 && userID !== "") && (<Chat pageHandler={setPage} userID={userID} username={username} />))}


    </div>
  );
}

export default App;
