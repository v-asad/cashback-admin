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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Backdrop,
  CircularProgress,TextField 
} from '@mui/material'

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

const ManageUserWallet = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [manageModel, setManageModel] = useState(false)
  const [userId, setUserId] = useState(null)
  const [amount, setAmount] = useState(null)
  const [remark, setRemark] = useState(null)
  const [action, setAction] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [detailedData, setDetailedData] = useState([])
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
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/wallet/users`, {
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

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  //----------
  //  Table Configuration
  //----------
  const detailedColumn = [
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'User Id',
      dataIndex: 'userId',
      sorter: {
        compare: (a, b) => a.userId.localeCompare(b.userId),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.userId)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.username)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.senderId)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.senderUsername)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.transactionType)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.credit)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.debit)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.date)
            .replace(' ', '')
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
      title: 'Sender Id',
      dataIndex: 'senderId',
      sorter: {
        compare: (a, b) => a.senderId.localeCompare(b.senderId),
        multiple: 2
      }
    },
    {
      title: 'Sender Username',
      dataIndex: 'senderUsername',
      sorter: {
        compare: (a, b) => a.senderUsername.localeCompare(b.senderUsername),
        multiple: 2
      }
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      sorter: {
        compare: (a, b) => a.transactionType.localeCompare(b.transactionType),
        multiple: 2
      }
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      sorter: {
        compare: (a, b) => a.credit.localeCompare(b.credit),
        multiple: 2
      }
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      sorter: {
        compare: (a, b) => a.debit.localeCompare(b.debit),
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
  //  Handlers
  //----------
  const handleClose = () => {
    setManageModel(false)
    setDetailsModalOpen(false)
  }
  const manageHandler = user_id => {
    setUserId(user_id)
    setManageModel(true)
  }

  //----------
  //  Actions - Update Wallet
  //----------
  const updateWallet = () => {
    if (!action) {
      toast.error(`Add/Subtract is required!`)
    } else {
      setOpen(true)
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/wallet/user/manage`,
          {
            user_id: userId,
            action: action, // add / subtract
            amount: amount,
            remark: remark,
            wallet: 'final_e_wallet'
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(response => {
          toast.success(response.data.message)
          setOpen(false)
          handleClose()
          setAmount('')
          setRemark('')
          setAction('')
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
  }

  //----------
  //  Actions - View Details
  //----------
  const viewDetails = user_id => {
    setOpen(true)
    setUserId(user_id)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/wallet/user/history/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        let tempData = response.data.map((r, key) => {
          return { ...r, key: key }
        })
        setOpen(false)
        setDetailsModalOpen(true)
        setDetailedData(tempData)
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
          String(record.first_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.incomeWallet)
            .replace(' ', '')
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
      title: 'Member Name',
      dataIndex: 'first_name',
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
        multiple: 2
      }
    },
    {
      title: 'Income Wallet',
      dataIndex: 'incomeWallet',
      sorter: {
        compare: (a, b) => a.incomeWallet - b.incomeWallet,
        multiple: 2
      }
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link href='javascript:void(0)' onClick={e => manageHandler(object.user_id)}>
            Manage
          </Link>
        </>
      )
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link href='javascript:void(0)' onClick={() => viewDetails(object.user_id)}>
            View
          </Link>
        </>
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
            Wallet Management{' '}
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
        </CardContent>
      </Card>
      <div>
        <Dialog
          open={manageModel}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Add/Deduct Fund to/from Wallet</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              label='User Id'
                              value={userId}
                              placeholder='User Id'
                              disabled={true}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              onChange={e => setAmount(e.target.value)}
                              value={amount}
                              label='Amount'
                              placeholder='Amount'
                              type='number'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              onChange={e => setRemark(e.target.value)}
                              value={remark}
                              label='Remarks'
                              placeholder='Remarks'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ minWidth: 120 }}>
                              <FormControl fullWidth>
                                <InputLabel id='demo-simple-select-label'>Type</InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  id='demo-simple-select'
                                  label='Action'
                                  placeholder='Action'
                                  onChange={e => setAction(e.target.value)}
                                  value={action}
                                >
                                  {['add', 'subtract'].map(c => (
                                    <MenuItem value={c}>{c}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              label='Wallet Type'
                              placeholder='Wallet Type'
                              disabled={true}
                              value={'Income Wallet'}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={updateWallet}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={detailsModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
          fullScreen
        >
          <DialogTitle id='scroll-dialog-title'>TRANSACTION REPORT FOR {userId}</DialogTitle>
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
                    dataSource={detailedData}
                    loading={false}
                    sortDirections={sorter}
                    pagination={
                      data?.length > 10
                        ? {
                            defaultCurrent: 1,
                            total: detailedData?.length,
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
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Backdrop sx={{ color: '#fff', zIndex: 100000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default ManageUserWallet
