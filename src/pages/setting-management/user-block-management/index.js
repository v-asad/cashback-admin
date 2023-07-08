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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Backdrop,
  CircularProgress
} from '@mui/material'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const UserBlockManage = () => {
  //----------
  //  States
  //----------
  const [userId, setUserId] = useState(null)
  const [downline, setDownline] = useState(null)
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState(false)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Handlers
  //----------
  const submitHandler = () => {
    let errors = 0
    if (status === '') {
      toast.error('Block status is required')
      errors++
    }
    if (!downline) {
      toast.error('Choose between with-downline/self')
      errors++
    }
    if (!userId) {
      toast.error('User id is required')
      errors++
    }

    if (!errors) {
      setOpen(true)
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/user-block/${userId}`,
          {
            block_status: status, //true, false
            down: downline //with_downline, self
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(response => {
          setOpen(false)
          toast.success(response.data.message)
          setUserId(null)
          setStatus('')
          setDownline(null)
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
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            User Id Blocker
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='User ID'
                placeholder='User ID'
                onChange={e => setUserId(e.target.value)}
                value={userId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby='demo-form-control-label-placement'
                  name='position'
                  defaultValue='top'
                  onChange={e => setDownline(e.target.value)}
                  value={downline}
                >
                  <FormControlLabel value='with_downline' control={<Radio />} label='With Downline' />
                  <FormControlLabel value='self' control={<Radio />} label='Self' />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id='status'>Block Status</InputLabel>
                  <Select
                    labelId='status-label'
                    id='status-select'
                    label='Block Status'
                    placeholder='Block Status'
                    onChange={e => setStatus(e.target.value)}
                    value={status}
                  >
                    {[0, 1].map(c => (
                      <MenuItem value={c}>{c ? 'Block' : 'Unblock'}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item md={6} xs={12}>
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

export default UserBlockManage
