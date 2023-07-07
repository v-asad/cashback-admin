import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Icon } from '@iconify/react'
import { useAuth } from 'src/hooks/useAuth'
import { Card, Grid, TextField } from '@mui/material'

import { getByClientId } from 'src/services/school.service'
import { create } from 'src/services/teacher.service'
import { toast } from 'react-hot-toast'

const steps = ['Select School', 'Select Grade']

const SendBulkWizard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState(0)

  const isStepOptional = () => false

  const isStepSkipped = step => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const finish = args => {
    handleReset()
    onComplete(args)
  }

  const getComponent = step => {
    switch (step) {
      case 0:
        return <SelectSchool next={handleNext} selected={selectedSchool} setSelected={setSelectedSchool} />
      case 1:
        return <AddTeacher back={handleBack} finish={finish} schoolId={selectedSchool} />
      default:
        return <></>
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card
        sx={{
          width: '100%',
          py: 3,
          px: 1,
          boxShadow: 1,
          mb: 3
        }}
      >
        <Stepper activeStep={activeStep} sx={{ px: 2 }}>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant='caption'>Optional</Typography>
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Card>

      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 2 }}>{getComponent(activeStep)}</Box>
      )}
    </Box>
  )
}

const School = ({ school, selected, setSelected }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        p: 2,
        my: 1,
        boxShadow: 2,
        transition: '0.25s all ease-in-out',
        background: theme => (selected === school.id ? theme.palette.primary.main : `transparent`),
        color: theme => (selected === school.id ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (selected === school.id ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => setSelected(school.id)}
    >
      <Typography variant='p'>{school.name}</Typography>
      <Icon icon='material-symbols:chevron-right' />
    </Card>
  )
}

const SelectSchool = ({ selected, setSelected, next }) => {
  const [schools, setSchools] = React.useState([])
  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      const data = await getByClientId(auth.user.id)

      if (data.success) {
        setSchools(data.schools)
        setSelected(data.schools[0]?.id)
      }
    }

    fn()
  }, [])

  return (
    <>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select School
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        Please select the school you want to add the grade to
      </Typography>
      <Box
        sx={{
          mt: 3,
          p: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 250,
          maxHeight: 500,
          overflowY: 'auto'
        }}
      >
        {schools.map((school, i) => (
          <School key={i} school={school} setSelected={setSelected} selected={selected} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'flex-end' }}>
        <Button variant='contained' onClick={next}>
          Next
        </Button>
      </Box>
    </>
  )
}

const AddTeacher = ({ back, finish, schoolId }) => {
  const [name, setName] = React.useState('')
  const [nameAr, setNameAr] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const auth = useAuth()

  const addTeacher = async () => {
    const result = await create(name, nameAr, email, password, auth.user.id, schoolId)

    if (result.success) {
      toast.success('Grade has been added')
      finish(result.grade)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Select Grade
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField value={name} onChange={e => setName(e.target.value)} fullWidth label='Name' size='small' />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={nameAr}
            onChange={e => setNameAr(e.target.value)}
            fullWidth
            label='Arabic Name'
            size='small'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            label='Email'
            size='small'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            label='Password'
            size='small'
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 5 }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={addTeacher}>
          Send
        </Button>
      </Box>
    </>
  )
}

export default SendBulkWizard
