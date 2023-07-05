// alertSlice is the slice for loading and hiding when api is in working state
// we will show spinner during loading active
import {createSlice} from '@reduxjs/toolkit'


const alertSlice = createSlice({
    name:"alerts",
    initialState:{
        loading:false,
    },
    reducers:{
        showLoading: (state, action)=>{
            state.loading = true;
        },
        hideLoading: (state , action)=>{
            state.loading = false;
        }
    }
})

// export the reducer function
// export the state

export const {showLoading , hideLoading} = alertSlice.actions; 
export default alertSlice.reducer;

