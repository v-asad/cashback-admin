// ** MUI Imports
import Grid from '@mui/material/Grid'
import { divide } from 'lodash'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Welcome from 'src/views/dashboard/Welcome'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useAuth } from 'src/hooks/useAuth'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
// by nabeel
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

// end
const Dashboard = () => {
  const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'
  const options = {
    title: {
      text: 'Total Members chart'
    },
    xAxis: {
      title:'dd',
      categories: [
        'January',
        'February',
        'March',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'April',
        'November',
        'Decemeber'
      ]
    },
    series: [
      {
        data: [10, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  }
  const auth = useAuth()

  const [categories, setCategories] = useState([])
  const [data, setData] = useState([])
  const [row, setRow] = useState([])

  // by nabeel
  let loadData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel`, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      })
      .then(response => {
        setCategories(Object.keys(response.data.graph[0].members))
        setRow(Object.values(response.data.graph[0].members))
        setData(response.data)
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

  useEffect(() => {
    loadData()
  }, [])
  // end
  return (
    <div>
      <Card component='div' sx={{ position: 'relative', mb: 7 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='p' sx={{ fontWeight: 'bold' }}>
            Today Register ( {data.usersRegistered?.today})
          </Typography>
          <Typography variant='p' sx={{ fontWeight: 'bold' }}>
            This Week Register ( {data.usersRegistered?.thisWeek})
          </Typography>
          <Typography variant='p' sx={{ fontWeight: 'bold' }}>
            This Month Register ( {data.usersRegistered?.thisMonth} )
          </Typography>
          <Typography variant='p' sx={{ fontWeight: 'bold' }}>
            This Year Register ( {data.usersRegistered?.thisYear} )
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={5} sx={{ mt: 5 }} className='match-height'>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.usersRegistered?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Total Registered User
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.usersRegistered?.today} User Register Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.sales?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Total Sales Amount
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.sales?.today} generated today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.pendingLevelIncomeDistributed?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Pending Level Income Distributed
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.pendingLevelIncomeDistributed?.today} distribute today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.paidLevelIncomeDistributed?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Paid Level Income Distributed
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.paidLevelIncomeDistributed?.today} distribute today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.pendingCoFounderIncomeDistributed?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Pending Co-founder Income Distributed
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.pendingCoFounderIncomeDistributed?.today} distribute today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.paidCoFounderIncomeDistributed?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Paid Co-founder Income Distributed
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.paidCoFounderIncomeDistributed?.today} distribute today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.pendingWithdrawal?.total}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Pending Withdrawal
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                {data.pendingWithdrawal?.today} Pending Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between', fontSize: 20 }}
              >
                {data.company_revenue}
                <Avatar sx={{}} variant='rounded'></Avatar>
              </Typography>

              <Typography component='div' variant='p' sx={{ fontWeight: 'bold' }}>
                Company Revenue Till Now
              </Typography>
              <Typography
                component='div'
                variant='p'
                sx={{ fontWeight: 'bold', mt: 10, display: 'flex', justifyContent: 'center', fontSize: 20 }}
              >
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...options,
                  xAxis: {     title:'dd', categories },
                  series: [{ data:row }]
                }}
              />
            </CardContent>
          </Card>  
        </Grid>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <HighchartsReact
                highcharts={Highcharts} 
                constructorType={'mapChart'}
                allowChartUpdate={true}
                immutable={false}
                updateArgs={[true, true, true]}
                containerProps={{ className: 'chartContainer' }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card component='div' sx={{ position: 'relative', mb: 7 }}>
            <CardContent>
              <ComposableMap fill="darkslategray" stroke="gray" strokeWidth="0.1px" projectionConfig={{ scale: 140 }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) => geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)}
                </Geographies>
              </ComposableMap>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard
