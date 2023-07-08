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

//----------
//  Constants
//----------
const sorter = ['ascend', 'descend']
const scroll = 'paper'

const PolicyContentUpdate = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [description, setDescription] = useState(null)
  const [title, setTitle] = useState(null)
  const [id, setId] = useState(null)
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
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/policy-content`, {
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
  //  Handlers
  //----------
  const handleClose = () => setEditModalOpen(false)

  //----------
  //  Table Actions - Update Item
  //----------
  const updateItem = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/policy-content/${id}`,
        {
          content: description
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
            d.content = description
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
  //  Table Actions - Edit Item
  //----------
  const editItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => {
      setId(i.id)
      setDescription(i.description)
      setTitle(i.page_name)
    })
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
      dataIndex: 'page_name',
      sorter: {
        compare: (a, b) => a.page_name.localeCompare(b.page_name),
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
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Grid spacing={0}>
            <Grid item sx={{ display: 'flex' }}>
              <Link href='javascript:void(0)' onClick={() => editItem(object.id)}>
                Edit
              </Link>
            </Grid>
          </Grid>
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
            Policy Content Management{' '}
          </Typography>
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
              data?.length > 1
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
          fullWidth
        >
          <DialogTitle id='scroll-dialog-title'>Update {title}</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
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
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={updateItem}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default PolicyContentUpdate
