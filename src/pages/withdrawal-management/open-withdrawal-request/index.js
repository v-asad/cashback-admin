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
import Checkbox from '@mui/material/Checkbox'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import Link from '@mui/material/Link'
import { Router, useRouter } from 'next/router'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Table, Input } from 'antd'
const OpenWithdrawalRequest = () => {
  
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
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [scroll, setScroll] = useState('paper');
  const [description, setDescription] = useState(null)
  const [tableLoading, setTableLoading] = useState(false)
  const sorter = ['ascend', 'descend'];
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
  const router = useRouter()
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const approve = () => {
    setOpen(true)
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/withdrawal-request/open`,{
          list: selectedRows,
          description: description
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          setOpen(false)
          setEditModalOpen(false)
          toast.success(response.data.message)
          router.replace('close-withdrawal-request')
        })
        .catch(error => {
          setOpen(false)
          setEditModalOpen(false)
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
          if (error.response && error.response.status == 401) {
            auth.logout()
          }
        })
  }
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
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  )

  const auth = useAuth()
  const [data, setData] = useState([])
  const loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/withdrawal-request/open`, {
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

  const handleClose = () => {
    setEditModalOpen(false)
  }

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
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.user_id)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.full_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.request_amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.transaction_number)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.bank_nm)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.acc_number)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.swift_code)
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
      title: 'FullName',
      dataIndex: 'full_name',
      sorter: {
        compare: (a, b) => a.full_name.localeCompare(b.full_name),
        multiple: 2,
      },
      render: (_, object, index) => (
        <Typography>
           {object.first_name + ' ' + object.last_name}
         
        </Typography>
      )

    },
    {
      title: 'Request Amount',
      dataIndex: 'request_amount',
      sorter: {
        compare: (a, b) => a.request_amount-b.request_amount,
        multiple: 2,
      },

    },
    {
      title: 'Transaction Number',
      dataIndex: 'transaction_number',
      sorter: {
        compare: (a, b) => a.transaction_number-b.transaction_number,
        multiple: 2,
      },

    },
   
    {
      title: 'Bank Name',
      dataIndex: 'bank_nm',
      sorter: {
        compare: (a, b) => a.bank_nm.localeCompare(b.bank_nm),
        multiple: 2,
      },

    },
    {
      title: 'Acc Number',
      dataIndex: 'acc_number',
      sorter: {
        compare: (a, b) => a.acc_number-b.acc_number,
        multiple: 2,
      },

    },
    {
      title: 'Swift code',
      dataIndex: 'swift_code',
      sorter: {
        compare: (a, b) => a.swift_code-b.swift_code,
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
   
   
  ]
  const approveHandler = () => {
    setEditModalOpen(true)
  }
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Open Withdraw Request
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button variant='contained' sx={{ mr: 2,mb:10 }} onClick={approveHandler} disabled={selectedRows.length > 0 ? false:true}>
          Approve Open Withdrawals
        </Button>
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
                    pageSizeOptions: ['10', '20', '50', '100'],
                    locale: { items_per_page: '' }
                  }
                : false   
            }
            onChange={pagination => setPagination(pagination)}
          />

          {/* <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            getRowId={row => row.user_id}
            rowsPerPageOptions={[10]}
            autoHeight
            checkboxSelection
            onSelectionModelChange={(newSelection) => {setSelectedRows(newSelection)}}
          /> */}
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
          <DialogTitle id="scroll-dialog-title">Approve Opened Requests</DialogTitle>
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
                        <StyledTextarea aria-label='minimum height' minRows={5} placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={approve}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default OpenWithdrawalRequest
