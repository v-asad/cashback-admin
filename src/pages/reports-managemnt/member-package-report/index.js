//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
// MUI Imports
//----------
import { Grid, Button, Box, Typography, Card, CardContent } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'

//----------
// MUI Icon Imports
//----------
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import { Table, Input } from 'antd'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Constants
//----------
const sorter = ['ascend', 'descend']

const MemberPackageReport = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [totalCommision, settotalCommision] = useState(0)
  const [filterDateRange, setFilterDateRange] = useState([null, null])
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/report-management/member-package`, {
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
          setDataSource(tempData)
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
      title: 'User Id',
      dataIndex: 'user_id',
      sorter: {
        compare: (a, b) => a.user_id.localeCompare(b.user_id),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.user_id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.username)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.memberName)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.memberEmail)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.packageAmount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.purchaseDate)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.expireDate)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      }
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      sorter: {
        compare: (a, b) => a.memberName.localeCompare(b.memberName),
        multiple: 2
      }
    },
    {
      title: 'Email',
      dataIndex: 'memberEmail',
      sorter: {
        compare: (a, b) => a.memberEmail.localeCompare(b.memberEmail),
        multiple: 2
      }
    },
    {
      title: 'PackageAmount',
      dataIndex: 'packageAmount',
      sorter: {
        compare: (a, b) => a.packageAmount.localeCompare(b.packageAmount),
        multiple: 2
      }
    },

    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      sorter: {
        compare: (a, b) => a.purchaseDate.localeCompare(b.purchaseDate),
        multiple: 2
      },
      render: (text, record) => new Date(record.purchaseDate).toLocaleDateString()
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      sorter: {
        compare: (a, b) => a.expireDate.localeCompare(b.expireDate),
        multiple: 2
      },
      render: (text, record) => new Date(record.expireDate).toLocaleDateString()
    }
  ]

  //----------
  //  Table Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    let filter = dataSource.filter(
      d => new Date(d.purchaseDate) >= new Date(dateFrom) && new Date(d.purchaseDate) <= new Date(dateTo)
    )
    setData(filter)
    let commision = 0
    filter.forEach(d => {
      commision += parseFloat(d.packageAmount)
    })
    settotalCommision(commision)
  }

  //----------
  //  Table Actions - Reset Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let commision = 0
    dataSource.forEach(d => {
      commision += parseFloat(d.packageAmount)
    })
    settotalCommision(commision)
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Member Investment Report{' '}
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={5} xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker
                  calendars={2}
                  value={filterDateRange}
                  onChange={newValue => setFilterDateRange(newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item md={1} xs={2}>
              <Button
                variant='contained'
                sx={{ mr: 2, mt: 2 }}
                onClick={applyFilter}
                disabled={!filterDateRange[0] || !filterDateRange[1] ? true : false}
                size='small'
              >
                <FilterAltIcon />
              </Button>
            </Grid>
            <Grid item md={1} xs={2}>
              <Button variant='contained' sx={{ mr: 2, mt: 2 }} onClick={resetFilter} color='error' size='small'>
                <FilterAltOffIcon />
              </Button>
            </Grid>
            <Grid item md={5} xs={8}>
              <Input.Search
                placeholder='Search here.....'
                style={{
                  maxWidth: 300,
                  marginBottom: 8,
                  display: 'block',
                  height: 50,
                  float: 'right',
                  border: 'black'
                }}
                onSearch={value => {
                  setSearchedText(value)
                }}
                onChange={e => {
                  setSearchedText(e.target.value)
                }}
              />
            </Grid>
          </Grid>
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

export default MemberPackageReport
