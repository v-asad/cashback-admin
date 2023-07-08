//----------
//  React Imports
//----------
import { useCallback, useEffect, useRef, useState } from 'react'

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
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'

//----------
// MUI Icon Imports
//----------
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

//----------
// Other library Imports
//----------
import { utils, writeFileXLSX } from 'xlsx'
import { toast } from 'react-hot-toast'
import { auto } from '@popperjs/core'
import { Table, Input } from 'antd'
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

const AllMemberList = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [countries, setCountries] = useState([])
  const [editUser, setEditUser] = useState([])
  const [memberId, setMemberId] = useState(null)
  const [topupModalOpen, setTopupModalOpen] = useState(false)
  const [topupAmount, setTopupAmount] = useState(null)
  const [topupUserId, setTopupUserId] = useState(null)
  const [filterDateRange, setFilterDateRange] = useState([null, null])
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/members/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          const tempData = response.data.map((d, key) => {
            return { key, ...d }
          })
          setData(tempData)
          setDataSource(tempData)
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

    const loadCountries = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/countries`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
        })
    }
    loadCountries()
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
  //  XLSX Handlers - Export File
  //----------
  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFileXLSX(wb, 'SheetJSReactAoO.xlsx')
  }, [data])

  //----------
  //  Handlers
  //----------
  const handleClose = () => {
    setEditModalOpen(false)
    setTopupModalOpen(false)
  }
  const setAccessToken = user_id => {
    let url = `${process.env.NEXT_PUBLIC_USER_DASH}dashboard?__sid=${encodeURI(
      localStorage.accessToken
    )}&__uid=${encodeURI(user_id)}`
    window.open(url, '_blank', 'noreferrer')
  }

  //----------
  //  Table Actions - Change Co-founder status
  //----------
  const changeCofounderStatus = event => {
    let user_id = event.target.getAttribute('data-id')
    let status = parseInt(event.target.getAttribute('data-status'))
    status = !status ? 1 : 0
    setOpen(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/update`,
        {
          action: 'update-cofounder-status',
          status: status,
          user_id: user_id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        if (response.data.success) {
          toast.success(response.data.message)
          setOpen(false)
          event.target.setAttribute('data-status', status)
          event.target.innerText = status ? 'Inactive' : 'Active'
        }
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
  //  Table Actions - Edit User Data
  //----------
  const setEditUserData = index => event => {
    let value = event.target.value
    editUser[index] = value
    setEditUser(editUser)
    event.target.value = value
    console.log(editUser, editUser.ref_id)
  }

  //----------
  //  Table Actions - Change User Status
  //----------
  const changeUserStatus = event => {
    let user_id = event.target.getAttribute('data-id')
    let status = parseInt(event.target.getAttribute('data-status'))
    status = !status ? 1 : 0
    setOpen(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/update`,
        {
          action: 'update-user-status',
          status: status,
          user_id: user_id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        if (response.data.success) {
          toast.success(response.data.message)
          setOpen(false)
          event.target.setAttribute('data-status', status)
          event.target.innerText = status ? 'Inactive' : 'Active'
        }
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
  //  Table Actions - Update Member Topup
  //----------
  const topupMember = () => {
    setOpen(true)
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/topup/${topupUserId}`,
        {
          amount: topupAmount
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
        setTopupModalOpen(false)
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

  //----------
  //  Table Actions - Update Member List
  //----------
  const editMember = id => {
    setOpen(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/members/list/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setOpen(false)
        setEditUser(response.data)
        setEditModalOpen(true)
        setMemberId(id)
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

  //----------
  //  Table Actions - Update Member
  //----------
  const updateMember = () => {
    setOpen(true)
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/update/${memberId}`,
        {
          action: 'update-profile',
          first_name: editUser.first_name,
          last_name: editUser.last_name,
          username: editUser.username,
          email: editUser.email,
          address: editUser.address,
          country: editUser.country,
          phonecode: editUser.phonecode,
          telephone: editUser.telephone,
          state: editUser.state,
          city: editUser.city,
          dob: editUser.dob ? new Date().toISOString(editUser.dob).split('T')[0] : null,
          sex: editUser.sex
          // "password": "12345678",
          // "t_code" : "12345678"
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
        setEditModalOpen(false)
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

  //----------
  //  Table Actions - Apply Filter
  //----------
  const applyFilter = () => {
    let dateFrom = filterDateRange[0]['$d'].toLocaleDateString()
    let dateTo = filterDateRange[1]['$d'].toLocaleDateString()
    // let filter = dataSource.filter(d => (( filterUserId && d.user_id == filterUserId ) || ( filterUserName && d.username == filterUserName) || (new Date(d.registration_date) >= new Date(dateFrom) && new Date(d.registration_date) <= new Date(dateTo) )))
    let filter = dataSource.filter(
      d => new Date(d.registration_date) >= new Date(dateFrom) && new Date(d.registration_date) <= new Date(dateTo)
    )
    setData(filter)
  }

  //----------
  //  Table Actions - Reset Filter
  //----------
  const resetFilter = () => {
    if (filterDateRange) {
      setFilterDateRange([null, null])
    }
    setData(dataSource)
  }

  //----------
  //  Table Configuration
  //----------
  const columnss = [
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
      render: (_, object, index) => (
        <Link href='javascript:void(0)' onClick={() => setAccessToken(object.user_id)}>
          {object.user_id}
        </Link>
      ),
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
          String(record.email)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.first_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.last_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.telephone)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.package.name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.package.amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record?.sponsor?.username || '')
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.selfIncome)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.country)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      }
    },
    {
      title: 'User Name',
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
        multiple: 2
      },
      render: (_, object, index) => (
        <Typography>
          <b>Fullname</b> {object.first_name + ' ' + object.last_name}
          <br />
          <b>Email</b> {object.email} <br />
          <b>Telephone</b> {object.telephone}
        </Typography>
      )
    },
    {
      title: 'Package Name(Amount)',
      sorter: {
        compare: (a, b) => a.package.name.localeCompare(b.package.name),
        multiple: 2
      },
      render: (_, object, index) => object.package.name + ' ' + object.package.amount
    },
    {
      title: 'Sponsor Id',
      sorter: {
        compare: (a, b) => a.sponsor?.username.localeCompare(b.sponsor?.username),
        multiple: 2
      },
      render: (_, object, index) => object.sponsor?.username
    },
    {
      title: 'Purchase (SAR)',
      sorter: {
        compare: (a, b) => a.selfIncome - b.selfIncome,
        multiple: 2
      },
      dataIndex: 'selfIncome'
    },
    {
      title: 'Country',
      sorter: {
        compare: (a, b) => a.country.localeCompare(b.country.username),
        multiple: 2
      },
      dataIndex: 'country'
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Grid spacing={0}>
            <Grid item>
              <Link href='javascript:void(0)' onClick={() => editMember(object.id)} sx={{ mr: 5 }}>
                Edit
              </Link>

              <Link
                href='javascript:void(0)'
                onClick={() => {
                  setTopupModalOpen(true)
                  setTopupUserId(object.user_id)
                }}
              >
                Topup
              </Link>
            </Grid>
          </Grid>
        </>
      )
    },
    {
      title: 'Cofounder Status',
      render: (_, object, index) =>
        object.isCoFounder ? (
          <Link
            href='javascript:void(0)'
            data-id={object.user_id}
            data-status={object.co_founder}
            onClick={changeCofounderStatus}
          >
            {object.co_founder == 1 ? 'Inactive' : 'Active'}
          </Link>
        ) : (
          '-'
        )
    },
    {
      title: 'Login Status',
      render: (_, object, index) => (
        <Link
          href='javascript:void(0)'
          data-status={object.user_status}
          data-id={object.user_id}
          onClick={changeUserStatus}
        >
          {object.user_status == 1 ? 'Inactive' : 'Active'}
        </Link>
      )
    }
  ]

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', my: 8, mt: 0, justifyContent: 'space-between' }}>
          <Typography variant='h5'>REGISTERED MEMBER LIST</Typography>
          <Button variant='outlined' onClick={exportFile}>
            Export in Excel
            <a hidden></a>
          </Button>
        </Box>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: 1000000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent sx={{ overflow: 'auto' }}>
          <Grid container spacing={2} sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Grid id='datepicker-list' item md={3} xs={12} sx={{ display: 'flex' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ height: auto, mb: 2 }}>
                <DateRangePicker
                  calendars={2}
                  value={filterDateRange}
                  onChange={newValue => setFilterDateRange(newValue)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={2} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant='contained'
                sx={{ mr: 1 }}
                onClick={applyFilter}
                disabled={!filterDateRange[0] || !filterDateRange[1] ? true : false}
                size='small'
              >
                <FilterAltIcon />
              </Button>

              <Button variant='contained' onClick={resetFilter} color='error' size='small'>
                <FilterAltOffIcon />
              </Button>
            </Grid>

            <Grid item md={7} xs={12} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Input.Search
                placeholder='Search here.....'
                style={{ maxWidth: 300, marginBottom: 8, display: 'block', float: 'right', border: 'black' }}
                onSearch={value => {
                  setSearchedText(value)
                }}
                onChange={e => {
                  setSearchedText(e.target.value)
                }}
              />
            </Grid>
          </Grid>
          <Table
            columns={columnss}
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

      <div>
        <Dialog
          open={editModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>UPDATE MEMBER PROFILE</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Grid item xs={12}></Grid>

              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Sponsor ID'
                        placeholder='Sponsor ID'
                        onChange={setEditUserData('ref_id')}
                        value={editUser.ref_id}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Sponsor Name'
                        placeholder='Sponsor Name'
                        onChange={setEditUserData('sponsorName')}
                        value={editUser.sponsorName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='User Registration Date'
                        placeholder='User Registration Date'
                        disabled={true}
                        value={
                          editUser.registration_date ? new Date(editUser.registration_date).toLocaleDateString() : ''
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box>
                        <Typography variant='h5' sx={{ my: 8 }}>
                          Personal Information
                        </Typography>
                      </Box>
                    </Grid>

                    {/* <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Old Username' placeholder='Old Username' />
            </Grid> */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Userid'
                        placeholder='Userid'
                        disabled={true}
                        value={editUser.user_id}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Username'
                        placeholder='Username'
                        disabled={true}
                        value={editUser.username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='First Name'
                        placeholder='First Name'
                        onChange={setEditUserData('first_name')}
                        value={editUser.first_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Last Name'
                        placeholder='Last Name'
                        onChange={setEditUserData('last_name')}
                        value={editUser.last_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Email' placeholder='Email' disabled={true} value={editUser.email} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Address'
                        placeholder='Address'
                        onChange={setEditUserData('address')}
                        value={editUser.address}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id='demo-simple-select-label'>Country</InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Country'
                            placeholder='Select Country'
                            onChange={setEditUserData('country')}
                            value={editUser.country}
                          >
                            {countries.map(c => (
                              <MenuItem value={c.name} selected={c.name == editUser.country}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Code:'
                        placeholder='Code:'
                        disabled={true}
                        value={editUser.phonecode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Telephone'
                        placeholder='Telephone'
                        onChange={setEditUserData('telephone')}
                        value={editUser.telephone}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='State'
                        placeholder='State'
                        onChange={setEditUserData('state')}
                        value={editUser.state}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='City'
                        placeholder='City'
                        onChange={setEditUserData('city')}
                        value={editUser.city}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Password' placeholder='Password' />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Transaction Password' placeholder='Transaction Password' />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Date Of Birth' placeholder='Date Of Birth' />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label='Gender' placeholder='Gender' />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={updateMember}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={topupModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>TOPUP MEMBER BUSINESS</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
              <Grid item xs={12}></Grid>

              <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        xs={6}
                        fullWidth
                        label='Amount'
                        placeholder='Amount'
                        value={topupAmount}
                        onChange={e => setTopupAmount(e.target.value)}
                        type='number'
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={topupMember}>Topup</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default AllMemberList
