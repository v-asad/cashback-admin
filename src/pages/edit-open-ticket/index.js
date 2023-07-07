
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

const EditOpenTicket = () => {
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
          OPEN TICKET RESPONSE
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
            Ticket Number7
            </Grid>
            <Grid item xs={12}>
            User Namemajed
            </Grid>
            <Grid item xs={12}>
            User IdEmark68396
            </Grid>
         
            <Grid item xs={12}>
            Category TypeFinancial
            </Grid>
            <Grid item xs={12}>
            Subjecttest4
            </Grid>
            <Grid item xs={12}>
            Posted Date2022-09-21
            </Grid>
            <Grid item xs={12}>
            Descriptiontest4
            </Grid>
             <Grid item xs={12}>
              <TextField fullWidth label='Response' placeholder='Enter Response' />
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

export default EditOpenTicket
