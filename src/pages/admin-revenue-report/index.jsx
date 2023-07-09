//----------
// React Imports
//----------

// Importing necessary hooks from 'react'
import { useEffect, useState } from 'react'

//----------
// MUI Imports
//----------

// Importing MUI components and styling elements from the '@mui' library
import { Grid, Button, Box, Typography, Card, CardContent } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'

//----------
// MUI Icon Imports
//----------

// Importing MUI icons from the '@mui/icons-material' library
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

//----------
// Other library Imports
//----------

// Importing necessary libraries and utilities
import { toast } from 'react-hot-toast'
import { Table, Input } from 'antd'
import axios from 'axios'

//----------
// Local Imports
//----------

// Importing custom hooks from the 'src/hooks' directory
import { useAuth } from 'src/hooks/useAuth'

//----------
// Constants
//----------

// Array of sort directions for the table column sorting
const sorter = ['ascend', 'descend']

//----------
// AdminRevenueReport Component
//----------

const AdminRevenueReport = () => {
  //----------
  //  States
  //----------

  // State variable to store the fetched data
  const [data, setData] = useState([])

  // State variables to store and update total sale, commission, payout distribution, and company revenue
  const [totalSale, setTotalSale] = useState(0)
  const [totalCommision, setTotalCommission] = useState(0)
  const [totalPayoutDistribution, setTotalPayoutDistribution] = useState(0)
  const [totalCompanyRevenue, setTotalCompanyRevenue] = useState(0)

  // State variables for managing data source and filter settings
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

  // Using custom 'useAuth' hook to access authentication related functionality
  const auth = useAuth()

  //----------
  //  Effects
  //----------

  // Fetching revenue report data on component mount
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/admin-revenue/report`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          // Updating state variables with the fetched data
          setTotalSale(response.data.totalSale)
          setTotalCommission(response.data.totalCommision)
          setTotalPayoutDistribution(response.data.totalPayoutDistribution)
          setTotalCompanyRevenue(response.data.totalCompanyRevenue)

          // Mapping the fetched data and adding a 'key' property to each item
          const tempData = response.data.data.map((d, key) => {
            return { key, ...d }
          })

          // Updating the state variables with the mapped data
          setData(tempData)
          setDataSource(tempData)
        })
        .catch(error => {
          // Displaying error toast message if API request fails
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )

          // Logging out the user if the API request returns an unauthorized status code (401)
          if (error.response && error.response.status === 401) {
            auth.logout()
          }
        })
    }

    // Loading data on component mount
    loadData()
  }, [])

  //----------
  // Table Configuration
  //----------

  // Configuration for the columns of the table
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
        // Custom filter function for filtering the table rows based on multiple columns
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
  // Table Actions - Apply Filter
  //----------

  // Function to apply the selected filter to the table data
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()

    // Filtering the dataSource based on the selected date range
    let filter = dataSource.filter(
      d => new Date(d.payoutDate) >= new Date(dateFrom) && new Date(d.payoutDate) <= new Date(dateTo)
    )

    // Updating the state variables with the filtered data and calculating total values
    setData(filter)
    let totalSale = 0
    let commission = 0
    let payout = 0
    let revenue = 0
    filter.forEach(d => {
      totalSale += parseFloat(d.totalSaleFromVendor)
      commission += parseFloat(d.totalCommision)
      payout += parseFloat(d.totalPayoutDistribution)
      revenue += parseFloat(d.companyRevenue)
    })
    setTotalSale(totalSale)
    setTotalCommission(commission)
    setTotalPayoutDistribution(payout)
    setTotalCompanyRevenue(revenue)
  }

  //----------
  // Table Actions - Reset Filter
  //----------

  // Function to reset the applied filter and display the original table data
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let totalSale = 0
    let commission = 0
    let payout = 0
    let revenue = 0
    dataSource.forEach(d => {
      totalSale += parseFloat(d.totalSaleFromVendor)
      commission += parseFloat(d.totalCommision)
      payout += parseFloat(d.totalPayoutDistribution)
      revenue += parseFloat(d.companyRevenue)
    })
    setTotalSale(totalSale)
    setTotalCommission(commission)
    setTotalPayoutDistribution(payout)
    setTotalCompanyRevenue(revenue)
  }

  //----------
  // JSX
  //----------

  // JSX code that defines the structure and layout of the component's UI
  return (
    <>
      {/* Admin Commission Report Heading */}
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Admin Commission Report
          </Typography>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Card component for the filter and table */}
          <Card component='div' sx={{ position: 'relative' }}>
            <CardContent>
              <Grid container spacing={3}>
                {/* DateRangePicker for selecting the filter date range */}
                <Grid item md={5} xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      calendars={2}
                      value={filterDateRange}
                      onChange={newValue => setFilterDateRange(newValue)}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Apply Filter Button */}
                <Grid item md={1} xs={2}>
                  <Button
                    variant='contained'
                    sx={{ mr: 2, mt: 2 }}
                    onClick={applyFilter}
                    disabled={!filterDateRange[0] || !filterDateRange[1]}
                    size='small'
                  >
                    <FilterAltIcon />
                  </Button>
                </Grid>

                {/* Reset Filter Button */}
                <Grid item md={1} xs={2}>
                  <Button variant='contained' sx={{ mr: 2, mt: 2 }} onClick={resetFilter} color='error' size='small'>
                    <FilterAltOffIcon />
                  </Button>
                </Grid>

                {/* Search Input */}
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

              {/* Table component to display the data */}
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

              {/* Total Sale */}
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Sale= {totalSale.toFixed(2)}
              </Typography>

              {/* Total Commission */}
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Commission= {totalCommision?.toFixed(2)}
              </Typography>

              {/* Total Payout Distribution */}
              <Typography variant='div' sx={{ my: 2, fontWeight: 'bold', display: 'block' }}>
                Total Payout Distribution= {totalPayoutDistribution.toFixed(2)}
              </Typography>

              {/* Total Company Revenue */}
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
