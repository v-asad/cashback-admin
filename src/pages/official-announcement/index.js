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
import Manage from 'src/pages/commission-management/manage'
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { toast } from 'react-hot-toast'
import { Table, Input } from 'antd'


const OfficialAnnouncement = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [scroll, setScroll] = useState('paper');
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [status, setStatus] = useState(null)
  const [id, setId] = useState(null)
  const [add, setAdd] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
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
  useEffect(() => {
    loadData()
  }, [])
  // EDit popup for record
  const  editItem = id => {
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

  const deleteItem = (id) => {
    let item = data.filter(d => id == d.n_id)
    item.map(i => {
      setId(i.n_id)
    })
    setDeleteModalOpen(true)
  }

  // Add new accounemmnet
  const addNewItem = () => {
      setId(null)
      setDescription(null)
      setTitle(null)
      setStatus(null)
      setAdd(true)
      setEditModalOpen(true)
  }

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
        multiple: 2,
      },
    },

    {
      title: 'Posted Date',
      dataIndex: 'posted_date',
      sorter: {
        compare: (a, b) => a.posted_date.localeCompare(b.posted_date),
        multiple: 2,
      },
      render: (text, record) => new Date(record.posted_date).toLocaleDateString()
    },
    {
      title: 'status',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.t_date.localeCompare(b.t_date),
        multiple: 2,
      },
      render: (text, record) => (record.status === 0 ? 'Inactive' : 'Active')
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
         <Grid item xs={6}>
         <Link href='javascript:void(0)' onClick={() => editItem(object.n_id)}>Edit</Link>
       </Grid>
       <Grid item xs={6}>
       <Link href='javascript:void(0)' onClick={() => deleteItem(object.n_id)}>Delete</Link>
       </Grid>
        </>
      )
    },
   

    

  ]

  const handleClose = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
  }
  // Update annoucement
  const updateAnnoucement = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement/${id}`, {
          title: title,
          status : status,
          description: description
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setEditModalOpen(false)
        let tempData = data.map(d => {
          if(d.n_id == id){
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
        if(error.response && error.response.data){
          if(error.response.data && error.response.data.message){
            toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
          }
          if(error.response.data && error.response.data.errors){
            error.response.data.errors.map(err => toast.error(err.msg))
          }
        }
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
  }

  const addAnnoucement = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement`, {
          title: title,
          status : status,
          description: description
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        console.log(response)
        setEditModalOpen(false)
        // data.push(response.data.data)
        console.log(response.data.data)
        let newObj = response.data.data
        let lastKey = 0
        data.map(d=> {
          lastKey = d.key
        })
        newObj.key = lastKey ? lastKey+1 : lastKey
        let tempData = [...data, newObj]

        // data.push(newObj)
        console.log(tempData)
        setData(tempData)
        toast.success(response.data.message)
      })
      .catch(error => {
        if(error.response && error.response.data){
          if(error.response.data && error.response.data.message){
            toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
          }
          if(error.response.data && error.response.data.errors){
            error.response.data.errors.map(err => toast.error(err.msg))
          }
        }
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
  }

  const deleteAnnoucement = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/official-annoucement/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setDeleteModalOpen(false)
        let tempData =  data.filter(d => d.n_id != id)
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
        if(error.response && error.response.data){
          if(error.response.data && error.response.data.message){
            toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
          }
          if(error.response.data && error.response.data.errors){
            error.response.data.errors.map(err => toast.error(err.msg))
          }
        }
        if (error.response && error.response.status == 401) {
          auth.logout()
        }
      })
  }
  return (
    <>
    <Grid item xs={12}>
        <Box >
          <Typography variant='h5' sx={{my:8}}>Official Announcement </Typography>
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
                    showTotal: (total, range) => `Total: ${total}`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    locale: { items_per_page: '' }
                  }
                : false   
            }
            onChange={pagination => setPagination(pagination)}
          />



         <DataGrid rows={data} columns={columns} pageSize={10} getRowId={(row) => row.key} rowsPerPageOptions={[10]} autoHeight />
         </CardContent>
      </Card>

      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">{add?'Create': 'Update'} Annoucement</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField xs={6} fullWidth label='Title' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value) } />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <TextareaAutosize xs={6} fullWidth minRows={3} label='Description' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value) } />
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="status">Status</InputLabel>
                          <Select
                            labelId="status-label"
                            id="status-select"
                            label="Status"
                            placeholder='Select Status'
                            onChange={(e) => setStatus(e.target.value)}
                            value={status}
                          >
                            {[0, 1].map(c=><MenuItem value={c}>{c?'Active': 'Inactive'}</MenuItem>)}
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
            <Button onClick={!add?updateAnnoucement:addAnnoucement}>{add?'Create': 'Update'}</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={deleteModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Delete Annoucement</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Typography>
                      Are you sure? This action can't be undone
                    </Typography>
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
