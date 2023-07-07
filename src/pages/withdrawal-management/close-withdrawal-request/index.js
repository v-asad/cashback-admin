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
import { Table, Input } from 'antd'
const CloseWithdrawalRequest = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/withdrawal-request/close`, {
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
          String(record.request_amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.transaction_number)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.bank_nm)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.acc_number)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.swift_code)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
            String(record.posted_date)
              .replace(' ', '')
              .toLowerCase()
              .trim()
              .includes(value.replace(' ', '').toLowerCase().trim()) 
        )
      }
    },
    {
      title: 'FullName',
      dataIndex: 'full_name',
      sorter: {
        compare: (a, b) => a.full_name.localeCompare(b.full_name),
        multiple: 2,
      },
      render: (_, object, index) => (
        <Typography>
           {object.first_name + ' ' + object.last_name}
         
        </Typography>
      )

    },
    {
      title: 'Request Amount',
      dataIndex: 'request_amount',
      sorter: {
        compare: (a, b) => a.request_amount-b.request_amount,
        multiple: 2,
      },

    },
    {
      title: 'Transaction Number',
      dataIndex: 'transaction_number',
      sorter: {
        compare: (a, b) => a.transaction_number-b.transaction_number,
        multiple: 2,
      },

    },
   
    {
      title: 'Bank Name',
      dataIndex: 'bank_nm',
      sorter: {
        compare: (a, b) => a.bank_nm.localeCompare(b.bank_nm),
        multiple: 2,
      },

    },
    {
      title: 'Acc Number',
      dataIndex: 'acc_number',
      sorter: {
        compare: (a, b) => a.bank_nm.localeCompare(b.bank_nm),
        multiple: 2,
      },

    },
    {
      title: 'Acc Name',
      dataIndex: 'acc_name',
      sorter: {
        compare: (a, b) => a.acc_number-b.acc_number,
        multiple: 2,
      },

    },
    {
      title: 'Swift code',
      dataIndex: 'swift_code',
      sorter: {
        compare: (a, b) => a.swift_code-b.swift_code,
        multiple: 2,
      },

    },
    
     
   
    {
      title: 'Posted Date',
      dataIndex: 'posted_date',
      sorter: {
        compare: (a, b) => a.posted_date.localeCompare(b.posted_date),
        multiple: 2,
      },
      render: (text, record) => new Date(record.posted_date).toLocaleDateString()
    },
   

   
    
  ]
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
          Close Withdraw Request
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
          {/* <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            getRowId={row => row.key}
            rowsPerPageOptions={[10]}
            autoHeight
          /> */}
        </CardContent>
      </Card>
    </>
  )
}

export default CloseWithdrawalRequest
