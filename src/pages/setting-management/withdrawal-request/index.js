import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { toast } from 'react-hot-toast'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const WithDrawBlock = () => {
  const auth = useAuth()
  const [userId, setUserId] = useState(null)
  const [status, setStatus] = useState(null)
  const [open, setOpen] = useState(false)
  const submitHandler = () => {
    let errors = 0
    console.log(status, userId)
    if(status === ''){
      toast.error('Block status is required!')
      errors++
    }
    if(!userId){
      toast.error('User Id is required!')
      errors++
    }
    if(!errors) {
      setOpen(true)
      axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/user-withdraw-block/${userId}`, {
        block_status: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setOpen(false)
        toast.success(response.data.message)
        setUserId(null)
        setStatus(null)
      })
      .catch(error => {
        setOpen(false)
        if(error.response && error.response.data){
          if(error.response.data && error.response.data.message){
            toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
          }
          if(error.response.data && error.response.data.errors){
            error.response.data.errors.map(err => toast.error(err.msg))
          }
        }
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
    }
  }
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            User Id Blocker{' '}
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='User ID' placeholder='User ID' value={userId} onChange={(e) => setUserId(e.target.value)} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="status">Block Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status-select"
                    label="Block Status"
                    placeholder='Block Status'
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
                    {[0, 1].map(c=><MenuItem value={c}>{c?'Block': 'Unblock'}</MenuItem>)}
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
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Card>
    </>
  )
}

export default WithDrawBlock
