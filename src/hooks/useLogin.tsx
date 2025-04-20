'use client'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { RootState } from '@/data/redux/Store'
import { setAuth, setUserProfile } from '@/data/redux/slices/authSlice'
import { DecodedToken } from '@/types/common'

//? TYPES
type UserData = {
  email: string
  password: string
}

type LoginFormData = {
  email: string
  password: string
}

const useLogin = (setLoadLoginPage: React.Dispatch<React.SetStateAction<boolean>>) => {
  const router = useRouter()
  const searchParams: any = useSearchParams()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm<LoginFormData>()
  const [showPassword, setShowPassword] = useState(false)
  const [studentSlug, setStudentSlug] = useState('')
  const [isTempPassword, setIsTempPassword] = useState(false)

  const callbackUrl = searchParams.get('redirect_uri')
  const fromApp = searchParams.get('from_app')
  const deviceId = searchParams.get('device_id')

  const access_token = useSelector((state: RootState) => state.auth.accessToken)

  const handleLogin = async (userdata: UserData) => {
    setIsLoading(true)

    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    }

    try {      
      const response = await axios.post(
        `${window.base_url}/auth/api/login/`,
        { ...userdata, device_id: deviceId },
        { headers }
      )

      setIsLoading(false)

      if (response?.data?.profile_slug) {
        setStudentSlug(response?.data?.profile_slug)
        setIsTempPassword(true)
        toast.warning('Temporary password. Please set a new password.')
        return
      }

      const token = {
        ...response.data,
        isAuth: true,
        callbackUrl,
        fromApp,
      }

      if (!token.access || !token.refresh) {
        throw new Error('Access token is required')
      }

      dispatch(setAuth(token))

      localStorage.setItem('accessToken', token.access)
      localStorage.setItem('refreshToken', token.refresh)
      localStorage.setItem('callbackUrl', callbackUrl ?? '')
      localStorage.setItem('fromApp', fromApp ?? '')

      const decode: DecodedToken = jwtDecode<DecodedToken>(token.access)
      dispatch(setUserProfile(decode))

      const role = decode.obj.profile.role

      if (role === 'admin') {
        return router.push('/subject/subject-select')
      } else if (role === 'teacher') {
        return router.push('/teacher')
      } else if (role === 'student') {
        if (!callbackUrl || !fromApp || !deviceId) {
          return router.push('/student-dashboard')
        } else {
          const callbackUrlParse = `${callbackUrl}?access_token=${token.access}&refresh_token=${token.refresh}`
          return (window.location.href = callbackUrlParse)
        }
      } else {
        return router.push('/login')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail || error.message || 'An error occurred'
      setIsLoading(false)
      reset()
      toast.error(message)
    }
  }

  const redirectLogin = () => {
    try {
      if (!access_token){
        setLoadLoginPage(true)
        return
      }
        

      const decode: DecodedToken = jwtDecode<DecodedToken>(access_token)
      const role = decode?.obj?.profile?.role

      if (role === 'admin') {
        return router.push('/')
      } else if (role === 'teacher') {
        return router.push('/teacher-dashboard')
      } else if (role === 'student') {
        if (!callbackUrl || !fromApp || !deviceId) {
          return router.push('/student-dashboard')
        } else {
          const callbackUrlParse = `${callbackUrl}?access_token=${localStorage.getItem('accessToken')}&refresh_token=${localStorage.getItem('refreshToken')}`
          return (window.location.href = callbackUrlParse)
        }
      } else {
        setLoadLoginPage(true)
        return;
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleOnClickForForgotPassoword = async () => {
    try {
      const email = prompt('Please Enter The Email Address For Forgot Password')

      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (email && regex.test(email)) {
        const response = await axios.post(
          `${window.base_url}/auth/api/forgot_password/`,
          { email },
          { headers }
        )

        if (response.data.data === true) {
          toast.success(
            'Email has been sent successfully. Please check your email.'
          )
        }
      } else {
        toast.error('Please enter a valid email address')
      }
    } catch (error: any) {
      if (error.status === 403) {
        return toast.error('Please try again after 24 hours')
      }
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return {
    studentSlug,
    isTempPassword,
    showPassword,
    isLoading,
    register,
    handleSubmit,
    reset,
    handleLogin,
    redirectLogin,
    setShowPassword,
    handleOnClickForForgotPassoword,
  }
}

export default useLogin
