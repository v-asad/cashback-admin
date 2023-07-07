// ** React Imports
import {useState, forwardRef, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { update } from "src/services/student.service"

import { toast } from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import SchoolSelect from "./SchoolSelect";
import CampusSelect from "./CampusSelect";
import GradeSelect from "./GradesSelect";
import TeacherSelect from "./TeacherSelect";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditStudent = (props) => {
  const { isOpen, handleClose, onSubmit, student } = props;

  // ** States
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedCampus, setSelectedCampus] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(
    () => {
      if (student.name) {
        setName(student.name)
      }
      if (student.schoolId) {
        setSchoolId(student.schoolId)
      }
    },
    [student]
  )

  // ** Hooks
  const bgColors = useBgColor()

  const handleSubmit = async () => {
    const updatedSchoolStudent = {
      ...student,
      name,email, number,  selectedSchool, selectedCampus, selectedGrade, selectedTeacher
    }

    const result = await update(student.id, name,email, number,  selectedSchool, selectedCampus, selectedGrade, selectedTeacher)

    if (result.success) {
      toast.success('School student has been edited')
      onSubmit(updatedSchoolStudent)
      handleClose()
    } else {
      toast.error(result.message)
    }
  }

  return (
      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 9, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Add New Student
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <Box
                // onClick={() => setAddressType('home')}
                sx={{
                  py: 3,
                  px: 4,
                  borderRadius: 1,
                  cursor: 'pointer',
                  ...bgColors.primaryLight,
                  border: theme => `1px solid ${theme.palette.primary.main}`
                }}
              >
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }} onClick={handleClose}>
                  <Icon icon='mdi:home-outline' />
                  <Typography variant='h6' sx={{ color: 'primary.main' }}>
                    Student
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <SchoolSelect school={selectedSchool} setSchool={setSelectedSchool} />
            </Grid>
            <Grid item xs={12}>
              <CampusSelect campus={selectedCampus} setCampus={setSelectedCampus} school={selectedSchool} />
            </Grid>
            <Grid item xs={12}>
              <GradeSelect grade={selectedGrade} setGrade={setSelectedGrade} campus={selectedCampus}/>
            </Grid>
            <Grid item xs={12}>
              <TeacherSelect teacher={selectedTeacher} setTeacher={setSelectedTeacher} grade={selectedGrade}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                label='Student Name'
                placeholder='Student Name'
              />
            </Grid>
            {/*<Grid item xs={12}>
              <TextField
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                label='Email'
                placeholder='Email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={number}
                onChange={e => setNumber(e.target.value)}
                fullWidth
                label='Phone Number'
                placeholder='5XXXXXXXXX'
              />
            </Grid>*/}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default DialogEditStudent
