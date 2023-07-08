//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  IconButton,
  InputAdornment
} from '@mui/material'

//----------
// MUI Icon Imports
//----------
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const AddNewMember = () => {
  //----------
  //  States
  //----------
  const [packages, setPackages] = useState([])
  const [countries, setCountries] = useState([])
  const [sponsorId, setSponsorId] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [firstname, setFirstname] = useState(null)
  const [lastname, setLastname] = useState(null)
  const [email, setEmail] = useState(null)
  const [confirmEmail, setConfirmEmail] = useState(null)
  const [country, setCountry] = useState(null)
  const [phonecode, setPhonecode] = useState(null)
  const [telephone, setTelephone] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()
  let router = useRouter()

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadPackages = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/packages`)
        .then(response => {
          setPackages(response.data)
        })
        .catch(error => {
          toast.error(
            `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
          )
        })
    }
    loadPackages()

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
  //  Handlers
  //----------
  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleMouseDownPassword = event => event.preventDefault()
  const submitProfileHandler = () => {
    let updateArr = {
      sponsorid: sponsorId,
      platform: platform,
      username: username,
      password: password,
      confirm_password: confirmPassword,
      transaction_pwd1: '',
      firstname: firstname,
      lastname: lastname,
      email: email,
      confirm_email: confirmEmail,
      country: country,
      phonecode: phonecode,
      mobile: telephone,
      term_cond: 'yes'
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/create`, updateArr, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(resp => {
        let data = resp.data
        if (data.success) {
          toast.success(data.message)
          router.replace('/member-management/all-member-list')
        } else {
          toast.error(data.message)
        }
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
  const handleCountryChange = event => {
    setCountry(event.target.value)
    countries.forEach(c => {
      if (c.name == event.target.value) {
        setPhonecode(c.phonecode)
      }
    })
  }

  //----------
  //  JSX
  //----------
  return (
    <>
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid item xs={12}>
            <Box>
              <Typography variant='h5' sx={{ my: 8 }}>
                User Registration Form
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Sponsor Information'
                onChange={e => setSponsorId(e.target.value)}
                value={sponsorId}
                placeholder='Sponsor ID'
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl xs={6} fullWidth>
                <InputLabel id='demo-simple-select-label'>Select Package</InputLabel>
                <Select fullWidth label='Select Package' onChange={e => setPlatform(e.target.value)}>
                  {packages &&
                    packages.map(pack => (
                      <MenuItem value={pack.id}>
                        {pack.name} ({pack.amount})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                xs={6}
                fullWidth
                label='Create Login Information'
                onChange={e => setUsername(e.target.value)}
                value={username}
                placeholder='Enter User Name'
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <FormControl variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={6}>
              <FormControl variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => setConfirmPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='First Name'
                onChange={e => setFirstname(e.target.value)}
                value={firstname}
                placeholder='Enter First Name'
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Last Name'
                onChange={e => setLastname(e.target.value)}
                value={lastname}
                placeholder='Enter Last Name'
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Email'
                onChange={e => setEmail(e.target.value)}
                value={email}
                placeholder='Enter Email'
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                onChange={e => setConfirmEmail(e.target.value)}
                value={confirmEmail}
                label='Confirm Email'
                placeholder='Confirm Email'
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Country</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Country'
                    placeholder='Select Country'
                    onChange={handleCountryChange}
                  >
                    {countries.map(c => (
                      <MenuItem value={c.name} selected={c.name == country}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item md={2} xs={3}>
              <TextField
                fullWidth
                label='Phonecode'
                placeholder='Enter Phone code'
                disabled
                onChange={e => setPhonecode(e.target.value)}
                value={phonecode}
              />
            </Grid>
            <Grid item md={4} xs={9}>
              <TextField
                fullWidth
                label='Mobile'
                onChange={e => setTelephone(e.target.value)}
                value={telephone}
                placeholder='Enter Mobile Phone'
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={submitProfileHandler}>
                Register
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default AddNewMember
