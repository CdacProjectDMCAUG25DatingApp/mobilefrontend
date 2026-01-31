import { View, Text } from 'react-native'
import React from 'react'
import ProfileView from './ProfileView'

const EditProfile = () => {
  return (
    <View>
      <ProfileView componentEditable={true}/>
    </View>
  )
}

export default EditProfile