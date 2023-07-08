//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
// MUI Imports
//----------
import { TextField, Grid, Button, Box, Typography, Card, Backdrop, CardContent, CircularProgress } from '@mui/material'

//----------
// Other library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
// Local Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

const Manage = () => {
  //----------
  //  States
  //----------
  const [level1, setLevel1] = useState(0)
  const [level2, setLevel2] = useState(0)
  const [level3, setLevel3] = useState(0)
  const [level4, setLevel4] = useState(0)
  const [level5, setLevel5] = useState(0)
  const [cofounderBonus, setCofounderBonus] = useState(0)
  const [open, setOpen] = useState(false)
  const [id, setId] = useState(null)

  //----------
  //  Hooks
  //----------
  const auth = useAuth()

  //----------
  //  Effects
  //----------
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/commision-mgt`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          setLevel1(response.data.l1)
          setLevel2(response.data.l2)
          setLevel3(response.data.l3)
          setLevel4(response.data.l4)
          setLevel5(response.data.l5)
          setCofounderBonus(response.data.cofounder_percent)
          setId(response.data.id)
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

    loadData()
  }, [])

  //----------
  //  Handlers
  //----------
  const submitHandler = () => {
    setOpen(true)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/controlpanel/commision-mgt/${id}`,
        {
          l1: level1,
          l2: level2,
          l3: level3,
          l4: level4,
          l5: level5,
          cofounder_percent: cofounderBonus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        }
      )
      .then(response => {
        if (response.data.success) {
          toast.success(response.data.message)
          setOpen(false)
        }
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

  //----------
  //  JSX
  //----------
  return (
    <>
      <Grid item xs={12}>
        <Box>
          <Typography variant='h5' sx={{ my: 8 }}>
            Commission Manage
          </Typography>
        </Box>
      </Grid>

      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Level 1 Bonus'
                onChange={e => setLevel1(e.target.value)}
                value={level1}
                placeholder='Level 1 Bonus'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Level 2 Bonus'
                onChange={e => setLevel2(e.target.value)}
                value={level2}
                placeholder='Level 2 Bonus'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Level 3 Bonus'
                onChange={e => setLevel3(e.target.value)}
                value={level3}
                placeholder='Level 3 Bonus'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Level 4 Bonus'
                onChange={e => setLevel4(e.target.value)}
                value={level4}
                placeholder='Level 4 Bonus'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                xs={6}
                fullWidth
                label='Level 5 Bonus'
                onChange={e => setLevel5(e.target.value)}
                value={level5}
                placeholder='Level 5 Bonus'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Cofounder Bonus'
                onChange={e => setCofounderBonus(e.target.value)}
                value={cofounderBonus}
                placeholder='Cofounder Bonus '
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={submitHandler}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default Manage
