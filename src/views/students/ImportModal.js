// ** React Imports
import { useState, forwardRef, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import SchoolSelect from './SchoolSelect'
import CampusSelect from './CampusSelect'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const ImportModal = ({ isOpen, handleClose }) => {
  // ** States
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedCampus, setSelectedCampus] = useState(null)

  const fileInputRef = useRef(null)

  const openFileSelector = () => fileInputRef.current.click()

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
        alert("File Found")
    } else {
        alert("No File Found")
    }
  }

  const handleProceed = async () => {}

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
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 9, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
            Add New Student
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <SchoolSelect school={selectedSchool} setSchool={setSelectedSchool} />
          </Grid>
          <Grid item xs={12}>
            <CampusSelect campus={selectedCampus} setCampus={setSelectedCampus} school={selectedSchool} />
          </Grid>
          <Grid item xs={12}>
            <Button variant='outlined' sx={{ mb: 3 }} onClick={openFileSelector}>
              Upload Spreadsheet
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} hidden />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleProceed}>
          Proceed
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportModal
