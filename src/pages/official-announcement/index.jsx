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
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import TextareaAutosize from '@mui/base/TextareaAutosize'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import { Table } from 'antd'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
// Constants
//----------
const sorter = ['ascend', 'descend']
const scroll = 'paper'

const OfficialAnnouncement = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [status, setStatus] = useState(null)
  const [id, setId] = useState(null)
  const [add, setAdd] = useState(false)
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement`, {
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
  //  Table Actions - Edit Item
  //----------
  const editItem = id => {
    let item = data.filter(d => id == d.n_id)
    item.map(i => {
      setId(i.n_id)
      setDescription(i.description)
      setTitle(i.news_name)
      setStatus(i.status)
    })
    setAdd(false)
    setEditModalOpen(true)
  }

  //----------
  //  Table Actions - Delete Item
  //----------
  const deleteItem = id => {
    let item = data.filter(d => id == d.n_id)
    item.map(i => {
      setId(i.n_id)
    })
    setDeleteModalOpen(true)
  }

  //----------
  //  Table Actions - Add New Item
  //----------
  const addNewItem = () => {
    setId(null)
    setDescription(null)
    setTitle(null)
    setStatus(null)
    setAdd(true)
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
      title: 'Title',
      dataIndex: 'news_name',
      sorter: {
        compare: (a, b) => a.news_name.localeCompare(b.news_name),
        multiple: 2
      }
    },

    {
      title: 'Posted Date',
      dataIndex: 'posted_date',
      sorter: {
        compare: (a, b) => a.posted_date.localeCompare(b.posted_date),
        multiple: 2
      },
      render: (text, record) => new Date(record.posted_date).toLocaleDateString()
    },
    {
      title: 'status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.t_date.localeCompare(b.t_date),
        multiple: 2
      },
      render: (text, record) => (record.status === 0 ? 'Inactive' : 'Active')
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Grid item xs={6}>
            <Link href='javascript:void(0)' onClick={() => editItem(object.n_id)}>
              Edit
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link href='javascript:void(0)' onClick={() => deleteItem(object.n_id)}>
              Delete
            </Link>
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
  //  Table Actions - Update Announcement
  //----------
  const updateAnnoucement = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement/${id}`,
        {
          title: title,
          status: status,
          description: description
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        setEditModalOpen(false)
        let tempData = data.map(d => {
          if (d.n_id == id) {
            d.status = status
            d.news_name = title
            d.description = description
          }
          return d
        })
        setData(tempData)
        toast.success(response.data.message)
      })
      .catch(error => {
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
  //  Table Actions - Add Announcement
  //----------
  const addAnnoucement = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement`,
        {
          title: title,
          status: status,
          description: description
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        setEditModalOpen(false)
        let newObj = response.data.data
        let lastKey = 0
        data.map(d => {
          lastKey = d.key
        })
        newObj.key = lastKey ? lastKey + 1 : lastKey
        let tempData = [...data, newObj]

        setData(tempData)
        toast.success(response.data.message)
      })
      .catch(error => {
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
  //  Table Actions - Delete Announcement
  //----------
  const deleteAnnoucement = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setDeleteModalOpen(false)
        let tempData = data.filter(d => d.n_id != id)
        let key = 0
        tempData.map(d => {
          d.key = key
          key++
          return d
        })
        setData(tempData)
        toast.success(response.data.message)
      })
      .catch(error => {
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
            Official Announcement{' '}
          </Typography>
          <Button onClick={addNewItem}>Add New</Button>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Table
            columns={columns}
            dataSource={data}
            loading={false}
            sortDirections={sorter}
            pagination={
              data?.length > 0
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
          <DialogTitle id='scroll-dialog-title'>{add ? 'Create' : 'Update'} Annoucement</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Title'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
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
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id='status'>Status</InputLabel>
                          <Select
                            labelId='status-label'
                            id='status-select'
                            label='Status'
                            placeholder='Select Status'
                            onChange={e => setStatus(e.target.value)}
                            value={status}
                          >
                            {[0, 1].map(c => (
                              <MenuItem value={c}>{c ? 'Active' : 'Inactive'}</MenuItem>
                            ))}
                          </Select>
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
            <Button onClick={!add ? updateAnnoucement : addAnnoucement}>{add ? 'Create' : 'Update'}</Button>
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
          <DialogTitle id='scroll-dialog-title'>Delete Annoucement</DialogTitle>
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
            <Button onClick={deleteAnnoucement}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default OfficialAnnouncement
