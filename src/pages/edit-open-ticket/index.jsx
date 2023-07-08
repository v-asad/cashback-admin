//----------
// MUI Imports
//----------
import { Grid, Button, Box, TextField, Typography, Card, CardContent } from '@mui/material'

const EditOpenTicket = () => {
  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            OPEN TICKET RESPONSE
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              Ticket Number7
            </Grid>
            <Grid item xs={12}>
              User Namemajed
            </Grid>
            <Grid item xs={12}>
              User IdEmark68396
            </Grid>

            <Grid item xs={12}>
              Category TypeFinancial
            </Grid>
            <Grid item xs={12}>
              Subjecttest4
            </Grid>
            <Grid item xs={12}>
              Posted Date2022-09-21
            </Grid>
            <Grid item xs={12}>
              Descriptiontest4
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Response' placeholder='Enter Response' />
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
