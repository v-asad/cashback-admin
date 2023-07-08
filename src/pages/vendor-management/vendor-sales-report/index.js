//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from 'react'

//----------
// MUI Imports
//----------
import {
  Grid,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
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
const scroll = 'paper'

const VendorSalesReport = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [detailedData, setDetailedData] = useState([])
  const [invoiceNo, setInvoiceNo] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [invoice, setInvoice] = useState([])
  const [totalSale, setTotalSale] = useState(0)
  const [totalCommision, setTotalCommision] = useState(0)
  const [filterDateRange, setFilterDateRange] = useState([null, null])
  const descriptionElementRef = useRef(null)
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
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/sales-report`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          const tempData = response.data.data.map((d, key) => {
            return { key, ...d }
          })
          setData(tempData)
          setDataSource(tempData)
          setData(tempData)
          let total = 0
          let commision = 0
          tempData.forEach(d => {
            commision += parseFloat(d.commision)
            total += parseFloat(d.invoice_amount)
          })
          setTotalSale(total)
          setTotalCommision(commision)
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
  //  Handlers
  //----------
  const handleClose = () => setDetailsModalOpen(false)
  const handleInvoiceClose = () => setEditModalOpen(false)

  //----------
  //  Actions - View Invoice No
  //----------
  const viewInvoiceNo = inv => {
    setInvoiceNo(inv)
    setOpen(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/invoices/${inv}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setOpen(false)
        setEditModalOpen(true)
        setInvoice(response.data)
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

  //----------
  //  Actions - View Invoice
  //----------
  const viewInvoice = vendor_id => {
    setOpen(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/sales-report/${vendor_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        const tempData = response.data.data.map((d, key) => {
          return { key, ...d }
        })
        setOpen(false)
        setDetailedData(tempData)
        setDetailsModalOpen(true)
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

  //----------
  //  Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    let filter = dataSource.filter(
      d => new Date(d.receive_date) >= new Date(dateFrom) && new Date(d.receive_date) <= new Date(dateTo)
    )
    setData(filter)
    let total = 0
    let commision = 0
    filter.forEach(d => {
      commision += parseFloat(d.commision)
      total += parseFloat(d.invoice_amount)
    })
    setTotalSale(total)
    setTotalCommision(commision)
  }

  //----------
  //  Actions - Reset Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let total = 0
    let commision = 0
    dataSource.forEach(d => {
      commision += parseFloat(d.commision)
      total += parseFloat(d.invoice_amount)
    })
    setTotalSale(total)
    setTotalCommision(commision)
  }

  //----------
  //  Table Configurations
  //----------
  const columns = [
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Transaction No',
      dataIndex: 'transaction_no',
      sorter: {
        compare: (a, b) => a.transaction_no.localeCompare(b.transaction_no),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.transaction_no)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.vendor_id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.vendor_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.invoice_amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commission_percent)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.receive_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'Vendor Id',
      dataIndex: 'vendor_id',
      sorter: {
        compare: (a, b) => a.vendor_id.localeCompare(b.vendor_id),
        multiple: 2
      }
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      sorter: {
        compare: (a, b) => a.vendor_name.localeCompare(b.vendor_name),
        multiple: 2
      }
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'invoice_amount',
      sorter: {
        compare: (a, b) => a.invoice_amount.localeCompare(b.invoice_amount),
        multiple: 2
      }
    },
    {
      title: 'Commission Percent',
      dataIndex: 'commission_percent',
      sorter: {
        compare: (a, b) => a.commission_percent.localeCompare(b.commission_percent),
        multiple: 2
      }
    },
    {
      title: 'Commission ',
      dataIndex: 'commision',
      sorter: {
        compare: (a, b) => a.commision.localeCompare(b.commision),
        multiple: 2
      }
    },
    {
      title: 'Receive Date',
      dataIndex: 'receive_date',
      sorter: {
        compare: (a, b) => a.receive_date.localeCompare(b.receive_date),
        multiple: 2
      },
      render: (text, record) => new Date(record.receive_date).toLocaleDateString()
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link href='javascript:void(0)' onClick={() => viewInvoice(object.vendor_id)}>
            View Details
          </Link>
        </>
      )
    }
  ]
  const detailedColumn = [
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Transaction No',
      dataIndex: 'transaction_no',
      sorter: {
        compare: (a, b) => a.transaction_no.localeCompare(b.transaction_no),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.transaction_no)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.vendor_id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.vendor_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.invoice_amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commission_percent)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commision)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.receive_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'Vendor Id',
      dataIndex: 'vendor_id',
      sorter: {
        compare: (a, b) => a.vendor_id.localeCompare(b.vendor_id),
        multiple: 2
      }
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      sorter: {
        compare: (a, b) => a.vendor_name.localeCompare(b.vendor_name),
        multiple: 2
      }
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'invoice_amount',
      sorter: {
        compare: (a, b) => a.invoice_amount.localeCompare(b.invoice_amount),
        multiple: 2
      }
    },
    {
      title: 'Commission Percent',
      dataIndex: 'commission_percent',
      sorter: {
        compare: (a, b) => a.commission_percent.localeCompare(b.commission_percent),
        multiple: 2
      }
    },
    {
      title: 'Commission ',
      dataIndex: 'commision',
      sorter: {
        compare: (a, b) => a.commision.localeCompare(b.commision),
        multiple: 2
      }
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice',
      render: (_, object, index) => (
        <>
          <Link href='javascript:void(0)' onClick={() => viewInvoiceNo(object.invoice)}>
            {object.invoice}
          </Link>
        </>
      )
    },
    {
      title: 'Receive Date',
      dataIndex: 'receive_date',
      sorter: {
        compare: (a, b) => a.receive_date.localeCompare(b.receive_date),
        multiple: 2
      },
      render: (text, record) => new Date(record.receive_date).toLocaleDateString()
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
            Admin Commission Report
          </Typography>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative', mt: 20 }}>
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
            </CardContent>
            <Typography variant='h5' sx={{ my: 1, mx: 10 }}>
              Total Sale : {totalSale.toFixed(2)}
            </Typography>
            <Typography variant='h5' sx={{ my: 1, mx: 10 }}>
              Total Commision : {totalCommision.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <div>
        <Dialog
          open={detailsModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
          fullScreen
        >
          <DialogActions>
            <Button varient='outlined' onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
          <DialogTitle id='scroll-dialog-title'>Admin Commission Report Details</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mt: 20 }}>
                <CardContent>
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
                  <Table
                    columns={detailedColumn}
                    dataSource={data}
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
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleInvoiceClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Invoice Details [{invoiceNo}]</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Grid item xs={12}></Grid>

              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex' }}>
                        TOTAL PURCHASE:{' '}
                        {new Intl.NumberFormat(`${localStorage.localization}`, {
                          style: 'currency',
                          currency: process.env.NEXT_PUBLIC_CURRENCY
                        }).format(invoice?.total_purchase)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <b>TO</b>: {invoice?.user?.first_name} {invoice?.user?.last_name}
                      </Typography>
                      <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <b>Address</b>: {invoice?.user?.address} {invoice?.user?.city} {invoice?.user?.state}{' '}
                        {invoice?.user?.country}
                      </Typography>
                      <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <b>Tel</b>: {invoice?.user?.telephone}
                      </Typography>
                      <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <b>OFFICE ADDRESS</b>: {invoice?.office_address}
                      </Typography>

                      <Typography
                        variant='div'
                        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
                      >
                        INVOICE INFO
                        <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          Invoice Number: <b>{invoice?.invoice_no}</b>
                        </Typography>
                        <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          Invoice Date: <b>{new Date(invoice?.invoice_date).toLocaleDateString()}</b>
                        </Typography>
                        <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          Invoice Status: <b>{invoice?.invoice_status}</b>
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  <Card component='div' sx={{ position: 'relative', my: 7 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align='center'>ITEM</TableCell>
                                <TableCell align='center'>UNIT COST</TableCell>
                                <TableCell align='center'>QUANTITY</TableCell>
                                <TableCell align='center'>TOTAL</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {invoice?.items?.map((i, key) => (
                                <>
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component='th' scope='row'>
                                      {key + 1}
                                    </TableCell>
                                    <TableCell align='center'>{i.product_name}</TableCell>
                                    <TableCell align='center'>{i.price}</TableCell>
                                    <TableCell align='center'>{i.quantity}</TableCell>
                                    <TableCell align='center'>{i.net_price}</TableCell>
                                  </TableRow>
                                </>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant='div' sx={{ my: 8, fontWeight: 'bold', display: 'flex' }}>
                            Subtotal:{' '}
                            {new Intl.NumberFormat(`${localStorage.localization}`, {
                              style: 'currency',
                              currency: process.env.NEXT_PUBLIC_CURRENCY
                            }).format(invoice?.subtotal)}
                          </Typography>
                          <Typography variant='div' sx={{ my: 8, fontWeight: 'bold', display: 'flex' }}>
                            GRAND TOTAL:{' '}
                            {new Intl.NumberFormat(`${localStorage.localization}`, {
                              style: 'currency',
                              currency: process.env.NEXT_PUBLIC_CURRENCY
                            }).format(invoice?.grand_total)}
                          </Typography>
                        </Box>
                      </Grid>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInvoiceClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default VendorSalesReport
