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
import Link from '@mui/material/Link';
import { Table, Input } from 'antd'
const MemberClosingList = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [totalPayableAmount, setTotalPayableAmount] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/payout-mgt/closing-report`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setTotalPayableAmount(response.data.totalPayableAmount)
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
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    
    {
      title: 'User Id',
      dataIndex: 'user_id',
      sorter: {
        compare: (a, b) => a.user_id.localeCompare(b.user_id),
        multiple: 2,
      },
      render: (_, object, index) => (
        <Link sx={{textDecoration:'underline'}} href='javascript:void(0)' onClick={() => setAccessToken(object.user_id)}>
          {object.user_id}
        </Link>
      ),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.user_id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.full_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.bussiness_volume)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())  ||
          String(record.level_income)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.cofounder_income)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.total)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) 
        )
      }
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      sorter: {
        compare: (a, b) => a.full_name.localeCompare(b.full_name),
        multiple: 2,
      },
    },
    {
      title: 'Bussiness Volume',
      dataIndex: 'bussiness_volume',
      sorter: {
        compare: (a, b) => a.bussiness_volume-b.bussiness_volume,
        multiple: 2,
      },
    },
    {
      title: 'Level Income',
      dataIndex: 'level_income',
      sorter: {
        compare: (a, b) => a.level_income-b.level_income,
        multiple: 2,
      },
    },
    {
      title: 'Co Founder Income',
      dataIndex: 'cofounder_income',
      sorter: {
        compare: (a, b) => a.cofounder_income-b.cofounder_income,
        multiple: 2,
      },
    },

    {
      title: 'Total',
      dataIndex: 'total',
      sorter: {
        compare: (a, b) => a.total-b.total,
        multiple: 2,
      },
    },

  
   
    
   

  ]
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
          Monthly CLosing Report
          </Typography>
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
          Total Payable Amount= {new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(totalPayableAmount)}
        </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default MemberClosingList
