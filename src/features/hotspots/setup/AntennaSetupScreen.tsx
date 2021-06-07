import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { getCountry } from 'react-native-localize'
import { useSelector } from 'react-redux'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import Box from '../../../components/Box'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import Button from '../../../components/Button'
import DiscoveryModeIcon from '../../../assets/images/discovery_mode_icon.svg'
import { useColors } from '../../../theme/themeHooks'
import HotspotConfigurationPicker from '../../../components/HotspotConfigurationPicker'
import hotspotOnboardingSlice from '../../../store/hotspots/hotspotOnboardingSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import { MakerAntenna } from '../../../makers/antennas/antennaMakerTypes'
import Helium from '../../../makers/antennas/helium'
import { HotspotMakerModels } from '../../../makers/hotspots'

const AntennaSetupScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const colors = useColors()
  const dispatch = useAppDispatch()
  const hotspotType = useSelector(
    (state: RootState) => state.hotspotOnboarding.hotspotType,
  )

  const defaultAntenna = useMemo(() => {
    const country = getCountry()
    const isUS = country === 'US'
    const makerAntenna = HotspotMakerModels[hotspotType || 'Helium'].antenna
    const ant =
      isUS && makerAntenna?.us ? makerAntenna.us : makerAntenna?.default

    if (!ant) return isUS ? Helium.HELIUM_US : Helium.HELIUM_EU

    return ant
  }, [hotspotType])

  const [antenna, setAntenna] = useState<MakerAntenna>(defaultAntenna)
  const [gain, setGain] = useState<number>(defaultAntenna.gain)
  const [elevation, setElevation] = useState<number>(0)

  const navNext = useCallback(async () => {
    if (!antenna) return

    dispatch(hotspotOnboardingSlice.actions.setElevation(elevation))
    dispatch(hotspotOnboardingSlice.actions.setGain(gain))
    dispatch(hotspotOnboardingSlice.actions.setAntenna(antenna))
    navigation.navigate('HotspotSetupConfirmLocationScreen')
  }, [antenna, dispatch, elevation, gain, navigation])

  return (
    <BackScreen>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
      >
        <Box flex={1} justifyContent="center" paddingBottom="xxl">
          <Box
            height={52}
            width={52}
            backgroundColor="purple500"
            borderRadius="m"
            alignItems="center"
            justifyContent="center"
          >
            <DiscoveryModeIcon
              color={colors.purpleMain}
              width={30}
              height={22}
            />
          </Box>
          <Box>
            <Text
              variant="h1"
              marginBottom="s"
              marginTop="l"
              maxFontSizeMultiplier={1}
            >
              {t('antennas.onboarding.title')}
            </Text>
            <Text
              variant="subtitleLight"
              numberOfLines={2}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.3}
            >
              {t('antennas.onboarding.subtitle')}
            </Text>
          </Box>
          <HotspotConfigurationPicker
            selectedAntenna={antenna}
            onAntennaUpdated={setAntenna}
            onGainUpdated={setGain}
            onElevationUpdated={setElevation}
          />
        </Box>
      </KeyboardAvoidingView>
      <Button
        title={t('generic.next')}
        mode="contained"
        variant="primary"
        onPress={navNext}
      />
    </BackScreen>
  )
}

const styles = StyleSheet.create({ keyboardAvoidingView: { flex: 1 } })

export default AntennaSetupScreen
