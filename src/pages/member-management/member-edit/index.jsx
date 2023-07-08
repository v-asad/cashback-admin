//----------
// MUI Imports
//----------
import { Grid, Button, Box, Typography, Card, CardContent, TextField } from '@mui/material'

const MemberEdit = () => {
  //----------
  // JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            UPDATE MEMBER PROFILE
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Sponsor ID' placeholder='Sponsor ID' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Sponsor Name' placeholder='Sponsor Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='User Registration Date' placeholder='User Registration Date' />
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                  Personal Information
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Old Username' placeholder='Old Username' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Userid' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Username' placeholder='Username' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='First Name' placeholder='First Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Last Name' placeholder='Last Name' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Email' placeholder='Email' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Address' placeholder='Address' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Country' placeholder='Country' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Code:' placeholder='Code:' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Telephone' placeholder='Telephone' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='State' placeholder='State' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='City' placeholder='City' />
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

            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Update
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                  TOPUP MEMBER BUSINESS
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField xs={6} fullWidth label='Old Username' placeholder='Old Username' />
            </Grid>
            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                TopUP
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default MemberEdit
