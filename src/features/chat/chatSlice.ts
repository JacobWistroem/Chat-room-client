import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { message, room, sortedUsers, user } from '../../types/defaultTypes';



interface ReduxAction<T = any> {
    type: string
    payload: T;
}

export interface chatState {
    roomID: string
    room: room
    messages: Array<message>;
    users: Array<user>,
    input: string,
    userID: string,
    sortedJoinedUsers: sortedUsers
}

const initialState: chatState = {
    roomID: '',
    room: {
        _id: "",
        uuid: "",
        name: "",
        users: [],
        messages: [],
        created_ts: "",
        status: ""
    },
    messages: [],
    users: [],
    input: '',
    userID: '',
    sortedJoinedUsers: {}
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setUserID: (state, action) => {
            state.userID = action.payload;
        },
        setRoomID: (state, action) => {
            state.roomID = action.payload;
        },
        setRoom: (state, action) => {
            state.room = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        changeInput: (state, action) => {
            state.input = action.payload;
        },
        resetState: (state) => {
            state = initialState;
        },
        getJoinedUsersList: (state, action: ReduxAction<user[]>) => {
            const sortedJoinedUsers: sortedUsers = {};
            for (const value of Object.values(action.payload || [])) {
                sortedJoinedUsers[value._id] = value;
            }
            state.sortedJoinedUsers = sortedJoinedUsers;
        }
    }
});

export const getUserID = (state: RootState) => {
    return state.chat.userID
};
export const getAllMessages = (state: RootState) => {
    return state.chat.messages
};
export const getAllUsers = (state: RootState) => {
    return state.chat.users
};
export const getRoomID = (state: RootState) => {
    return state.chat.roomID
};
export const getRoom = (state: RootState) => {
    return state.chat.room
};
export const getInput = (state: RootState) => {
    return state.chat.input
};
export const getJoinedUsers = (state: RootState) => {
    return state.chat.sortedJoinedUsers
};

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;