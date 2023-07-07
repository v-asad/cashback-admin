import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Image from 'next/image'
import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'

import { DataGrid } from '@mui/x-data-grid'
import fullscreen from 'src/store/fullscreen'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const OurVendor = () => {
  const [value, setValue] = useState(0)
  const [vendors, setVendors] = useState([])
  const [companies, setCompanies] = useState([])
  const [categories, setCategories] = useState([])
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [scroll, setScroll] = useState('paper');
  const [detailedData, setDetailedData] = useState([])
  
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
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/our-vendors`, {
      headers: {
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    }).then(response=>{
      setVendors(response.data.vendors);
      setCompanies(response.data.companies);
      setCategories(response.data.categories);
      setData(response.data.companies);
    }).catch(error => {
      toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
      if (error.response && error.response.status == 401) {
        auth.logout();
      }
    })
  }
  useEffect(()=>{
    loadData()
  }, [])
  const detailedColumn = [
    { field: '', headerName: '#', width: 70, renderCell: params => params.row.key + 1 },
    { field: 'user_id', headerName: 'User Id', width: 150 },
    { field: 'seller_id', headerName: 'Seller Id', width: 150 },
    { field: 'total_sale', headerName: 'Total Sale', width: 180 },
    { field: 'invoice_no', headerName: 'Invoice No', width: 180 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      renderCell: params =>  new Date(params.row.date).toLocaleDateString()
    }
  ] 
  const handleChange = (event, newValue) => {
    setValue(newValue)
    if(newValue == 0){
      setData(companies)
    }else{
      let filter = categories.filter(c=>c.catogory==newValue)
      let data = [];
      filter.forEach(f=>{
        companies.map((c)=>{
          f.poc_userid == c.user_id && data.push(c)
        })
      })
      setData(data)
    }
  }
  const handleClose = () => {
    setDetailsModalOpen(false)
  }

  const viewDetails = (user_id) => {
    setOpen(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/our-vendors/history/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setOpen(false)
        setDetailsModalOpen(true)
        let tempData = response.data.map((r, key)=>{
          return {...r, key:key}
        })
        setDetailedData(tempData)
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
  return (
    <>
      <Typography variant='h5'>Vendor List</Typography>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='All' value={0} />
              {vendors.map(v=><Tab label={v.service_name} value={v.id} />)}
            </TabList>
          </Box>
          <TabPanel value={0}>
            <h4>All Vendors List</h4>
            <Grid container spacing={2} className='match-height'>
              {companies.map(c=>{
                return (
                  <Grid item xs={12} md={4}>
                    <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                        <CardContent sx={{ display: 'flex' }}>
                          <Grid item xs={12} md={6}>
                            <Avatar
                             alt={c.first_name}
                              src={c.file[0]}
                              sx={{ width: 56, height: 56 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                          <Typography
                            component='div'
                            variant='p'
                            sx={{
                              fontWeight: 'bold',
                              mb: 10,
                              display: 'flex',
                              justifyContent: 'space-between',
                              flexDirection: 'column',
                              height:'50%'
                            }}
                          >
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>ID</span>
                              <span>{c.user_id}</span>
                            </Typography>
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>Name</span>
                              <span>{c.first_name}</span>
                            </Typography>
                            <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                              <span>Number</span>
                              <span>{c.telephone}</span>
                            </Typography>
                            
                          </Typography>
                          </Grid>
                        
                        </CardContent>
                        <Grid item xs={12}  sx={{px:5,width:'100%'}}>
                        <Typography sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between' }}>
                              <Button variant="outlined" onClick={e => {console.log(c.location);window.open(c.location, '_blank')}}>View Location</Button>
                              <Button variant="contained" onClick={e => viewDetails(c.user_id)}>View Details</Button>
                            </Typography>
                          </Grid>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </TabPanel>
          {vendors.map(v=>{
            return (
              <TabPanel value={v.id}>
                <h4>{v.service_name} Vendors List</h4>
                <Grid container spacing={2} className='match-height'>
                  {
                    data.map(c=>{
                    return (
                      <Grid item xs={12} md={4}>
                        <Card component='div' sx={{ position: 'relative', mb: 7 }}>
                            <CardContent sx={{ display: 'flex' }}>
                              <Grid item xs={12} md={6}>
                                <Avatar
                                alt={c.first_name}
                                  src={c.file[0]}
                                  sx={{ width: 56, height: 56 }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                              <Typography
                                component='div'
                                variant='p'
                                sx={{
                                  fontWeight: 'bold',
                                  mb: 10,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  flexDirection: 'column',
                                  height:'50%'
                                }}
                              >
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>ID</span>
                                  <span>{c.user_id}</span>
                                </Typography>
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>Name</span>
                                  <span>{c.first_name}</span>
                                </Typography>
                                <Typography component='div' variant='p' sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between', }}>
                                  <span>Number</span>
                                  <span>{c.telephone}</span>
                                </Typography>
                                
                              </Typography>
                              </Grid>
                            
                            </CardContent>
                            <Grid item xs={12}  sx={{px:5,width:'100%'}}>
                            <Typography sx={{ fontWeight: 'bold',display:'flex',justifyContent: 'space-between' }}>
                                  <Button variant="outlined">View Locations</Button>
                                  <Button variant="contained">View Details</Button>
                                </Typography>
                              </Grid>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
      <div>
        <Dialog
          open={detailsModalOpen}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullScreen
        >
          <DialogTitle id="scroll-dialog-title">Admin Commission Report Details</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Card component='div' sx={{ position: 'relative', mt: 20 }}>
            <CardContent>
              <DataGrid
                rows={detailedData}
                columns={detailedColumn}
                pageSize={10}
                getRowId={row => row.key}
                rowsPerPageOptions={[10]}
                autoHeight
              />
            </CardContent>
          </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      
      <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default OurVendor
