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
  TextField,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Backdrop,
  CircularProgress
} from '@mui/material'
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
const scroll = 'paper'

const OpenTicketManage = () => {
  //----------
  // States
  //----------
  const [data, setData] = useState([])
  const [ticket, setTicket] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [ticketResponse, setTicketResponse] = useState(null)
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')

  //----------
  // Hooks
  //----------
  const auth = useAuth()

  //----------
  // Refs
  //----------
  const descriptionElementRef = useRef(null)

  //----------
  // Effects
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/tickets`, {
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
  // Table Configuration
  //----------
  const columns = [
    {
      title: 'Sr. No',
      render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
    },
    {
      title: 'Ticket No',
      dataIndex: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 2
      }
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
          String(record.id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.user_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.subject)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.tasktype)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.t_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.status)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'User Name',
      dataIndex: 'user_name',
      sorter: {
        compare: (a, b) => a.user_name.localeCompare(b.user_name),
        multiple: 2
      }
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      sorter: {
        compare: (a, b) => a.subject.localeCompare(b.subject),
        multiple: 2
      }
    },
    {
      title: 'Category',
      dataIndex: 'tasktype',
      sorter: {
        compare: (a, b) => a.tasktype.localeCompare(b.tasktype),
        multiple: 2
      }
    },
    {
      title: 'Posted Date',
      dataIndex: 't_date',
      sorter: {
        compare: (a, b) => a.t_date.localeCompare(b.t_date),
        multiple: 2
      },
      render: (text, record) => new Date(record.t_date).toLocaleDateString()
    },

    {
      title: 'status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.t_date.localeCompare(b.t_date),
        multiple: 2
      },
      render: (text, record) => (record.status === 0 ? 'Not Responded' : 'Responded')
    },

    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Grid spacing={0}>
            <Grid item sx={{ display: 'flex' }}>
              <Link href='javascript:void(0)' onClick={() => editItem(object.id)} sx={{ mr: 5, display: 'flex' }}>
                Edit
              </Link>

              <Link href='javascript:void(0)' onClick={() => deleteItem(object.id)}>
                Delete
              </Link>
            </Grid>
          </Grid>
        </>
      )
    }
  ]

  //----------
  //  Handlers
  //----------
  const handleClose = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
  }

  //----------
  //  Table Actions - Edit Item
  //----------
  const editItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => setTicket(i))
    setEditModalOpen(true)
  }

  //----------
  //  Table Actions - Delete Item
  //----------
  const deleteItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => {
      setTicket(i)
    })
    setDeleteModalOpen(true)
  }

  //----------
  //  Table Actions - Update Ticket
  //----------
  const updateTicket = () => {
    let errors = 0
    if (!ticketResponse) {
      toast.error('Write response to submit ticket')
      errors++
    }

    if (!errors) {
      setOpen(true)
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/tickets/${ticket.id}`,
          {
            response: ticketResponse
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(response => {
          setOpen(false)
          setEditModalOpen(false)
          let tempData = data.filter(d => d.id != ticket.id)
          tempData = tempData.map((d, key) => {
            d.key = key
            return d
          })
          setData(tempData)
          setTicketResponse(null)
          setTicket(null)
          toast.success(response.data.message)
        })
        .catch(error => {
          if (error.response && error.response.data) {
            if (error.response.data && error.response.data.message) {
              toast.error(
                `${error.response ? error.response.status : ''}: ${
                  error.response ? error.response.data.message : error
                }`
              )
            }
            if (error.response.data && error.response.data.errors) {
              error.response.data.errors.map(err => toast.error(err.msg))
            }
          }
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
    }
  }

  //----------
  //  Table Actions - Delete Ticket
  //----------
  const deleteTicket = () => {
    setOpen(true)
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/tickets/${ticket.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setDeleteModalOpen(false)
        setOpen(false)
        let tempData = data.filter(d => d.id != ticket.id)
        tempData.map((d, key) => {
          d.key = key
          key++
          return d
        })
        setData(tempData)
        toast.success(response.data.message)
      })
      .catch(error => {
        setOpen(false)
        if (error.response && error.response.data) {
          if (error.response.data && error.response.data.message) {
            toast.error(
              `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
            )
          }
          if (error.response.data && error.response.data.errors) {
            error.response.data.errors.map(err => toast.error(err.msg))
          }
        }
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            User Open Tickets
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
          open={editModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>OPEN TICKET RESPONSE</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Ticket Number'
                        value={ticket?.id}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Username'
                        value={ticket?.user_name}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='User Id'
                        value={ticket?.user_id}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Category Type'
                        value={ticket?.tasktype}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Subject'
                        value={ticket?.subject}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Posted Date'
                        value={ticket ? new Date(ticket.t_date).toLocaleDateString() : ''}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <TextareaAutosize
                            xs={6}
                            fullWidth
                            minRows={3}
                            label='Description'
                            placeholder='Description'
                            value={ticket?.description}
                            readOnly
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <TextareaAutosize
                            xs={6}
                            fullWidth
                            minRows={3}
                            label='Response'
                            placeholder='Response'
                            onChange={e => {
                              setTicketResponse(e.target.value)
                            }}
                            value={ticketResponse}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={updateTicket}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={deleteModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>Delete Ticket</DialogTitle>
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
            <Button onClick={deleteTicket}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default OpenTicketManage
