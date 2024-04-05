import { useState } from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  Share,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import { FontAwesome } from '@expo/vector-icons'

import * as ImagePicker from 'expo-image-picker'

import { Header } from "@/components/header";
import { Credential } from "@/components/credential";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { QRCode } from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";

export default function Ticket() {
  const [expandQRCode, setExpandQRCode] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        })
      }

    } catch (error) {
      console.log(error)
      Alert.alert('Compartilhar', "Não foi possível compartilhar")
    }
  }

  async function handleSelectCredentialImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      })

      if (result.assets) {
        badgeStore.update(result.assets[0].uri)
      }

    } catch (error) {
      console.log(error)
      Alert.alert('Credential Image', 'Não foi possível selecionar a imagem')
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle='light-content' />

      <Header title="Minha Credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectCredentialImage}
          onExpandQRCode={() => setExpandQRCode(true)}
        />

        <MotiView
          from={{
            translateY: 0,
          }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: "timing",
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar Credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do {badgeStore.data.eventTitle}!
        </Text>

        <Button title="Compartilhar" onPress={handleShare} />

        <TouchableOpacity
          className="mt-10"
          activeOpacity={0.7}
          onPress={() => badgeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={expandQRCode}
        statusBarTranslucent
        animationType="fade"
      >
        <View className=" flex-1 justify-center items-center bg-green-500">
          <QRCode value="Diego Novaes" size={300} />
          <TouchableOpacity activeOpacity={0.7} onPress={() => setExpandQRCode(false)}>
            <Text className="font-body text-center text-orange-500 text-sm mt-10">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}