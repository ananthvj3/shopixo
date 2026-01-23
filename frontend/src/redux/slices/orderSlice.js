import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserOrders = createAsyncThunk("order/fetchUserOrder",
    async(orderId, {rejectWithValue})=>{
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(userToken)}`,
                    },
                }
            )
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }

    }
);

export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails",async (fetchOrderDetails,
    {rejectWithValue})=>{
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            rejectWithValue(err.response.data)
            
        }
    }
    
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        order:[],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error:null,
    },
    reducers: {},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchUserOrders.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
             .addCase(fetchUserOrders.fulfilled, (state,action)=>{
                state.loading = false;
                state.orders= action.payload;
            })
             .addCase(fetchUserOrders.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload?.message;
            })

            //fetch order
             .addCase(fetchOrderDetails.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
             .addCase(fetchOrderDetails.fulfilled, (state,action)=>{
                state.loading = false;
                state.orderDetails= action.payload;
            })
             .addCase(fetchOrderDetails.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.payload?.message;
            })

    }
});

export default orderSlice.reducer;