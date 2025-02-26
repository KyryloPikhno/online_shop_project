import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { orderService } from "../../services"

const setDeviceToLocalStorage = (devices, totalPrice, quantity) => {
  localStorage.setItem("deviceList", JSON.stringify(devices))
  localStorage.setItem("totalPrice", JSON.stringify(totalPrice))
  localStorage.setItem("quantity", JSON.stringify(quantity))
}

const removeDeviceFromLocalStorage = () => {
  localStorage.removeItem("deviceList")
  localStorage.removeItem("totalPrice")
  localStorage.removeItem("quantity")
}

const initialState = {
  deviceList:
    localStorage.getItem("deviceList") !== null
      ? JSON.parse(localStorage.getItem("deviceList"))
      : [],
  totalPrice:
    localStorage.getItem("totalPrice") !== null
      ? JSON.parse(localStorage.getItem("totalPrice"))
      : 0,
  quantity:
    localStorage.getItem("quantity") !== null ? JSON.parse(localStorage.getItem("quantity")) : 0,
  userOrders: [],
  orderInfo: {},
  orderStatus: false,
  loading: false,
  error: null,
}

const getUserOrders = createAsyncThunk(
  "orderSlice/getUserOrders",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const { data } = await orderService.getUserOrders(userId)
      return data
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  },
)

const create = createAsyncThunk("orderSlice/create", async ({ orderInfo }, { rejectWithValue }) => {
  try {
    const { data } = await orderService.create(orderInfo)
    return data
  } catch (e) {
    return rejectWithValue(e.response.data)
  }
})

const update = createAsyncThunk(
  "orderSlice/update",
  async ({ orderId, orderInfo }, { rejectWithValue }) => {
    try {
      const { data } = await orderService.update(orderId, orderInfo)
      return data
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  },
)

const deleteById = createAsyncThunk(
  "orderSlice/deleteById",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      await orderService.delete(orderId)
      return orderId
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  },
)

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const newDevice = action.payload
      const existingDevice = state.deviceList.find((device) => device._id === newDevice._id)
      state.quantity++

      if (!existingDevice) {
        state.deviceList.push({
          _id: newDevice._id,
          name: newDevice.name,
          image: newDevice.image,
          price: newDevice.price,
          quantity: 1,
          totalPrice: newDevice.price,
          countInStock: newDevice.countInStock,
        })
      } else {
        existingDevice.quantity++
        existingDevice.totalPrice = Number(existingDevice.totalPrice) + Number(newDevice.price)
      }

      state.totalPrice = state.deviceList.reduce(
        (acc, device) => acc + Number(device.price) * Number(device.quantity),
        0,
      )

      setDeviceToLocalStorage(
        state.deviceList.map((device) => device),
        state.totalPrice,
        state.quantity,
      )
    },
    removeDevice(state, action) {
      const _id = action.payload
      const existingDevice = state.deviceList.find((device) => device._id === _id)
      state.quantity--

      if (existingDevice.quantity === 1) {
        state.deviceList = state.deviceList.filter((device) => device._id !== _id)
      } else {
        existingDevice.quantity--
        existingDevice.totalPrice = Number(existingDevice.totalPrice) - Number(existingDevice.price)
      }

      state.totalPrice = state.deviceList.reduce(
        (acc, device) => acc + Number(device.price) * Number(device.quantity),
        0,
      )

      setDeviceToLocalStorage(
        state.deviceList.map((device) => device),
        state.totalPrice,
        state.quantity,
      )
    },
    deleteDevice(state, action) {
      const _id = action.payload
      const existingDevice = state.deviceList.find((device) => device._id === _id)

      if (existingDevice) {
        state.deviceList = state.deviceList.filter((device) => device._id !== _id)
        state.quantity = state.quantity - existingDevice.quantity
      }

      state.quantity = state.deviceList.reduce(
        (acc, device) => acc + Number(device.price) * Number(device.quantity),
        0,
      )

      setDeviceToLocalStorage(
        state.deviceList.map((device) => device),
        state.totalPrice,
        state.quantity,
      )
    },
    reset: (state) => {
      state.deviceList = []
      state.totalPrice = 0
      state.quantity = 0
      state.userOrders = []
      state.orderInfo = {}
      state.orderStatus = false
      state.loading = false
      state.error = null
      removeDeviceFromLocalStorage()
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload
        state.error = null
        state.loading = false
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(create.fulfilled, (state, action) => {
        state.orderInfo = action.payload
        state.error = null
        state.loading = false
      })
      .addCase(create.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(create.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(update.fulfilled, (state, action) => {
        state.orderStatus = action.payload.orderStatus
        state.error = null
        state.loading = false
      })
      .addCase(update.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(update.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteById.fulfilled, (state, action) => {
        const index = state.userOrders.findIndex((order) => order._id === action.payload)
        state.userOrders.splice(index, 1)
        state.error = null
        state.loading = false
      })
      .addCase(deleteById.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(deleteById.pending, (state) => {
        state.loading = true
        state.error = null
      }),
})

const {
  reducer: orderReducer,
  actions: { addDevice, removeDevice, deleteDevice, reset },
} = orderSlice

const orderActions = {
  addDevice,
  removeDevice,
  deleteDevice,
  getUserOrders,
  create,
  update,
  deleteById,
  reset,
}

export { orderReducer, orderActions }
