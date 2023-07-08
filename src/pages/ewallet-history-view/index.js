//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
// MUI Imports
//----------
import { Grid, Box, Typography, Card, CardContent } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Table Configuration
//----------
const columns = [
  { field: '', headerName: '#', width: 100, renderCell: params => params.row.key + 1 },
  { field: 'payoutDate', headerName: 'User ID' },
  {
    field: 'totalSaleFromVendor',
    headerName: 'UserName',
    width: 250
  },
  { field: 'totalCommision', headerName: 'Sender ID', width: 250 },
  { field: 'totalPayoutDistribution', headerName: 'Sender Username', width: 250 },
  { field: 'companyRevenue', headerName: 'Transaction Type', width: 250 },
  { field: 'companyRevenue', headerName: 'Credit', width: 250 },
  { field: 'companyRevenue', headerName: 'Debit', width: 250 },
  { field: 'companyRevenue', headerName: 'Date', width: 250 }
]

const EwalletHistoryView = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/admin-revenue/report`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          const tempData = response.data.data.map((d, key) => {
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
    loadData()
  }, [])

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            TRANSACTION REPORT FOR EMARK51704
          </Typography>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative' }}>
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
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default EwalletHistoryView
