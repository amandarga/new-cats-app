import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [cats, setCats] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCats = async () => {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search?limit=10');
      setCats((prevCats) => [...prevCats, ...response.data]);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);


  const toggleFavorite = (cat) => {
    if (favorites.some((fav) => fav.id === cat.id)) {
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== cat.id));
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, cat]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 Gatos Perfeitos 🐱</Text>
      <Text style={styles.subtitle}>Favoritos: {favorites.length}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={cats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.catCard,
                  favorites.some((fav) => fav.id === item.id) && styles.favorite,
                ]}
                onPress={() => toggleFavorite(item)}
              >
                <Image source={{ uri: item.url }} style={styles.catImage} />
              </TouchableOpacity>
            )}
          />
          <Button title="Carregar Mais Imagens" onPress={fetchCats} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  catCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  catImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  favorite: {
    borderWidth: 3,
    borderColor: '#FF0000',
  },
});
