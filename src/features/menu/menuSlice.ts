import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { room } from '../../types/defaultTypes';


export interface menuState {
    rooms: room[],
    joinedRooms: room[]
}

const initialState: menuState = {
    rooms: [],
    joinedRooms: []
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
        setJoinedRooms: (state, action) => {
            state.joinedRooms = action.payload;
        }
    }
});

export const getAllRooms = (state: RootState) => {
    return state.menu.rooms;
};
export const getAllJoinedRooms = (state: RootState) => {
    return state.menu.joinedRooms;
};

export const menuActions = menuSlice.actions;
export default menuSlice.reducer;