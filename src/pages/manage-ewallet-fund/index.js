
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

const ManageEwalletFund = () => {
  const auth = useAuth()
  const [data, setData] = useState([])

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 350 },
    {
      field: 'date',
      headerName: 'Subscription Date',
      width: 250,
      renderCell: params => {
        // convert date here
        const updatedValue = params.row.date

        // when completed, return the column data
        return updatedValue
      }
    }
  ]
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
          ADD FUND TO WALLET
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Enter userid or username of the user' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Amount' placeholder='Enter the amount' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Remark' placeholder='Enter the amoremarkunt' />
            </Grid>
         
            <Grid item xs={12}>
              <TextField fullWidth label='Wallet Type' placeholder='Wallet Type' />
            </Grid>
           
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>




            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                DEDUCT FUND FROM WALLET
                </Typography>
              </Box>
            </Grid>
   
            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Enter userid or username of the user' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Amount' placeholder='Enter the amount' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Remark' placeholder='Enter the amoremarkunt' />
            </Grid>
         
            <Grid item xs={12}>
              <TextField fullWidth label='Wallet Type' placeholder='Wallet Type' />
            </Grid>
           
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>



      


          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ManageEwalletFund
