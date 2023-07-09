//----------
//  React Imports
//----------
import { useState } from 'react'

//----------
// MUI Imports
//----------
import {
  Button,
  Box,
  Typography,
  Card,
  InputLabel,
  IconButton,
  TextField,
  FormControl,
  useMediaQuery,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  Divider
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

//----------
// Other library Imports
//----------
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'

//----------
// Local Imports
//----------
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

//----------
// Styled Components
//----------
const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

//----------
// Yup Schemas
//----------
const schema = yup.object().shape({
  username: yup.string().min(3).required(),
  password: yup.string().min(5).required()
})

//----------
//  Constants
//----------
const defaultValues = {
  password: '',
  username: ''
}
const skin = 'bordered';
const LoginPage = () => {
  //----------
  //  States
  //----------
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState(null)
  const [isSubmitting, setSubmitting] = useState(false)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  //----------
  //  Hook Form
  //----------
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  //----------
  //  Handlers
  //----------
  const onSubmit = data => {
    setSubmitting(true)

    const { username, password } = data

    auth.login({ username, password, role }, ({ success, message }) => {
      setSubmitting(false)
      if (success) toast.success('Logged In')
      else message.map(msg => toast.error(msg))
    })
  }

  //----------
  //  JSX
  //----------
  return (
    <Box sx={{ overflow: 'auto' }} className='content-center cloudbg'>
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Card
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 6
                }}
              >
                <img src='/images/logo.png' style={{ width: 150, objectFit: 'cover' }} />
              </Box>
              <TypographyStyled variant='h5'>{`Welcome to Uplines admin dashboard`}</TypographyStyled>
              <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* <RoleSelect role={role} setRole={setRole} /> */}
              <Divider />
              <FormControl fullWidth sx={{ my: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Username'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      n
                      error={Boolean(errors.username)}
                      placeholder='username'
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ my: 7 }} disabled={isSubmitting}>
                Login
              </Button>
            </form>
          </BoxWrapper>
        </Card>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
