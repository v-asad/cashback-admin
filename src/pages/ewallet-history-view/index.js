
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
import { toast } from 'react-hot-toast'
const EwalletHistoryView = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [totalSale, settotalSale] = useState([])
  const [totalCommision, settotalCommision] = useState([])
  const [totalPayoutDistribution, settotalPayoutDistribution] = useState([])
  const [totalCompanyRevenue, settotalCompanyRevenue] = useState([])
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/admin-revenue/report`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        settotalSale(response.data.totalSale)
        settotalCommision(response.data.totalCommision)
        settotalPayoutDistribution(response.data.totalPayoutDistribution)
        settotalCompanyRevenue(response.data.totalCompanyRevenue)
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
  useEffect(() => {
    loadData()
  }, [])
  const columns = [
    { field: '', headerName: '#', width: 100, renderCell: params => params.row.key + 1 },

    { field: 'payoutDate', headerName: 'User ID', },
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
    { field: 'companyRevenue', headerName: 'Date', width: 250 },

  ]
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
