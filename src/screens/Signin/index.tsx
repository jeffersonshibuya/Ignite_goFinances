import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { SigninSocialButton } from '../../components/SigninSocialButton';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SigninTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SignIn() {

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false)
  const { siginWithGoogle, siginWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      return await siginWithGoogle()
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Google')
      setIsLoading(false)
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true)
      return await siginWithApple()
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Apple')
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>Controle suas {'\n'}finanças de forma {'\n'}muito simples</Title>

          <SigninTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SigninTitle>
        </TitleWrapper>
      </Header>

      <Footer>
        <FooterWrapper>
          <SigninSocialButton
            onPress={handleSignInWithGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          {Platform.OS === 'ios' && <SigninSocialButton
            onPress={handleSignInWithApple}
            title="Entrar com Apple"
            svg={AppleSvg}
          />}
        </FooterWrapper>

        {isLoading && <ActivityIndicator
          color={theme.colors.shape}
          style={{ marginTop: 18 }}
        />}
      </Footer>


    </Container>
  )
}