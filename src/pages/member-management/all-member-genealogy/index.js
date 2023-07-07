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
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Avatar } from '@mui/material'
const AllMemberGenealogy = () => {
  const [search, setSearch] = useState(null)
  const [data, setData] = useState(null)
  const searchGeneology = () => {
    if(search){
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/member/genealogy/${search}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.accessToken}`
        }
      }).then(response => {
        setData(response.data)
      }).catch(error => {
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
  return (
    <>
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent>
          <Grid item xs={12}>
            <Box>
              <Typography variant='h5' sx={{ my: 8 }}>
                All members Tree
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography variant='p'>Search with member ID to see downline</Typography>
              <TextField xs={6} fullWidth label='Search ' onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Sponsor ID' />
            </Grid>

            <Grid item sx={{ mb: 20 }} xs={12}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={searchGeneology}>
                Search
              </Button>
            </Grid>
          </Grid>
          {console.log(data)}
          {data?
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <ul id='myUL'>
                  <li>
                    <Typography sx={{ display: 'flex' }} className='caret'>
                      <Avatar src={data.image} width={50} height={50} alt='Profile Picture' />
                      <Typography sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{data.user_id}</span>
                        <span>{data.name}</span>
                      </Typography>
                    </Typography>
                    {data.tree?(
                      <ul className='nested'>
                        {data.tree.map(t => {
                          return (
                            <li>
                              <Typography sx={{ display: 'flex' }}>
                                <Image
                                  className='avtarimg'
                                  src='/images/avatars/3.png'
                                  width={50}
                                  height={50}
                                  alt='Profile Picture'
                                />
                                <Typography sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <span>{t.user_id}</span>
                                  <span>{t.first_name} {t.last_name}</span>
                                </Typography>
                              </Typography>
                            </li>
                          )
                        })}
                      </ul>
                    ):''}
                  </li>
                </ul>
              </Grid>
              :''
          }
        </CardContent>
      </Card>
    </>
  )
}

export default AllMemberGenealogy
