//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from 'react'

//----------
// MUI Imports
//----------
import {
  Grid,
  Button, Typography,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress
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

const AddNewService = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [service, setService] = useState(null)
  const [id, setId] = useState(null)
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/services`, {
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
  //  Actions - Delete Service Alert
  //----------
  const deleteServiceAlert = id => {
    setId(id)
    setDeleteModalOpen(true)
  }

  //----------
  //  Actions - Close Delete Modal
  //----------
  const handleClose = () => {
    setDeleteModalOpen(false)
  }

  //----------
  //  Actions - Delete Service
  //----------
  const deleteService = () => {
    if (id) {
      setOpen(true)
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/services/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(resp => {
          setOpen(false)
          setDeleteModalOpen(false)
          let data = resp.data
          setService('')
          if (data.success) {
            toast.success(data.message)
            const tempData = data.services.map((d, key) => {
              return { key, ...d }
            })
            setData(tempData)
          } else {
            toast.error(data.message)
          }
        })
        .catch(error => {
          setDeleteModalOpen(false)
          setOpen(false)
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
  //  Actions - Create Service
  //----------
  const createService = () => {
    if (service) {
      setOpen(true)
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/services`,
          {
            service_name: service
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.accessToken}`
            }
          }
        )
        .then(resp => {
          let data = resp.data
          setService('')
          setOpen(false)
          if (data.success) {
            toast.success(data.message)
            const tempData = data.services.map((d, key) => {
              return { key, ...d }
            })
            setData(tempData)
          } else {
            toast.error(data.message)
          }
        })
        .catch(error => {
          setOpen(false)
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
    } else {
      toast.error('Service field is required')
    }
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
      title: 'Service Name',
      dataIndex: 'service_name',
      sorter: {
        compare: (a, b) => a.service_name.localeCompare(b.service_name),
        multiple: 2
      },
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.service_name)
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
      title: 'Date',
      dataIndex: 'date',
      sorter: {
        compare: (a, b) => a.service_name.localeCompare(b.service_name),
        multiple: 2
      },
      render: (text, record) => new Date(record.date).toLocaleDateString()
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Button
            variant='contained'
            sx={{ mr: 2 }}
            onClick={() => {
              deleteServiceAlert(object.id)
            }}
          >
            Delete Service
          </Button>
        </>
      )
    }
  ]

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h6' sx={{ my: 3 }}>
            Add Services
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label='Service'
            onChange={e => setService(e.target.value)}
            value={service}
            placeholder='Service'
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={createService} disabled={!service ? true : false}>
            Add Service
          </Button>
        </Grid>
        <Grid item xs={12}>
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
          <DialogTitle id='scroll-dialog-title'>Delete Service</DialogTitle>
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
            <Button onClick={deleteService}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default AddNewService
