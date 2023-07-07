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
const VendorReportViewDetail = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
 
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

    { field: 'Vendor', headerName: 'Transaction NO', width: 200,},
    {
      field: 'Vendor',
      headerName: 'Vendor ID',
      width: 250
    },

    { field: 'Vendor', headerName: 'Vendor Name', width: 250 },
    { field: 'Vendor', headerName: 'Invoice Amount', width: 250 },
    { field: 'Vendor', headerName: 'Commission Percent', width: 250 },
    { field: 'Vendor', headerName: 'Commission', width: 250 },
    { field: 'Vendor', headerName: 'Invoice No', width: 250 },
    { field: 'Vendor', headerName: 'Date', width: 250 }
  ]
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Admin Commission Report
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

              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold',display:'block' }}>
              Total Commission= 
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default VendorReportViewDetail
