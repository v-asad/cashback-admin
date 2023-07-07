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

const VendorEdit = () => {
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
          UPDATE VENDOR PROFILE
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Company Registration Number' placeholder='Company Registration Number' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Company Name' placeholder='Company Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='About Company' placeholder='About Company' />
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                  Personal Information
                </Typography>
              </Box>
            </Grid>

           
            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Userid' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Username' placeholder='Username' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Due Amount (SAR)' placeholder='Due Amount (SAR)' />
            </Grid>
         
            <Grid item xs={12}>
              <TextField fullWidth label='Email' placeholder='Email' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Full Address(With Google map link)' placeholder='Full Address(With Google map link)' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Landmark' placeholder='Landmark' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Country' placeholder='Country' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Country Code' placeholder='Country Code' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='State' placeholder='State' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='City' placeholder='City' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Contact' placeholder='Contact' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Commission Percentage (%)' placeholder='Commission Percentage (%)' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Credit Limit (SAR)' placeholder='Credit Limit (SAR)' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Password' placeholder='Password' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Product Gallery' placeholder='Product Gallery' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Brand Logo' placeholder='Brand Logo' />
            </Grid>

            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Update
              </Button>
            </Grid>




            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                UPDATE BANK INFORMATION
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Account Name' placeholder='Account Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Account Number' placeholder='Account Number' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Bank Name' placeholder='Bank Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Branch Name' placeholder='Branch Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Ifsc / Swift Code' placeholder='Ifsc / Swift Code' />
            </Grid>
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
              Update
              </Button>
            </Grid>


          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default VendorEdit
