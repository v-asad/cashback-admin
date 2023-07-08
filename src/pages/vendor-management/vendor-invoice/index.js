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
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Paper
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

const VendorInvoices = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [invoice, setInvoice] = useState([])
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [invoiceNo, setInvoiceNo] = useState(null)
  const [invoiceItems, setInvoiceItems] = useState(null)
  const [filterDateRange, setFilterDateRange] = useState([null, null])
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null)

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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/invoices`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          const tempData = response.data.data.map((d, key) => {
            return { key, ...d }
          })
          setTotal(response.data.total_amount)
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
  //  Handlers - Close Edit Modal
  //----------
  const handleClose = () => setEditModalOpen(false)

  //----------
  //  Handlers - View Invoice
  //----------
  const viewInvoice = inv => {
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
        setInvoiceItems(response.data.items)
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
  //  Table Configurations
  //----------
  const columnsInvoice = [
    {
      title: '#',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'ITEM',
      dataIndex: 'product_name'
    },
    {
      title: 'UNIT COST',
      dataIndex: 'price'
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity'
    },
    {
      title: 'TOTAL',
      dataIndex: 'net_price'
    }
  ]
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
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      sorter: {
        compare: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
        multiple: 2
      }
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      sorter: {
        compare: (a, b) => a.total_amount - b.total_amount,
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
    },

    {
      title: 'Vendor',
      dataIndex: 'vendor',
      sorter: {
        compare: (a, b) => a.vendor.localeCompare(b.vendor),
        multiple: 2
      }
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link href='javascript:void(0)' onClick={() => viewInvoice(object.invoice_no)}>
            View Invoice
          </Link>
        </>
      )
    }
  ]

  //----------
  //  Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    let filter = dataSource.filter(d => new Date(d.date) >= new Date(dateFrom) && new Date(d.date) <= new Date(dateTo))
    setData(filter)
    let sum = 0
    filter.forEach(d => {
      sum += parseFloat(d.total_amount)
    })
    setTotal(sum)
  }

  //----------
  //  Actions - Reset Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let sum = 0
    dataSource.forEach(d => {
      sum += parseFloat(d.total_amount)
    })
    setTotal(sum)
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            PURCHASE INVOICES
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
            </CardContent>
            <Typography variant='h5' sx={{ my: 1, mx: 10 }}>
              Total Amount : {total.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
          fullScreen
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
                          <Table
                            columns={columnsInvoice}
                            dataSource={invoiceItems}
                            loading={false}
                            sortDirections={sorter}
                            pagination={
                              data?.length > 10
                                ? {
                                    defaultCurrent: 1,
                                    total: invoiceItems?.length,
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
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default VendorInvoices
