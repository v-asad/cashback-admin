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
import { Table, Input } from 'antd'
import Icon from 'src/@core/components/icon'
const UnPaidCoFounderReport = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [totalCommision, settotalCommision] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/report-management/unpaid-cofounder-income`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        settotalCommision(response.data.totalCommision)
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

    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Receiver UserId',
      dataIndex: 'userId',
      sorter: {
        compare: (a, b) => a.receiverUserId.localeCompare(b.receiverUserId),
        multiple: 2,
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.userId)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.username)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.purchasedAmount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.percentage)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.remark)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) 
        )
      }
    },
    
    {
      title: 'USERNAME',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2,
      },
    },
    {
      title: 'PurchasedAmount',
      dataIndex: 'purchasedAmount',
      sorter: {
        compare: (a, b) => a.purchasedAmount-b.purchasedAmount,
        multiple: 2,
      },
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      sorter: {
        compare: (a, b) => a.percentage-b.percentage,
        multiple: 2,
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: {
        compare: (a, b) => a.amount-b.amount,
        multiple: 2,
      },
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      sorter: {
        compare: (a, b) => a.remark-b.remark,
        multiple: 2,
      },
    },
    {
      title: 'Purchased Invoice',
      dataIndex: 'purchasedInvoice',
      sorter: {
        compare: (a, b) => a.purchasedInvoice-b.purchasedInvoice,
        multiple: 2,
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: {
        compare: (a, b) => a.date.localeCompare(b.date),
        multiple: 2,
      },
      render: (text, record) => new Date(record.date).toLocaleDateString()
    },
    

    
    { field: '', headerName: '#', width: 100, renderCell: params => params.row.key + 1 },
    { field: 'userId', headerName: ' UserId', width: 200 },
    {
      field: 'username',
      headerName: 'USERNAME',
      width: 250,
  
    },
    { field: 'purchasedAmount', headerName: 'PurchasedAmount', width: 200 },
    {
      field: 'percentage',
      headerName: 'percentage',
      width: 250,
      
    },
    { field: 'amount', headerName: 'amount', width: 150,},
    { field: 'remark', headerName: 'remark', width: 150, },
    { field: 'purchasedInvoice', headerName: 'purchased Invoice', width: 150, },
    { field: 'date', headerName: 'date', width: 250,renderCell:params=> new Date(params.row.date).toLocaleDateString() },
    
  ]
  return (
    <>
    <Grid item xs={12}>
        <Box >
          <Typography variant='h5' sx={{my:8}}>Unpaid Co-Founder Income Report  </Typography>

        </Box>
      </Grid>

     
      
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
      <CardContent>
      <Input.Search
            placeholder='Search here.....'
            style={{ maxWidth: 300, marginBottom: 8, display: 'block', height: 50, float: 'right', border: 'black' }}
            onSearch={value => {
              setSearchedText(value)
            }}
            onChange={e => {
              setSearchedText(e.target.value)
            }}
          />
          <Table
            columns={columns}
            dataSource={data}
            loading={tableLoading}
            sortDirections={sorter}
            pagination={
              data?.length > 10
                ? {
                    defaultCurrent: 1,
                    total: data?.length,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `Total: ${total}`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    locale: { items_per_page: '' }
                  }
                : false   
            }
            onChange={pagination => setPagination(pagination)}
          />

       
         <Typography variant='div' sx={{ my: 2, fontWeight: 'bold',display:'block' }}>
              Total Commission= {totalCommision.toFixed(2)}
              </Typography>
         </CardContent>
      </Card>
    </>
  )
}

export default UnPaidCoFounderReport
