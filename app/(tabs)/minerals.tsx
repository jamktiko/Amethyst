import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import MineralButton from '@/components/MineralButton';
import Teksti from '@/components/Textbox';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

type MineralData = {
  id: string;
  Name: string; // Matching the exact field names from Firestore
  Image: string; // Image URL string from Firestore
};

function Minerals({ navigation }: { navigation: any }) {
  const [mineralData, setMineralData] = useState<MineralData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch mineral data from Firestore
    const fetchMinerals = async () => {
      try {
        // Reference to the 'Mineral' collection in Firestore
        const mineralCollection = collection(db, 'Mineral');

        // Get all documents from the collection
        const mineralSnapshot = await getDocs(mineralCollection);

        // Map Firestore documents to MineralData type
        const minerals: MineralData[] = mineralSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            Name: data.Name ?? 'Unknown Mineral', // Ensure 'Name' is always a string
            Image: data.Image ?? '', // Ensure 'Image' is always a string
          };
        });

        // Set state with the fetched mineral data
        setMineralData(minerals);
      } catch (error) {
        console.error('Error fetching minerals:', error);
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    };

    fetchMinerals(); // Call the fetch function
  }, []);

  // Display a loading spinner while data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  // Render the minerals once loading is complete
  return (
    <View style={styles.background}>
      <Text style={styles.header}>
        Find
        <Text style={styles.normalFont}> a suitable crystal for your mood</Text>
      </Text>
      <Teksti style={styles.stonebox}>
        <ScrollView contentContainerStyle={styles.grid}>
          {mineralData.map((item) => (
            <MineralButton
              key={item.id}
              title={item.Name} // Access the correct field name
              img={{ uri: item.Image }} // Provide fallback for image
              onPress={() =>
                navigation.navigate('MineralData', { itemId: item.id })
              } // Navigate to MineralData page with the ID
            />
          ))}
        </ScrollView>
      </Teksti>
    </View>
  );
}
//Tyylittely
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#3F3154',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  stonebox: {
    backgroundColor: 'rgba(145, 137, 152, 0.5)',
    borderColor: '#ACA3AF',
    borderWidth: 4,
    height: '65%',
    width: '90%',
    margin: 15,
  },
  header: {
    fontSize: 30,
    fontFamily: 'Kadwa_700Bold',
    color: 'white',
    marginHorizontal: 40,
    height: '20%',
  },
  normalFont: {
    fontFamily: 'Kadwa_400Regular',
  },
});

export default Minerals;
