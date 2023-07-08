//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

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
  Backdrop,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageList,
  ImageListItem
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

const AllVendorList = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [uploadLogo, setUploadLogo] = useState(null)
  const [open, setOpen] = useState(false)
  const [vendor, setVendor] = useState(null)
  const [originalVendor, setOriginalVendor] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(null)
  const [editBankModalOpen, setEditBankModalOpen] = useState(null)
  const [countries, setCountries] = useState([])
  const [uploadGallery, setUploadGallery] = useState([])
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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/list`, {
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

  //----------
  //  Handlers - Close Edit Modal
  //----------
  const handleClose = () => {
    setEditModalOpen(false)
    setEditBankModalOpen(false)
    setVendor(originalVendor)
  }

  //----------
  //  Handlers - Gallery Upload
  //----------
  const galleryUploadHandler = id => {
    const formData = new FormData()
    for (let i = 0; i < uploadGallery.length; i++) {
      formData.append('gallery', uploadGallery[i])
    }
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        setVendor(null)
        setUploadGallery([])
        toast.success(resp.data.message)
        return true
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
  //  Handlers - Submit Logo Handler
  //----------
  const submitLogoHandler = id => {
    const formData = new FormData()
    formData.append('cmp_logo', uploadLogo)
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/logo/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        setVendor(null)
        setUploadLogo(null)
        toast.success(resp.data.message)
        return true
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
  //  Handlers - Gallery Upload
  //----------
  const handleGalleryUpload = event => setUploadGallery(event.target.files)

  //----------
  //  Handlers - Logo Upload
  //----------
  const handleLogoUpload = event => {
    const selectedImage = event.target.files[0]
    setUploadLogo(selectedImage)
  }

  //----------
  //  Actions - Set Access Token
  //----------
  const setAccessToken = user_id => {
    let url = `${process.env.NEXT_PUBLIC_VENDOR_DASH}dashboard?__sid=${encodeURI(
      localStorage.accessToken
    )}&__uid=${encodeURI(user_id)}`
    window.open(url, '_blank', 'noreferrer')
  }

  //----------
  //  Actions - Change User Status
  //----------
  const changeUserStatus = event => {
    let user_id = event.target.getAttribute('data-id')
    let status = parseInt(event.target.getAttribute('data-status'))
    status = !status ? 1 : 0
    setOpen(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update`,
        {
          action: 'update-status',
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
  //  Actions - Update Vendor
  //----------
  const updateVendor = () => {
    setOpen(true)
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/${vendor.id}`,
        {
          action: 'update-profile',
          company_reg_no: vendor.company_reg_no,
          first_name: vendor.first_name,
          description: vendor.description,
          email: vendor.email,
          location: vendor.location,
          lendmark: vendor.lendmark,
          country: vendor.country,
          phonecode: vendor.phonecode,
          telephone: vendor.telephone,
          city: vendor.city,
          state: vendor.state,
          commission_percent: vendor.commission_percent,
          credit_limit: vendor.credit_limit
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        if (response.data.success) {
          let msg = response.data.message
          let id = vendor.id
          let filesUpload = false
          if (uploadGallery.length > 0) {
            galleryUploadHandler(id)
            filesUpload = true
          }
          if (uploadLogo) {
            submitLogoHandler(id)
            filesUpload = true
          }
          if (!filesUpload) {
            setOriginalVendor(vendor)
          } else {
            setOriginalVendor(null)
          }
          toast.success(msg)
          setOpen(false)
          handleClose()
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
  //  Actions - Edit Vendor Bank
  //----------
  const editVendorBank = id => {
    setOpen(true)
    let type = 'bank'
    if (!vendor) {
      callVendorFetchApi(id, type)
    } else if (vendor.id != id) {
      callVendorFetchApi(id, type)
    } else {
      setEditBankModalOpen(true)
      setOpen(false)
    }
  }

  //----------
  //  Actions - Change Vendor
  //----------
  const editVendor = id => {
    setOpen(true)
    setVendor(originalVendor)
    let type = 'profile'
    if (!vendor) {
      callVendorFetchApi(id, type)
    } else if (vendor.id != id) {
      callVendorFetchApi(id, type)
    } else {
      setEditModalOpen(true)
      setOpen(false)
    }
  }

  //----------
  //  Actions - Update Vendor
  //----------
  const updateVendorBank = () => {
    setOpen(true)
    setVendor(originalVendor)
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/bankinfo/${vendor.id}`,
        {
          action: 'update-bankinfo',
          acc_name: vendor.acc_name,
          ac_no: vendor.ac_no,
          bank_nm: vendor.bank_nm,
          branch_nm: vendor.branch_nm,
          swift_code: vendor.swift_code
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        // if(response.data.success){
        toast.success(response.data.message)
        setOpen(false)
        setOriginalVendor(vendor)
        setEditBankModalOpen(false)
        // type == 'profile'&& setEditModalOpen(true)
        // type == 'bank'&& setEditBankModalOpen(true)
        // }
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
  //  Actions - Call Vendor Fetch API
  //----------
  const callVendorFetchApi = (id, type) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/list/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        // if(response.data.success){
        // toast.success(response.data.message)
        setOpen(false)
        setVendor(response.data)
        setOriginalVendor(response.data)
        type == 'profile' && setEditModalOpen(true)
        type == 'bank' && setEditBankModalOpen(true)
        // }
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
  //  Change Vendor
  //----------
  const changeVendor = event => {
    let { name, value } = event.target

    if (name == 'country') {
      countries.forEach(c => {
        if (c.name == value) {
          setVendor(v => ({
            ...v,
            [name]: value,
            phonecode: c.phonecode
          }))
        }
      })
    } else {
      setVendor(v => ({
        ...v,
        [name]: value
      }))
    }
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
        <Link
          sx={{ textDecoration: 'underline' }}
          href='javascript:void(0)'
          onClick={() => setAccessToken(object.user_id)}
        >
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
          String(record.registration_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.activation_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.commission_percent)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record?.credit_limit || '')
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.due_amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.available_credit_limit)
            .replace(' ', '')
            .replace(',', '')
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
      title: 'Business/Company Name',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      },
      render: (_, object, index) => <Typography>{object.first_name + ' ' + object.last_name}</Typography>
    },

    {
      title: 'Registration Date',
      dataIndex: 'registration_date',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      },
      render: (text, record) => new Date(record.registration_date).toLocaleDateString()
    },
    {
      title: 'Commission Percent',
      dataIndex: 'commission_percent',
      sorter: {
        compare: (a, b) => a.commission_percent - b.commission_percent,
        multiple: 2
      }
    },
    {
      title: 'Credit Limit',
      dataIndex: 'credit_limit',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      }
    },
    {
      title: 'Available Credit Limit',
      dataIndex: 'available_credit_limit',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      },
      render: (text, record) =>
        (record.credit_limit - record.due_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
    },
    {
      title: 'Commission Due',
      dataIndex: 'due_amount',
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
        multiple: 2
      }
    },
    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Grid spacing={0}>
            <Grid item sx={{ display: 'flex' }}>
              <Link href='javascript:void(0)' onClick={() => editVendor(object.id)} sx={{ mr: 5, display: 'flex' }}>
                Edit
              </Link>

              <Link href='javascript:void(0)' onClick={() => editVendorBank(object.id)} sx={{ mr: 5, display: 'flex' }}>
                Bank Details
              </Link>
            </Grid>
          </Grid>
        </>
      )
    },

    {
      title: 'Action',
      render: (_, object, index) => (
        <>
          <Link
            href='javascript:void(0)'
            data-status={object.user_status}
            data-id={object.user_id}
            onClick={changeUserStatus}
          >
            {object.user_status == 1 ? 'Inactive' : 'Active'}
          </Link>
        </>
      )
    },

    // { field: 'location', headerName: 'Location', width: 150, renderCell: params =>  <Link href={params.row.location} target='__blank'>{params.row.location}</Link> },

    {
      field: 'user_status',
      headerName: 'Login Status',
      width: 150,
      renderCell: params => (
        <Link
          href='javascript:void(0)'
          data-status={params.row.user_status}
          data-id={params.row.user_id}
          onClick={changeUserStatus}
        >
          {params.row.user_status == 1 ? 'Inactive' : 'Active'}
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
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Vendor Registered List{' '}
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
          <DialogTitle id='scroll-dialog-title'>
            Edit Vendor [{vendor?.user_id} - {vendor?.username}]
          </DialogTitle>
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
                              label='Company Registration Number'
                              placeholder='Company Registration Number'
                              value={vendor?.company_reg_no}
                              disabled={true}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              label='Company Name'
                              value={vendor?.first_name}
                              placeholder='Company Name'
                              onChange={changeVendor}
                              name='first_name'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              label='About Company'
                              onChange={changeVendor}
                              value={vendor?.description}
                              placeholder='About Company'
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Box>
                              <Typography variant='h5' sx={{ my: 8 }}>
                                Personal Information
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Userid'
                              value={vendor?.user_id}
                              disabled={true}
                              placeholder='Userid'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Username'
                              value={vendor?.username}
                              disabled={true}
                              placeholder='Username'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Due Amount (SAR)'
                              value={vendor?.due_amount}
                              disabled={true}
                              placeholder='Due Amount (SAR)'
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Email'
                              value={vendor?.email}
                              disabled={true}
                              placeholder='Email'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Full Address'
                              placeholder='Full Address'
                              name='address'
                              onChange={changeVendor}
                              value={vendor?.address}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Google map link'
                              placeholder='With Google map link'
                              onChange={changeVendor}
                              value={vendor?.location}
                              name='location'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Landmark'
                              placeholder='Landmark'
                              onChange={changeVendor}
                              value={vendor?.lendmark}
                              name='lendmark'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id='demo-simple-select-label'>Country</InputLabel>
                              <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Country'
                                placeholder='Select Country'
                                onChange={changeVendor}
                                value={vendor?.country}
                                name='country'
                              >
                                {countries.map(c => (
                                  <MenuItem value={c.name} selected={c.name == vendor?.country}>
                                    {c.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Country Code'
                              placeholder='Country Code'
                              disabled={true}
                              value={vendor?.phonecode}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='State'
                              placeholder='State'
                              onChange={changeVendor}
                              value={vendor?.state}
                              name='state'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='City'
                              placeholder='City'
                              onChange={changeVendor}
                              value={vendor?.city}
                              name='city'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Contact'
                              placeholder='Contact'
                              onChange={changeVendor}
                              value={vendor?.telephone}
                              name='telephone'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Commission Percentage (%)'
                              placeholder='Commission Percentage (%)'
                              disabled={true}
                              value={vendor?.commission_percent}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label='Credit Limit (SAR)'
                              placeholder='Credit Limit (SAR)'
                              disabled={true}
                              value={vendor?.credit_limit}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label='Password' placeholder='Password' />
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <Button variant='contained' sx={{ mr: 2 }} component='label'>
                              Product Gallery
                              <input hidden accept='image/*' multiple type='file' onChange={handleGalleryUpload} />
                            </Button>
                            {uploadGallery.length} Files selected
                            <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                              {vendor
                                ? vendor?.file?.map(item => (
                                    <ImageListItem key={item}>
                                      <img
                                        src={`${item}?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={item}
                                        loading='lazy'
                                      />
                                    </ImageListItem>
                                  ))
                                : 'No gallery found!'}
                            </ImageList>
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <Button variant='contained' sx={{ mr: 2 }} component='label'>
                              Brand Logo
                              <input hidden accept='image/*' type='file' onChange={handleLogoUpload} />
                            </Button>
                            {!uploadLogo && vendor && vendor.cmp_logo ? (
                              <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                                <ImageListItem key={vendor.cmp_logo}>
                                  <img
                                    src={`${vendor.cmp_logo}`}
                                    srcSet={`${vendor.cmp_logo}`}
                                    alt={vendor.cmp_logo}
                                    loading='lazy'
                                  />
                                </ImageListItem>
                              </ImageList>
                            ) : (
                              uploadLogo && (
                                <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                                  <ImageListItem key={URL.createObjectURL(uploadLogo)}>
                                    <img
                                      src={`${URL.createObjectURL(uploadLogo)}`}
                                      srcSet={`${URL.createObjectURL(uploadLogo)}`}
                                      alt={URL.createObjectURL(uploadLogo)}
                                      loading='lazy'
                                    />
                                  </ImageListItem>
                                </ImageList>
                              )
                            )}
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
            <Button onClick={updateVendor}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={editBankModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'
        >
          <DialogTitle id='scroll-dialog-title'>
            UPDATE BANK INFORMATION [{vendor?.user_id} - {vendor?.username}]
          </DialogTitle>
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
                              label='Account Name'
                              onChange={changeVendor}
                              name='acc_name'
                              value={vendor?.acc_name}
                              placeholder='Account Name'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              label='Account Number'
                              onChange={changeVendor}
                              name='ac_no'
                              value={vendor?.ac_no}
                              placeholder='Account Number'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              onChange={changeVendor}
                              name='bank_nm'
                              value={vendor?.bank_nm}
                              label='Bank Name'
                              placeholder='Bank Name'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              fullWidth
                              onChange={changeVendor}
                              name='branch_nm'
                              value={vendor?.branch_nm}
                              label='Branch Name'
                              placeholder='Branch Name'
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              xs={6}
                              onChange={changeVendor}
                              name='swift_code'
                              value={vendor?.swift_code}
                              fullWidth
                              label='Ifsc / Swift Code'
                              placeholder='Ifsc / Swift Code'
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
            <Button onClick={updateVendorBank}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: 100000 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default AllVendorList
