//----------
//  React Imports
//----------
import { useEffect, useRef, useState } from 'react'

//----------
// MUI Imports
//----------
import {
  TextField,
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
  FormControl
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

const sorter = ['ascend', 'descend']

const ManageVideo = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [scroll, setScroll] = useState('paper')
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [link, setLink] = useState(null)
  const [id, setId] = useState(null)
  const [add, setAdd] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })

  //----------
  //  Refs
  //----------
  const descriptionElementRef = useRef(null)

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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/videos`, {
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
  //  Table Actions
  //----------
  const editItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => {
      setId(i.id)
      setDescription(i.description)
      setTitle(i.title)
      setLink(i.video_link)
    })
    setAdd(false)
    setEditModalOpen(true)
  }

  const deleteItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => {
      setId(i.id)
    })
    setDeleteModalOpen(true)
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
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
        multiple: 2
      }
    },
    {
      title: 'Video',
      render: (_, object) => (
        <>
          <iframe
            width='360'
            height='300'
            src={object.video_link.replace('watch?v=', 'embed/')}
            title={object.title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </>
      )
    },
    {
      title: 'Video Link',
      render: (_, object) => (
        <>
          <Link href={object.video_link} target='__blank'>
            Video
          </Link>
        </>
      )
    },
    {
      title: 'Upload Date',
      dataIndex: 'upload_date',
      sorter: {
        compare: (a, b) => a.upload_date.localeCompare(b.upload_date),
        multiple: 2
      },
      render: (text, record) => new Date(record.upload_date).toLocaleDateString()
    },
    {
      title: 'Action',
      render: (_, object) => (
        <>
          <Grid item xs={6}>
            <Link href='javascript:void(0)' onClick={() => editItem(object.id)}>
              Edit
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link href='javascript:void(0)' onClick={() => deleteItem(object.id)}>
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
  //  Video Actions - Update Video
  //----------
  const updateVideo = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/video/${id}`,
        {
          title: title,
          link: link,
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
          if (d.id == id) {
            d.video_link = link
            d.title = title
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
  //  Video Actions - Add Video
  //----------
  const addVideo = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/videos`,
        {
          title: title,
          link: link,
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
        let noKey = true
        data.map(d => {
          lastKey = d.key
          noKey = false
        })
        newObj.key = !noKey ? lastKey + 1 : lastKey
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
  //  Video Actions - Delete Video
  //----------
  const deleteVideo = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/video/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setDeleteModalOpen(false)
        let tempData = data.filter(d => d.id != id)
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
  //  Table Actions
  //----------
  const addNewItem = () => {
    setId(null)
    setDescription(null)
    setTitle(null)
    setLink(null)
    setAdd(true)
    setEditModalOpen(true)
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Manage Video{' '}
          </Typography>
          <Button onClick={addNewItem}>Add New</Button>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Table
            columns={columns}
            dataSource={data}
            loading={tableLoading}
            sortDirections={sorter}
            pagination={
              data?.length > 0
                ? {
                    defaultCurrent: 1,
                    total: data?.length,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total}`,
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
          <DialogTitle id='scroll-dialog-title'>{add ? 'Create' : 'Update'} Video</DialogTitle>
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
                      <TextField
                        xs={6}
                        fullWidth
                        label='Link'
                        placeholder='Link'
                        value={link}
                        onChange={e => setLink(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={!add ? updateVideo : addVideo}>{add ? 'Create' : 'Update'}</Button>
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
          <DialogTitle id='scroll-dialog-title'>Delete Video</DialogTitle>
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
            <Button onClick={deleteVideo}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default ManageVideo
