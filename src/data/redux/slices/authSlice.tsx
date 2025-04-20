'use client'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DecodedToken } from '@/types/common'

interface authState {
  isAuth: boolean
  accessToken: string | null
  refreshToken: string | null
  userProfile: DecodedToken | null
  callbackUrl?: string | null
  fromApp?: string | null
}

const initialState: authState = {
  isAuth: true,
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  callbackUrl: null,
  fromApp: null,
}

// Safely check for localStorage usage on the client-side
if (typeof window !== 'undefined') {
  initialState.accessToken = localStorage.getItem('accessToken') || null
  initialState.refreshToken = localStorage.getItem('refreshToken') || null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        isAuth: boolean
        access: string | null
        refresh: string | null
        callbackUrl?: string | null
        fromApp?: string | null
      }>
    ) => {
      const {
        isAuth,
        access,
        refresh,
        callbackUrl = null,
        fromApp = null,
      } = action.payload
      return {
        ...state,
        isAuth: isAuth,
        accessToken: access,
        refreshToken: refresh,
        callbackUrl: callbackUrl,
        fromApp: fromApp,
      }
    },
    setUserProfile: (state, action: PayloadAction<DecodedToken>) => {
      return {
        ...state,
        userProfile: action.payload,
      }
    },
    setUpdateEmail: (state, action: PayloadAction<string>) => {
      // This will safely update the email inside the userProfile
      if (
        state.userProfile &&
        state.userProfile.obj &&
        state.userProfile.obj.profile
      ) {
        return {
          ...state,
          userProfile: {
            ...state.userProfile,
            obj: {
              ...state.userProfile.obj,
              profile: {
                ...state.userProfile.obj.profile,
                email: action.payload, // Update the email
              },
            },
          },
        }
      }
      return state // If userProfile is null or doesn't have the right structure, return unchanged state
    },
  },
})

export const { setAuth, setUserProfile, setUpdateEmail } = authSlice.actions
export default authSlice.reducer
