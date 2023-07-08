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
  ImageList,
  ImageListItem,
  Backdrop,
  CircularProgress
} from '@mui/material'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const ChangeProfilePhoto = () => {
  //----------
  //  States
  //----------
  const [data, setData] = useState([])
  const [image, setImage] = useState([])
  const [open, setOpen] = useState(false)
  const [uploadLogo, setUploadLogo] = useState(null)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadProfile = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          setData(response.data)
          setImage(response.data.image)
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

    loadProfile()
  }, [])

  //----------
  //  Handlers
  //----------
  const handleLogoUpload = event => {
    const selectedImage = event.target.files[0]
    setUploadLogo(selectedImage)
  }
  const uploadProfilePicture = () => {
    if (!uploadLogo) {
      toast.error('Image is required!')
    } else {
      setOpen(true)
      const formData = new FormData()
      formData.append('image', uploadLogo)
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/settings/profile-picture`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(resp => {
          let data = resp.data

          if (data.success) {
            toast.success(data.message)
          } else {
            toast.error(data.message)
          }
          setOpen(false)
          setImage(data.image)
          auth.user.image = data.image
          setUploadLogo(null)
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
                Change Profile Picture
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={9} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} component='label'>
                Upload Image
                <input hidden accept='image/*' multiple type='file' onChange={handleLogoUpload} />
              </Button>
            </Grid>
            <ImageList sx={{ width: 500, height: data.image ? 200 : 40 }} cols={3} rowHeight={164}>
              {!uploadLogo && image ? (
                <ImageListItem key={image}>
                  <img
                    src={`${image}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={image}
                    loading='lazy'
                  />
                </ImageListItem>
              ) : uploadLogo ? (
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
              ) : (
                ''
              )}
            </ImageList>

            <Grid item xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={uploadProfilePicture}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
    </>
  )
}

export default ChangeProfilePhoto
