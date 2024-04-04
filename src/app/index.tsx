import { Alert, Image, StatusBar, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'

import { Input } from '@/components/input'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState("")

  function handleAccessCredential() {
    if (!code.trim()) {
      return Alert.alert("Inválido", "Informe o código do ingresso")
    }
  }

  return (
    <View className='flex-1 bg-green-500 items-center justify-center p-8'>
      
      <StatusBar barStyle='light-content' />
      
      <Image
        source={require('@/assets/logo.png')}
        className='h-16'
        resizeMode='contain'
      />

      <View className='w-full mt-12 gap-3'>
        <Input>
          <MaterialCommunityIcons
            name='ticket-confirmation-outline'
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            placeholder='Código do ingresso'
            onChangeText={setCode}
          />
        </Input>

        <Button title='Acessar Credencial' onPress={handleAccessCredential}/>
        
        <Link href='/register' className='text-gray-100 text-base font-bold text-center mt-8'> Ainda não possui ingresso?</Link>
      </View>
    </View>
  )
}