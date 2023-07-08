//----------
// MUI Imports
//----------
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'

const ShoppingInvoiceDetail = () => {
  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            INVOICE
          </Typography>
          <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex' }}>
            TOTAL PURCHASE: SAR 200.00
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
            TO: abdulrahman abubakar , , SAUDI ARABIA Tel: 0593226633
          </Typography>
          <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
            OFFICE ADDRESS: Cognisance Sciences
          </Typography>

          <Typography
            variant='div'
            sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
          >
            INVOICE INFO:
            <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
              Invoice Number 44544655
            </Typography>
            <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
              Invoice Date 2023-05-18
            </Typography>
            <Typography variant='div' sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
              Invoice Status Paid
            </Typography>
          </Typography>
        </Box>
      </Grid>
      <Card component='div' sx={{ position: 'relative', my: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align='center'>ITEM</TableCell>
                    <TableCell align='center'>UNIT COST</TableCell>
                    <TableCell align='center'>QUANTITY</TableCell>
                    <TableCell align='center'>TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'></TableCell>
                    <TableCell align='center'></TableCell>
                    <TableCell align='center'></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant='div' sx={{ my: 8, fontWeight: 'bold', display: 'flex' }}>
                Subtotal: 200.00 SAR
              </Typography>
              <Typography variant='div' sx={{ my: 8, fontWeight: 'bold', display: 'flex' }}>
                GRAND TOTAL: 200.00 SAR
              </Typography>
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ShoppingInvoiceDetail
