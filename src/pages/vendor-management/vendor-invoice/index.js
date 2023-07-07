import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import Link from '@mui/material/Link';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useRouter } from 'next/router'
import { Table, Input } from 'antd'
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


const VendorInvoices = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [invoice, setInvoice] = useState([])
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null)
  const [invoiceItems, setInvoiceItems] = useState(null)
  const [scroll, setScroll] = useState('paper');
  const [tableLoading, setTableLoading] = useState(false)
  const [filterDateRange, setFilterDateRange] = useState([null, null])
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('');
  const router = useRouter() 
  const handleClose = () => {
    setEditModalOpen(false);
  };
  
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  
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
  const viewInvoice = (inv) => {
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
  useEffect(() => {
    loadData()
  }, [])

  const columnsInvoice = [
    {
      title: '#',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'ITEM',
      dataIndex: 'product_name',
    },
    {
      title: 'UNIT COST',
      dataIndex: 'price'
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity'
    },{
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
        multiple: 2,
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2,
      },
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      sorter: {
        compare: (a, b) => a.invoice_no.localeCompare(b.invoice_no),
        multiple: 2,
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      sorter: {
        compare: (a, b) => a.total_amount-b.total_amount,
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
  
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      sorter: {
        compare: (a, b) => a.vendor.localeCompare(b.vendor),
        multiple: 2,
      },
    
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
        <Link href='javascript:void(0)' onClick={() => viewInvoice(object.invoice_no)}>View Invoice</Link>
        </>
      )
    },
    
    ]

  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    let filter = dataSource.filter(d =>  (new Date(d.date) >= new Date(dateFrom) && new Date(d.date) <= new Date(dateTo) ))
    setData(filter)
    let sum = 0
    filter.forEach(d => {
      sum += parseFloat(d.total_amount)
    })
    setTotal(sum)
  }

  const resetFilter = () => {
    if(filterDateRange){
      setFilterDateRange([null, null])
    }
    setData(dataSource)
    let sum = 0
    dataSource.forEach(d => {
      sum += parseFloat(d.total_amount)
    })
    setTotal(sum)
  }
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
                    <DateRangePicker calendars={2} value={filterDateRange} onChange={(newValue) => setFilterDateRange(newValue)} />
                </LocalizationProvider>
              </Grid>
            
              <Grid item md={1} xs={2}>
                <Button variant='contained' sx={{ mr: 2, mt: 2}} onClick={applyFilter} disabled={!filterDateRange[0] || !filterDateRange[1] ? true : false} size="small">
                  <FilterAltIcon />
                </Button>
              </Grid>
              <Grid item md={1} xs={2}>
                <Button variant='contained' sx={{ mr: 2, mt: 2}} onClick={resetFilter} color="error" size="small">
                <FilterAltOffIcon />
                </Button>
              </Grid>
              <Grid item md={5} xs={8}>
                <Input.Search
                  placeholder='Search here.....'
                  style={{ maxWidth: 300, marginBottom: 8, display: 'block', height: 50, float: 'right',border:'black' }}
                  onSearch={value => {
                    setSearchedText(value)
                  }}
                  onChange={  e => {
                    setSearchedText(e.target.value)
                  } }
                />
              </Grid>
            </Grid>
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
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullScreen
        >
          <DialogTitle id="scroll-dialog-title">Invoice Details [{invoiceNo}]</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid item xs={12}>
        </Grid>

        <Card component='div' sx={{ position: 'relative', mb: 7 }}>
          <CardContent>
            <Grid item xs={12}>
              <Box>
                <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex' }}>
                  TOTAL PURCHASE: {new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(invoice?.total_purchase)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <b>TO</b>: {invoice?.user?.first_name} {invoice?.user?.last_name}
                </Typography>
                <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <b>Address</b>: {invoice?.user?.address} {invoice?.user?.city} {invoice?.user?.state} {invoice?.user?.country}
                </Typography>
                <Typography variant='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <b>Tel</b>: {invoice?.user?.telephone}
                </Typography>
                <Typography variant='div' sx={{  display: 'flex', justifyContent: 'flex-end' }}>
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
                      loading={tableLoading}
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
                      Subtotal: {new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(invoice?.subtotal)}
                    </Typography>
                    <Typography variant='div' sx={{ my: 8, fontWeight: 'bold', display: 'flex' }}>
                      GRAND TOTAL: {new Intl.NumberFormat( `${localStorage.localization}`, { style: 'currency', currency: process.env.NEXT_PUBLIC_CURRENCY }).format(invoice?.grand_total)}
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
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default VendorInvoices
