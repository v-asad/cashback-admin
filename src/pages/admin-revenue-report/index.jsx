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

const AdminRevenueReport = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [totalSale, settotalSale] = useState(0)
  const [totalCommision, settotalCommision] = useState(0)
  const [totalPayoutDistribution, settotalPayoutDistribution] = useState(0)
  const [totalCompanyRevenue, settotalCompanyRevenue] = useState(0)
  const [dataSource, setDataSource] = useState([])
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
      title: 'Pay out Date',
      dataIndex: 'payoutDate',
      sorter: {
        compare: (a, b) => a.payoutDate.localeCompare(b.payoutDate),
        multiple: 2
      },
      render: (text, record) => new Date(record.payoutDate).toLocaleDateString(),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.payoutDate)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.totalSaleFromVendor)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.totalCommision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.totalPayoutDistribution)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.companyRevenue)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'TotalSaleFromVendor',
      dataIndex: 'totalSaleFromVendor',
      sorter: {
        compare: (a, b) => a.totalSaleFromVendor - b.totalSaleFromVendor,
        multiple: 2
      }
    },
    {
      title: 'TotalCommision',
      dataIndex: 'totalCommision',
      sorter: {
        compare: (a, b) => a.totalCommision - b.totalCommision,
        multiple: 2
      }
    },
    {
      title: 'TotalPayoutDistribution',
      dataIndex: 'totalPayoutDistribution',
      sorter: {
        compare: (a, b) => a.totalPayoutDistribution - b.totalPayoutDistribution,
        multiple: 2
      }
    },
    {
      title: 'Company Revenue',
      dataIndex: 'companyRevenue',
      sorter: {
        compare: (a, b) => a.companyRevenue - b.companyRevenue,
        multiple: 2
      }
    }
  ]

  //----------
  //  Table Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    let filter = dataSource.filter(
      d => new Date(d.payoutDate) >= new Date(dateFrom) && new Date(d.payoutDate) <= new Date(dateTo)
    )
    setData(filter)
    let totalSale = 0
    let commision = 0
    let payout = 0
    let revenue = 0
    filter.forEach(d => {
      totalSale += parseFloat(d.totalSaleFromVendor)
      commision += parseFloat(d.totalCommision)
      payout += parseFloat(d.totalPayoutDistribution)
      revenue += parseFloat(d.companyRevenue)
    })
    settotalSale(totalSale)
    settotalCommision(commision)
    settotalPayoutDistribution(payout)
    settotalCompanyRevenue(revenue)
  }

  //----------
  //  Table Actions - Reset Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let totalSale = 0
    let commision = 0
    let payout = 0
    let revenue = 0
    dataSource.forEach(d => {
      totalSale += parseFloat(d.totalSaleFromVendor)
      commision += parseFloat(d.totalCommision)
      payout += parseFloat(d.totalPayoutDistribution)
      revenue += parseFloat(d.companyRevenue)
    })
    settotalSale(totalSale)
    settotalCommision(commision)
    settotalPayoutDistribution(payout)
    settotalCompanyRevenue(revenue)
  }

  //----------
  //  JSX
  //----------
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
                        pageSizeOptions: ['10', '25', '50', '100'],
                        locale: { items_per_page: '' }
                      }
                    : false
                }
                onChange={pagination => setPagination(pagination)}
              />

              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Sale= {totalSale.toFixed(2)}
              </Typography>
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Commission= {totalCommision.toFixed(2)}
              </Typography>
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Commission= {totalPayoutDistribution.toFixed(2)}
              </Typography>
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Company Revenue= {totalCompanyRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default AdminRevenueReport
