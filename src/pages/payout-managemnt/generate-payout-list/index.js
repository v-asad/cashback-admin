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
import Link from '@mui/material/Link';
import { Router, useRouter } from 'next/router'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const GeneratePayoutList = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/payout-mgt/generate-payout-list`, {
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
  useEffect(() => {
    loadData()
  }, [])
  const setAccessToken = (user_id) => {
    let url = `${process.env.NEXT_PUBLIC_USER_DASH}dashboard?__sid=${encodeURI(localStorage.accessToken)}&__uid=${encodeURI(user_id)}`
    window.open(url, '_blank', 'noreferrer')
  }

  
  const columns = [
    { field: '', headerName: '#', width: 40, renderCell: params => params.row.key + 1 },
    { field: 'userId', headerName: 'User Id', width: 200, renderCell: params => <Link href='javascript:void(0)' onClick={() => setAccessToken(params.row.userId)}>{params.row.userId}</Link> },
    {
      field: 'fullName',
      headerName: 'fullName',
      width: 250,
      
    },
    { field: 'packagename', headerName: 'Member Name', width: 200, renderCell: params => `${ params.row.package.name } [${ params.row.package.amount }]` },
    
    {
      field: 'selfPurchase',
      headerName: 'Self Purchase',
      width: 150,
      
    },
    { field: 'levelIncome', headerName: 'Level Income', width: 150,  },
    { field: 'coFounderIncome', headerName: 'Co Founder Income', width: 150, },
    { field: 'total', headerName: 'Total', width: 150, },
  ]

  const generateHandler = () => {
    if(selectedRows){
      setOpen(true)
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/payout-mgt/generate-payout-list`,{
          list: selectedRows
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          setOpen(false)
          toast.success(response.data.message)
          router.replace('member-closing-list')
        })
        .catch(error => {
          setOpen(false)
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
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
            Current Payout Report{' '}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button variant='contained' sx={{ mr: 2,mb:10 }} onClick={generateHandler} disabled={selectedRows.length > 0 ? false:true}>
          Generate
        </Button>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            getRowId={row => row.userId}
            rowsPerPageOptions={[10]}
            autoHeight
            checkboxSelection
            onSelectionModelChange={(newSelection) => {setSelectedRows(newSelection)}}
          />
        </CardContent>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default GeneratePayoutList
