//----------
//  React Imports
//----------
import { useState } from 'react'

//----------
// MUI Imports
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material'

//----------
// MUI Icon Imports
//----------
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const ChangePassword = () => {
  //----------
  //  States
  //----------
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [open, setOpen] = useState(false)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Handlers
  //----------
  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleMouseDownPassword = event => event.preventDefault()
  const submitHandler = () => {
    let errors = 0
    if (!password) {
      toast.error('Old password is required')
      errors++
    }
    if (!newPassword) {
      toast.error('New password is required')
      errors++
    }
    if (!confirmPassword) {
      toast.error('Confirm password is required')
      errors++
    }
    if (!errors) {
      setOpen(true)
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/password`,
          {
            old_password: password,
            new_password: newPassword,
            c_password: confirmPassword
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(resp => {
          setOpen(false)
          let data = resp.data
          if (data.success) {
            toast.success(data.message)
            setPassword(null)
            setNewPassword(null)
            setConfirmPassword(null)
          } else {
            toast.error(data.message)
          }
        })
        .catch(error => {
          setOpen(false)
          if (error.response && error.response.data) {
            if (error.response.data && error.response.data.message) {
              toast.error(
                `${error.response ? error.response.status : ''}: ${
                  error.response ? error.response.data.message : error
                }`
              )
            }
            if (error.response.data && error.response.data.errors) {
              error.response.data.errors.map(err => toast.error(err.msg))
            }
          }
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
    }
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid item xs={12}>
            <Box>
              <Typography variant='h5' sx={{ my: 8 }}>
                Change Login Password
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl sx={{width:'100%'}} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl sx={{width:'100%'}} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>New Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setNewPassword(e.target.value)}
                  value={newPassword}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl sx={{width:'100%'}} variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Confirm New Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={submitHandler}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
    </>
  )
}

export default ChangePassword
