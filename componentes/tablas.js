import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'Instalar-db.db', location: 'default' },
  () => console.log('DB opened'),
  (err) => console.error('DB error:', err)
);

export async function leerTabla() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS Aires (
          idAires INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          Marca TEXT NOT NULL,
          Frigorias INTEGER NOT NULL
        );
      `
      );
      tx.executeSql('SELECT * FROM Aires', [], (tx, results) => {
        const rows = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i));
        }
        resolve(rows);
      });
    }, reject);
  });
}

export default function Tablas() {
  const [Aires, setAires] = useState([]);

  useEffect(() => {
    async function initialFunction() {
      const data = await leerTabla();
      setAires(data);
    }
    initialFunction();
  }, []);

  return (
    <View style={styles.tabla1}>
      <FlatList
        data={Aires}
        keyExtractor={(item) => item.idAires.toString()}
        renderItem={({ item }) => (
          <Text>{`${item.Marca} - ${item.Frigorias}`}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabla1: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});
