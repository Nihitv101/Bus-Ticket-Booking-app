import {createSlice} from '@reduxjs/toolkit'


const usersSlice = createSlice({
    name:"users",
    initialState:{
        user:null,
    },
    reducers:{
        // reducer functions:
        setUser : (state, action)=>{
            state.user = action.payload
        }
    }
})


// exporting the state and reducer function:

export const {setUser} = usersSlice.actions;
export default usersSlice.reducer;


