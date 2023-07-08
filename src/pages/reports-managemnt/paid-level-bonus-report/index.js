//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
// MUI Imports
//----------
import { Grid, Box, Typography, Card, CardContent } from '@mui/material'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import { Table, Input } from 'antd'
import axios from 'axios'

//----------
//  Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Constants
//----------
const sorter = ['ascend', 'descend']

const PaidLevelReport = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [totalCommision, settotalCommision] = useState(0)
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')

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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/report-management/paid-level-bonus`, {
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
    loadData()
  }, [])

  //----------
  //  Table Configuration
  //----------
  const columns = [
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Receiver UserId',
      dataIndex: 'receiverUserId',
      sorter: {
        compare: (a, b) => a.receiverUserId.localeCompare(b.receiverUserId),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.receiverUserId)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.username)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.membername)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.senderUserId)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.senderMembername)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.trasactionType)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record?.level || '')
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.status)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.date)
            .replace(' ', '')
            .replace(',', '')
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
        multiple: 2
      }
    },

    {
      title: 'Membername',
      dataIndex: 'membername',
      sorter: {
        compare: (a, b) => a.membername.localeCompare(b.membername),
        multiple: 2
      }
    },

    {
      title: 'SenderUserId',
      dataIndex: 'senderUserId',
      sorter: {
        compare: (a, b) => a.senderUserId.localeCompare(b.senderUserId),
        multiple: 2
      }
    },
    {
      title: 'SenderMembername',
      dataIndex: 'senderMembername',
      sorter: {
        compare: (a, b) => a.senderMembername.localeCompare(b.senderMembername),
        multiple: 2
      }
    },
    {
      title: 'Commision',
      dataIndex: 'commision',
      sorter: {
        compare: (a, b) => a.commision - b.commision,
        multiple: 2
      }
    },
    {
      title: 'Trasaction Type',
      dataIndex: 'trasactionType',
      sorter: {
        compare: (a, b) => a.trasactionType.localeCompare(b.trasactionType),
        multiple: 2
      }
    },
    {
      title: 'Level',
      dataIndex: 'level',
      sorter: {
        compare: (a, b) => a.level.localeCompare(b.level),
        multiple: 2
      }
    },

    {
      title: 'Status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
        multiple: 2
      }
    },

    {
      title: 'Date',
      dataIndex: 'date',
      sorter: {
        compare: (a, b) => a.date.localeCompare(b.date),
        multiple: 2
      },
      render: (text, record) => new Date(record.date).toLocaleDateString()
    }
  ]

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Paid Level Bonus Report{' '}
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
            loading={false}
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

          <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
            Total Commission= {totalCommision.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default PaidLevelReport
