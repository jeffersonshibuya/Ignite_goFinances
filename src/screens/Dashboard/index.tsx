import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components'
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
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface IHighlightProps {
  amount: string;
  lastTransaction: string;
}
interface IHighlightData {
  entries: IHighlightProps;
  expenses: IHighlightProps;
  total: IHighlightProps;
}

function getLastTransactionDate(
  collection: DataListProps[],
  type: 'positive' | 'negative'
) {
  const lastTransaction =
    Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long'
    }).format(
      new Date(
        Math.max.apply(Math,
          collection
            .filter((transaction: DataListProps) => transaction.type === type)
            .map((transaction: DataListProps) => new Date(transaction.date).getTime())
        )
      ));

  return lastTransaction;
}

export function Dashboard() {

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<IHighlightData>({} as IHighlightData)

  async function getTransactions() {
    const dataKey = "@gofinances:transactions"
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : []

    let incomesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] =
      transactions.map((transaction: DataListProps) => {

        if (transaction.type === 'positive') {
          incomesTotal += Number(transaction.amount)
        } else {
          expensesTotal += Number(transaction.amount)
        }

        const amountFormatted = Number(transaction.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })

        const dateFormatted = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(transaction.date))

        return {
          id: transaction.id,
          name: transaction.name,
          amount: amountFormatted,
          category: transaction.category,
          date: dateFormatted,
          type: transaction.type,
        }
      })

    setTransactions(transactionsFormatted)

    if (transactions.length > 0) {

      const lastTransactionEntries = incomesTotal !== 0 && getLastTransactionDate(transactions, 'positive') || 0
      const lastTransactionExpenses = expensesTotal !== 0 && getLastTransactionDate(transactions, 'negative')

      const totalInterval = `01 a ${lastTransactionExpenses}`

      const total = incomesTotal - expensesTotal

      setHighlightData({
        entries: {
          amount: incomesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: `Última entrada dia ${lastTransactionEntries}`
        },
        expenses: {
          amount: expensesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: `Última saída dia ${lastTransactionExpenses}`
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: totalInterval
        }
      })
    }

    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    getTransactions();
  }, []))

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/10772632?v=4' }} />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>Jefferson</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={() => { }}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>

            </Header>

            <HighlightCards>
              <HighlightCard
                type='up'
                title="Entradas"
                amount={highlightData.entries?.amount}
                lastTransaction={highlightData.entries?.lastTransaction}
              />
              <HighlightCard
                type='down'
                title="Saídas"
                amount={highlightData.expenses?.amount}
                lastTransaction={highlightData.expenses?.lastTransaction}
              />
              <HighlightCard
                title="Total"
                type='total'
                amount={highlightData.total?.amount}
                lastTransaction={highlightData.total?.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title> Listagem </Title>

              <TransactionList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              >

              </TransactionList>
            </Transactions>
          </>
      }
    </Container>
  )
}