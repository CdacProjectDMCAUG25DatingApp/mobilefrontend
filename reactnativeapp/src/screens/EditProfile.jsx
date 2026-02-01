import { View, Text } from 'react-native'
import React from 'react'
import ProfileView from './ProfileView'

const EditProfile = () => {
  return (
      <ProfileView editable={true}/>
  )
}

export default EditProfile