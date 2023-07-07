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
import Link from '@mui/material/Link';
import Icon from 'src/@core/components/icon'
import { Dialog } from '@mui/material'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Table, Input } from 'antd'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { toast } from 'react-hot-toast'
const PolicyContentUpdate = () => {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [scroll, setScroll] = useState('paper');
  const [description, setDescription] = useState(null)
  const [title, setTitle] = useState(null)
  const [id, setId] = useState(null)
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

  const handleClose = () => {
    setEditModalOpen(false)
  }

  // Update page
  const updateItem = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/policy-content/${id}`, {
          content: description
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setEditModalOpen(false)
        let tempData = data.map(d => {
          if(d.id == id){
            d.content = description
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
  
   // EDit popup for record
   const  editItem = id => {
    let item = data.filter(d => id == d.id)
    item.map(i => {
      setId(i.id)
      setDescription(i.description)
      setTitle(i.page_name)
    })
    setEditModalOpen(true)
  }


  useEffect(() => {
    loadData()
  }, [])
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
      title: 'Action',
      render: (_, object, index) => (
        <>
         <Grid spacing={0}>
            <Grid item sx={{ display:'flex' }}>
  
            <Link href='javascript:void(0)' onClick={() => editItem(object.id)}>Edit</Link>
            </Grid>
          </Grid>
        </>
      )
    },



   
  ]
  return (
    <>
    <Grid item xs={12}>
        <Box >
          <Typography variant='h5' sx={{my:8}}>Policy Content Management  </Typography>

        </Box>
      </Grid>

    
      
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
      <CardContent>
      {/* <Input.Search
            placeholder='Search here.....'
            style={{ maxWidth: 300, marginBottom: 8, display: 'block', height: 50, float: 'right', border: 'black' }}
            onSearch={value => {
              setSearchedText(value)
            }}
            onChange={e => {
              setSearchedText(e.target.value)
            }}
          /> */}
          <Table
            columns={columns}
            dataSource={data}
            loading={tableLoading}
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
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
        >
          <DialogTitle id="scroll-dialog-title">Update {title}</DialogTitle>
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
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <TextareaAutosize xs={6} fullWidth minRows={3} label='Description' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value) } />
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
