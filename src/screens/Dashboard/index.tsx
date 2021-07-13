import React from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';


import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de site",
    amount: "R$ 12.000,00",
    category: {
      name: 'Vendas',
      icon: 'dollar-sign'
    },
    date: "12/07/2021"
  }, {
    id: '2',
    type: 'negative',
    title: "Hamburguer pizza",
    amount: "R$ 68,00",
    category: {
      name: 'Alimentação',
      icon: 'coffee'
    },
    date: "07/07/2021"
  }, {
    id: '3',
    type: 'negative',
    title: "Alguel do apartamento",
    amount: "R$ 1.200,00",
    category: {
      name: 'Casa',
      icon: 'shopping-bag'
    },
    date: "05/07/2021"
  }]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/10772632?v=4' }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Jefferson</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>

      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 17.400, 00"
          lastTransaction="Última entrada dia 13 de abril"
          type='up'
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.250, 00"
          lastTransaction="Última entrada dia 3 de abril"
          type='down'
        />
        <HighlightCard
          title="Total"
          amount="R$ 16.150, 00"
          lastTransaction="Última entrada dia 20 de abril"
          type='total'
        />
      </HighlightCards>

      <Transactions>
        <Title> Listagem </Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        >

        </TransactionList>
      </Transactions>

    </Container>
  )
}