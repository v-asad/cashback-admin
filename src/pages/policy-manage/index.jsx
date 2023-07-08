//----------
// MUI Imports
//----------
import { Grid, Button, Box, Typography, Card, CardContent, TextField } from '@mui/material'

const EditOpenTicket = () => {
  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            POLICY MANAGE
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label='Update' placeholder='Update Policy' />
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

export default EditOpenTicket
