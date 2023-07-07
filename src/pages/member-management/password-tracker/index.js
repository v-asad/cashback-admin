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
import { toast } from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
const PasswordTraker = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/members/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        const tempData = response.data.map((d, key) => {
          return { key, ...d }
        })
        setData(tempData)
      })
      .catch(error => {
        toast.error(
          `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
        )
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
  }
  useEffect(() => {
    loadData()
  }, [])
  const columns = [
    { field: '', headerName: '#', width: 100, renderCell: params => params.row.key + 1 },
    { field: 'user_id', headerName: 'User Id', width: 200 },
    {
      field: 'fullname',
      headerName: 'Full Name',
      width: 250,
      renderCell: params => params.row.first_name + ' ' + params.row.last_name
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'package',
      headerName: 'Package Name(Amount)',
      width: 250,
      renderCell: params => params.row.package.name + ' ' + params.row.package.amount
    },
    { field: 'sponsor', headerName: 'Sponsor Id', width: 150, renderCell: params => params.row.sponsor.username },
    { field: 'selfIncome', headerName: 'Purchase', width: 150, },
   
  ]
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Password Tracker List{' '}
          </Typography>
        </Box>
      </Grid>

      {/* <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            getRowId={row => row.key}
            rowsPerPageOptions={[10]}
            autoHeight
          />
        </CardContent>
      </Card> */}
    </>
  )
}

export default PasswordTraker
