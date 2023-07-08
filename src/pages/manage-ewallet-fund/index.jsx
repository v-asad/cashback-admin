//----------
// MUI Imports
//----------
import { Grid, Button, Box, Typography, Card, CardContent, TextField } from '@mui/material'

const ManageEwalletFund = () => {
  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            ADD FUND TO WALLET
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Enter userid or username of the user' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Amount' placeholder='Enter the amount' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Remark' placeholder='Enter the amoremarkunt' />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label='Wallet Type' placeholder='Wallet Type' />
            </Grid>

            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant='h5' sx={{ my: 8 }}>
                  DEDUCT FUND FROM WALLET
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label='Userid' placeholder='Enter userid or username of the user' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Amount' placeholder='Enter the amount' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Remark' placeholder='Enter the amoremarkunt' />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label='Wallet Type' placeholder='Wallet Type' />
            </Grid>

            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ManageEwalletFund
