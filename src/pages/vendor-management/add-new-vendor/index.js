import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import CardContent from '@mui/material/CardContent'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link'
const AddNewVendor = () => {
  const auth = useAuth()
  const [services, setServices] = useState([])
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [description, setDescription] = useState(null)
  const [companyName, setCompanyName] = useState(null)
  const [companyRegistrationNo, setCompanyRegistrationNo] = useState(null)
  const [email, setEmail] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [address, setAddress] = useState(null)
  const [phonecode, setPhonecode] = useState(null)
  const [telephone, setTelephone] = useState(null)
  const [landmark, setLandmark] = useState(null);
  const [service, setService] = useState(null);
  const [serviceTitle, setServiceTitle] = useState(null);
  const [serviceDescription, setServiceDescription] = useState(null);
  const [creditLimit, setCreditLimit] = useState(null);
  const [commision, setCommision] = useState(null);
  const [location, setLocation] = useState(null);
  const [uploadGallery, setUploadGallery] = useState([])
  const [open, setOpen] = useState(false)
  const [uploadLogo, setUploadLogo] = useState(null)
  const [ourServices, setOurServices] = useState({id: [], title: [], description: []})
  const [servicesContainer, setServicesContainer] = useState([])
  const router = useRouter()

  const galleryUploadHandler = (id) => {
    const formData = new FormData();
    for (let i = 0; i < uploadGallery.length; i++) {
      formData.append('gallery', uploadGallery[i]);
    }
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    }).then(resp => {
      // let data = resp.data
      // if(data.success){
      //   toast.success(data.message);
      // }else{
      //   toast.error(data.message)
      // }
      // setGallery(data.files)
      // setUploadGallery([]);
      return true
    }).catch(error => {
      toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
        if (error.response && error.response.status == 401) {
          auth.logout();
        }
    });
  }

  const submitLogoHandler = (id) => {
    const formData = new FormData();
    formData.append('cmp_logo', uploadLogo);
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/update/logo/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    }).then(resp => {
      // let data = resp.data
      // if(data.success){
      //   toast.success(data.message);
      // }else{
      //   toast.error(data.message)
      // }
      // setCmpLogo(data.cmp_logo)
      // setUploadLogo(null);
      return true
    }).catch(error => {
      toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
        if (error.response && error.response.status == 401) {
          auth.logout();
        }
    });
  }

  const handleGalleryUpload = event => {
    setUploadGallery(event.target.files);
  }

  const handleLogoUpload = (event) => {
    const selectedImage = event.target.files[0];
    setUploadLogo(selectedImage);
  }
  
  const loadServices = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/services`, {
      headers: {
        "Authorization": `Bearer ${localStorage.accessToken}`
      }
    })
      .then(response => {
        setServices(response.data)
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
          auth.logout();
        }
      })
  }

  const loadCountries = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/countries`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
      })
  }
  useEffect(() => {
    loadServices()
    loadCountries()
  }, [])
  const handleCountryChange = (event) => {
    setCountry(event.target.value)
    countries.forEach(c=>{
      if(c.name == event.target.value){
        setPhonecode(c.phonecode)
      }
    })
  }

  const handleServiceChange = (event) => {
    setService(event.target.value)
  }

  const submitProfileHandler = (event) => {
    // setOpen(true)
    let errors = 0
    if(!uploadGallery.length){
      toast.error('Please upload a atleast 1 gallery item!')
      errors++
    }
    if(!uploadLogo){
      toast.error('Logo is required')
      errors++
    }
    if(!errors){
      let updateArr = {
          "username": username,
          "password": password,
          "description": description,
          "franchise_category": "Normal Franchise",
          "company_reg_no": companyRegistrationNo,
          "first_name": companyName,
          "email": email,
          "country": country,
          "state": state,
          "city": city,
          "address": address,
          "phonecode": phonecode,
          "telephone": telephone,
          "lendmark": landmark,
          "service": ourServices,
          "commission_percent": commision,
          "credit_limit": creditLimit,
          "location": location,
          "sex": "male"
      }
      setOpen(true)
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/create`, updateArr, {
        headers: {
          "Authorization": `Bearer ${localStorage.accessToken}`
        }
      })
        .then(resp => {
          let data = resp.data
          if(data.success){
            let msg = data.message
            let id = data.vendor.id
            submitLogoHandler(id)
            galleryUploadHandler(id)
            toast.success(msg)
            router.replace('/vendor-management/vendor-list/')
            setOpen(false)
          }else{
            toast.error(data.message)
          }
        })
        .catch(error => {
          setOpen(false)
          if(error.response && error.response.data){
            if(error.response.data && error.response.data.message){
              toast.error(`${error.response? error.response.status:''}: ${error.response?error.response.data.message:error}`);
            }
            if(error.response.data && error.response.data.errors){
              error.response.data.errors.map(err => toast.error(err.msg))
            }
          }
          if (error.response && error.response.status == 401) {
            auth.logout();
          }
        })
    }
  }
  const addService = () => {
    let errors = 0
    if(!service){
      toast.error('Service is required!')
      errors++
    }
    if(!serviceTitle){
      toast.error('Service Title is required!')
      errors++
    }
    if(!errors){
      ourServices.id.push(service)
      ourServices.title.push(serviceTitle)
      ourServices.description.push(serviceDescription)
      let filter = services.filter(s => s.id == service )
      let servicename = filter.map(s => s.service_name)
      let obj = {
        id: service,
        name: servicename,
        title: serviceTitle,
        description: serviceDescription
      }
      let container = [...servicesContainer, obj]
      setServicesContainer(container)
      setOurServices(ourServices)
      setService(null)
      setServiceTitle('')
      setServiceDescription('')
    }
  }

  const deleteItem = (id) => {
    ourServices.id.map((t, key)=>{
      if(t == id){
        ourServices.id.splice(key, 1)
        ourServices.title.splice(key, 1)
        ourServices.description.splice(key, 1)
        let container = servicesContainer.splice(key, 1)
        setServicesContainer(container)
        setOurServices(ourServices)
      }
    })
  }
  return (
    <>
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid item xs={12}>
            <Box>
              <Typography variant='h5' sx={{ my: 8 }}>
                Vendor Registration Form
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField xs={6} fullWidth label='Username' onChange={(e) => setUsername(e.target.value)} value={username}  placeholder='Enter Username' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField xs={6} fullWidth label='Password' onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Enter Password' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='About Company' onChange={(e) => setDescription(e.target.value)} value={description} placeholder='About Company' />
            </Grid>
            <Grid item xs={12}>
            <Typography variant='h6' sx={{ my: 8 }}>
              Company Profile
            </Typography>
            </Grid>
          
            <Grid item md={6} xs={12}>
              <TextField xs={6} fullWidth label='Company Registration Number' onChange={(e) => setCompanyRegistrationNo(e.target.value)} value={companyRegistrationNo} placeholder='Company Registration Number' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField xs={6} fullWidth label='Company Name/Business Name' onChange={(e) => setCompanyName(e.target.value)} value={companyName} placeholder='Company Name/Business Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Email address' placeholder='Email address' onChange={(e) => setEmail(e.target.value)} value={email} />
            </Grid>
            <Grid item md={6} xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Country"
                    placeholder='Select Country'
                    onChange={handleCountryChange}
                  >
                    {countries.map(c=><MenuItem value={c.name} selected={c.name == country}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField xs={6} fullWidth label='State' onChange={(e) => setState(e.target.value)} value={state} placeholder='State' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='City' placeholder='City' onChange={(e) => setCity(e.target.value)} value={city} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label=' Full Address' placeholder='Full Address' onChange={(e) => setAddress(e.target.value)} value={address} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='Location(Google map link)' placeholder='Location(Google map link)' onChange={(e) => setLocation(e.target.value)} value={location} />
            </Grid>
            <Grid item md={2} xs={3}>
              <TextField fullWidth label='Phonecode' placeholder='Enter Phone code' disabled onChange={e => setPhonecode(e.target.value)} value={phonecode}  />
            </Grid>
            <Grid item md={4} xs={9}>
              <TextField fullWidth label='Mobile' onChange={(e) => setTelephone(e.target.value)} value={telephone} placeholder='Enter Mobile Phone' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='Landmark' placeholder='Landmark' onChange={(e) => setLandmark(e.target.value)} value={landmark} />
            </Grid>
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} component='label'>
                Upload Gallery Image/s
                <input hidden accept='image/*' multiple type='file' onChange={handleGalleryUpload} />
              </Button>
              {uploadGallery.length } Files selected
            </Grid>
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} component='label'>
                Brand Logo
                <input hidden accept='image/*'  type='file' onChange={handleLogoUpload} />
              </Button>
              {uploadLogo &&  (
                      <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>
                      <ImageListItem key={URL.createObjectURL(uploadLogo)}>
                      <img
                        src={`${URL.createObjectURL(uploadLogo)}`}
                        srcSet={`${URL.createObjectURL(uploadLogo)}`}
                        alt={URL.createObjectURL(uploadLogo)}
                        loading="lazy"
                      />
                    </ImageListItem>
                </ImageList>)}
            </Grid>

            <Grid item  xs={12}>
            <Typography variant='h6' sx={{ my: 8 }}>
              Our Service
            </Typography>
            </Grid>
            {ourServices.id.length > 0 ?
              <Grid item md={12} xs={12}>
                <Box sx={{ minWidth: 120 }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Services Table">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell align="right">Service Name</TableCell>
                          <TableCell align="right">Title</TableCell>
                          <TableCell align="right">Description</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ourServices.id.map((row, key) => (
                          <TableRow
                            key={key}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {key+1}
                            </TableCell>
                            <TableCell align="right">{services.map(s=>s.id==row&&s.service_name)}</TableCell>
                            <TableCell align="right">{ourServices.title[key]}</TableCell>
                            <TableCell align="right">{ourServices.description[key]}</TableCell>
                            <TableCell align="right">
                              <Grid container spacing={0}>
                                <Grid item xs={6}>
                                  <Link href='javascript:void(0)' onClick={() => deleteItem(row)}>Delete</Link>
                                </Grid>
                              </Grid>
                              </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>:''}
            <Grid item md={3} xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="service-simple-select-label">Service</InputLabel>
                  <Select
                    labelId="service-simple-select-label"
                    id="service-simple-select"
                    label="Service"
                    placeholder='Select Service'
                    onChange={handleServiceChange}
                    value={service}
                  >
                    {services.map(c=><MenuItem value={c.id}>{c.service_name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField fullWidth label='Title' onChange={(e) => setServiceTitle(e.target.value)} value={serviceTitle} placeholder='Title' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='Description' onChange={(e) => setServiceDescription(e.target.value)} value={serviceDescription} placeholder='Description' />
            </Grid>

            
            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={addService}>
                Add NEW
              </Button>
            </Grid>

            <Grid item  xs={12}>
            <Typography variant='h6' sx={{ my: 8 }}>
            Commission Details
            </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='Commission Percent' onChange={(e) => setCommision(e.target.value)} value={commision} placeholder='Commission Percent' />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label='Credit Limit' onChange={(e) => setCreditLimit(e.target.value)} value={creditLimit} placeholder='Credit Limit' />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={submitProfileHandler}>
                Submit
              </Button>
            </Grid>



          </Grid>
        </CardContent>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default AddNewVendor
