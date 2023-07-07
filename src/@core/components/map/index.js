import { Box } from '@mui/material'

import { GoogleMap, Marker, useGoogleMap } from '@react-google-maps/api'
import React, { useEffect } from 'react'

const containerStyle = {
  width: 'inherit',
  height: 'inherit'
}

const center = {
  lat: 23.885942,
  lng: 45.079162
}

const Map = ({ marker, setMarker, isLoaded }) => {
  return (
    <Box sx={{ width: '100%', height: 350, mt: 2 }}>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={e => {
            if (e.placeId) {
              setMarker({
                ...marker,
                place_id: e.placeId,
                active: true,
                latLng: e.latLng
              })
            } else {
              setMarker({
                ...marker,
                query: e.latLng.lat() + ', ' + e.latLng.lng(),
                active: true,
                latLng: e.latLng
              })
            }
          }}
        >
          {marker.active && <CustomMarker marker={marker} />}
        </GoogleMap>
      )}
    </Box>
  )
}

const CustomMarker = ({ marker }) => {
  const googleMap = useGoogleMap()

  useEffect(() => {
    if (googleMap && marker.active) googleMap.panTo(marker.latLng)
  }, [marker.latLng])

  return <Marker position={marker.latLng} />
}

export default Map
