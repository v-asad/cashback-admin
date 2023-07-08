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
  DialogTitle
} from '@mui/material'
import { styled } from '@mui/system'
import TextareaAutosize from '@mui/base/TextareaAutosize'

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
const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
}
const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f'
}
const scroll = 'paper'

//----------
//  Styled Components
//----------
const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 320px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 24px ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    &:hover {
      border-color: ${blue[400]};
    }
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
    &:focus-visible {
      outline: 0;
    }
  `
)

const VendorPaymentRequest = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [rejectRemark, setRejectRemark] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [id, setId] = useState(null)
  const [status, setStatus] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/payment-request-report`, {
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
    loadData()
  }, [])


  //----------
  //  Actions - Change Status
  //----------
  const changeStatus = () => {
    setOpen(true)
    if (status == 'approve') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/payment-request/approve/${id}/1`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          handleClose()
          setOpen(false)
          toast.success(response.data.message)
          const tempData = data.map((d, key) => {
            if (d.id == id) {
              d.status = 1
            }
            return d
          })
          setData(tempData)
        })
        .catch(error => {
          handleClose()
          setOpen(false)
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
    }

    if (status == 'reject') {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/payment-request/reject/${id}`,
          {
            remark: rejectRemark
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(response => {
          setOpen(false)
          toast.success(response.data.message)
          const tempData = data.map((d, key) => {
            if (d.id == id) {
              d.status = 2
            }
            return d
          })
          setData(tempData)
          handleClose()
        })
        .catch(error => {
          setOpen(false)
          handleClose()
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
    }
  }

  //----------
  //  Handlers
  //----------
  const checkAction = (id, status) => {
    setId(id)
    setStatus(status)
    setDeleteModalOpen(true)
  }
  const handleClose = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
  }
  const callPopup = () => {
    setDeleteModalOpen(false)
    setEditModalOpen(true)
  }

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
          String(record.payment_mode)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.amount)
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
      title: 'Username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      }
    },
    {
      title: 'Payment mode',
      dataIndex: 'payment_mode',
      sorter: {
        compare: (a, b) => a.payment_mode.localeCompare(b.payment_mode),
        multiple: 2
      }
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link href={object.pay_proof} target='__blank'>
            View
          </Link>
        </>
      )
    },
    {
      title: 'Amount (SAR)',
      dataIndex: 'amount',
      sorter: {
        compare: (a, b) => a.amount.localeCompare(b.amount),
        multiple: 2
      }
    },
    {
      title: 'Posted Date',
      dataIndex: 'posted_date',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      },
      render: (text, record) => new Date(record.posted_date).toLocaleDateString()
    },
    {
      title: 'Action',
      render: (_, object, index) =>
        object.status == 0 ? (
          <>
            <Grid item xs={12}>
              <Link href='javascript:void(0)' onClick={() => checkAction(object.id, 'approve')}>
                Approve
              </Link>
            </Grid>{' '}
            <Grid item xs={6}>
              <Link href='javascript:void(0)' onClick={() => checkAction(object.id, 'reject')}>
                Reject
              </Link>
            </Grid>
          </>
        ) : object.status == 1 ? (
          'Approved'
        ) : object.status == 2 ? (
          'Cancelled'
        ) : (
          ''
        )
    },
    {
      field: 'action',
      headerName: 'Status',
      width: 150,
      renderCell: params =>
        params.row.status == 0 ? (
          <>
            <Grid item xs={12}>
              <Link href='javascript:void(0)' onClick={() => checkAction(params.row.id, 'approve')}>
                Approve
              </Link>
            </Grid>{' '}
            <Grid item xs={6}>
              <Link href='javascript:void(0)' onClick={() => checkAction(params.row.id, 'reject')}>
                Reject
              </Link>
            </Grid>
          </>
        ) : params.row.status == 1 ? (
          'Approved'
        ) : params.row.status == 2 ? (
          'Cancelled'
        ) : (
          ''
        )
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
            Dues clear request Report
          </Typography>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative', mt: 20 }}>
            <CardContent>
              <Input.Search
                type='search'
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
          </Card>
        </Grid>
      </Grid>
      <div>
        <Dialog
          open={deleteModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>{status} Request</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography>Are you sure? This action can't be undone</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={status == 'reject' ? callPopup : changeStatus}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Reject Request</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <StyledTextarea
                          aria-label='minimum height'
                          minRows={5}
                          placeholder='Remarks'
                          value={rejectRemark}
                          onChange={e => setRejectRemark(e.target.value)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={changeStatus}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: 100000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default VendorPaymentRequest
