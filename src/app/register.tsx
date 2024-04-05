import { Alert, Image, StatusBar, View } from 'react-native'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'

import { Input } from '@/components/input'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { useState } from 'react'
import { api } from '@/server/api'
import axios from 'axios'
import { useBadgeStore } from '@/store/badge-store'

const EVENT_ID = "aa92cc76-dd53-4539-9509-c2cfd0315b10"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert('Inválido', 'Preencha todos os campos')
      }

      setIsLoading(true)
    
      const response = await api.post(`/events/${EVENT_ID}/attendees`, { name, email })

      console.log(response.data)

      if (response.data.attendeeId) {
        const badgeResponse = await api.get(`/attendees/${response.data.attendeeId}/badge`)
        console.log(badgeResponse.data)

        badgeStore.save(badgeResponse.data.badge)

        Alert.alert("Register", "Inscrição concluída com sucesso!", [
          { text: 'ok', onPress: () => router.push("/ticket") }
        ])
      }
    
    } catch (error) {
      
      console.log(error)

      setIsLoading(false)

      if (axios.isAxiosError(error)) {
        if(String(error.response?.data.message).includes("already registered")) {
          return Alert.alert('Register', "Este e-mail já está cadastrado")
        }
      }

      Alert.alert('Register', "Não foi possível fazer a inscrição")
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
          <FontAwesome6
            name='user-circle'
            color={colors.green[200]}
            size={20}
          />

          <Input.Field placeholder='Nome completo' onChangeText={setName} />
        </Input>

        <Input>
          <MaterialIcons
            name='alternate-email'
            color={colors.green[200]}
            size={20}
          />

          <Input.Field
            placeholder='E-mail'
            keyboardType='email-address'
            onChangeText={setEmail}
          />
        </Input>

        <Button title='Realizar Inscrição' onPress={handleRegister} isLoading={isLoading} />

        <Link href='/' className='text-gray-100 text-base font-bold text-center mt-8'>
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}