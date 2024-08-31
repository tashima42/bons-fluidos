import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  container: {
    textAlign: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 20,
  },
  footer: {
    marginTop: 50,
    fontSize: 12,
    textAlign: 'center',
  },
});

const Certificado = ({ name, ra, eventTitle, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Certificado de Presença</Text>
        <Text style={styles.text}>
          Certificamos que
        </Text>
        <Text style={styles.subtitle}>
          {name}
        </Text>
        <Text style={styles.text}>
          com RA {ra}
        </Text>
        <Text style={styles.text}>
          participou da palestra
        </Text>
        <Text style={styles.subtitle}>
          {eventTitle}
        </Text>
        <Text style={styles.text}>
          no dia
        </Text>
        <Text style={styles.subtitle}>
          {date}
        </Text>
        <Text style={styles.text}>
          promovida pelo projeto de extensão Bons Fluídos.
        </Text>
        <Text style={styles.text}>
          Data de Emissão: {date}
        </Text>
      </View>
    </Page>
  </Document>
);

export default Certificado;
