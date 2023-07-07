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
import { create } from 'src/services/student.service'
import { toast } from 'react-hot-toast'
import { getBySchoolId } from 'src/services/grade.service'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

const steps = ['Select School', 'Select Grade', 'Add Student']

const AddTeacherWizard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const [selectedSchool, setSelectedSchool] = React.useState(null)
  const [selectedGrade, setSelectedGrade] = React.useState(null)

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
        return (
          <SelectGrade
            back={handleBack}
            next={handleNext}
            schoolId={selectedSchool}
            selected={selectedGrade}
            setSelected={setSelectedGrade}
          />
        )
      case 2:
        return <AddStudent back={handleBack} finish={finish} schoolId={selectedSchool} gradeId={selectedGrade} />
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
  const isSelected = selected === school.id
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
        background: theme => (isSelected ? theme.palette.primary.main : `transparent`),
        color: theme => (isSelected ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (isSelected ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => setSelected(school.id)}
    >
      <Typography variant='p'>{school.name}</Typography>
      {isSelected && <Icon icon='mdi:tick' />}
    </Card>
  )
}

const SelectSchool = ({ selected, setSelected, next }) => {
  const [schools, setSchools] = React.useState([])
  const [canProceed, setCanProceed] = React.useState(false)
  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      const data = await getByClientId(auth.user.id)

      if (data.success) {
        setSchools(data.schools)
      }
    }

    fn()
  }, [])

  React.useEffect(() => {
    setCanProceed(selected !== null)
  }, [selected])

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
        <Button variant='contained' onClick={next} disabled={!canProceed}>
          Next
        </Button>
      </Box>
    </>
  )
}

const Grade = ({ grade, selected, setSelected }) => {
  const isSelected = selected === grade.id
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
        background: theme => (isSelected ? theme.palette.primary.main : `transparent`),
        color: theme => (isSelected ? theme.palette.primary.contrastText : 'auto'),
        border: theme => (isSelected ? `1px solid ${theme.palette.primary.main}` : `1px solid transparent`),
        '&:hover': {
          boxShadow: 5
        }
      }}
      onClick={() => setSelected(grade.id)}
    >
      <Typography variant='p'>{grade.name}</Typography>
      <Typography variant='p' fontSize={13}> Assigned to {grade.teacher.name}</Typography>
      {isSelected && <Icon icon='mdi:tick' />}
    </Card>
  )
}

const SelectGrade = ({ selected, setSelected, schoolId, back, next }) => {
  const [grades, setGrades] = React.useState([])
  const [canProceed, setCanProceed] = React.useState(false)
  React.useEffect(() => {
    setCanProceed(selected !== null)
  }, [selected])

  const auth = useAuth()

  React.useEffect(() => {
    const fn = async () => {
      const data = await getBySchoolId(schoolId)

      if (data.success) {
        setGrades(data.grades)
      }
    }

    fn()
    console.log(grades)
  }, [])

  return (
    <>
      <Typography variant='h6' sx={{ mt: 1, textAlign: 'center' }}>
        Select Grade
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center' }}>
        Please select the Grade you want to assign this Student to
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
        {grades.map((grade, i) => (
          <Grade key={i} grade={grade} setSelected={setSelected} selected={selected} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, justifyContent: 'space-between' }}>
        <Button variant='outlined' onClick={back}>
          Back
        </Button>
        <Button variant='contained' onClick={next} disabled={!canProceed}>
          Next
        </Button>
      </Box>
    </>
  )
}

const AddStudent = ({ back, finish, schoolId, gradeId }) => {
  const [name, setName] = React.useState('')
  const [nameAr, setNameAr] = React.useState('')
  const [gender, setGender] = React.useState('Male')
  const [email, setEmail] = React.useState('')
  const [phoneNo, setPhoneNo] = React.useState('')

  const auth = useAuth()

  const addTeacher = async () => {
    const result = await create(name, nameAr, gender, email, phoneNo, auth.user.id, schoolId, gradeId)

    if (result.success) {
      toast.success('Student has been added')
      finish(result.student)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <>
      <Box sx={{ mb: 9, textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
          Add New Student
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField value={name} onChange={e => setName(e.target.value)} fullWidth label='Student Name' size='small' />
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
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup row value={gender} onChange={e => setGender(e.target.value)}>
              <FormControlLabel value='Male' control={<Radio />} label='Male' />
              <FormControlLabel value='Female' control={<Radio />} label='Female' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            label='Guardian Email'
            size='small'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type='tel'
            value={phoneNo}
            onChange={e => setPhoneNo(e.target.value)}
            fullWidth
            label='Guardian Phone No'
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
          Save
        </Button>
      </Box>
    </>
  )
}

export default AddTeacherWizard
