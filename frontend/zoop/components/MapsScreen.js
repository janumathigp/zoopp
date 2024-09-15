import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { UserContext } from '../context/UserContext';

export default function MapsScreen() {
    const [location, setLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [travelMode, setTravelMode] = useState('driving'); // Default mode
    const [errorMsg, setErrorMsg] = useState(null); // For error handling
    const [distance, setDistance] = useState(null); // Store distance
    const [duration, setDuration] = useState(null); // Store duration
    const [loading, setLoading] = useState(true); // Loading state
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    const route = useRoute();
    const { customerLocation, orderId, deliveryPersonId } = route.params; // Get customer location and orderId from route params

    useEffect(() => {
        (async () => {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            // Get user's current location
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLoading(false);

            // Fetch route data from Google Maps Directions API
            fetchRoute(loc.coords, customerLocation, travelMode); // Fetch route with selected mode
        })();
    }, [travelMode]); // Fetch route when travel mode changes

    const fetchRoute = async (origin, destination, mode = 'driving') => {
        const GOOGLE_MAPS_APIKEY = 'AIzaSyCtgX-LWgL3naVNGzBC8G-d9xcoedsRlTU'; // Replace with your API key

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_MAPS_APIKEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes.length) {
                const points = polyline.decode(data.routes[0].overview_polyline.points);
                const routeCoords = points.map((point) => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setRouteCoords(routeCoords);

                // Get distance and duration from the response
                const route = data.routes[0].legs[0];
                setDistance(route.distance.text); // Distance (e.g., "5.6 km")
                setDuration(route.duration.text); // Duration (e.g., "15 mins")
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };

    const handleStatusChange = async () => {
        try {
            const response = await fetch('http://192.168.29.143:3000/api/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    deliveryPersonId: user.userID
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert('Success', 'Order status has been updated to Delivered.');
                navigation.navigate('My Activity',{ refresh: true });
            } else {
                Alert.alert('Error', data.message || 'Failed to update order status.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            Alert.alert('Error', 'An error occurred while updating the order status.');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-lg mt-4">Loading Map...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-red-500">{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Unable to retrieve location.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <MapView
                style={{ flex: 1 }}  // Map should take up full space
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.02,  // More zoomed in
                    longitudeDelta: 0.02,
                }}
            >
                <Marker coordinate={customerLocation} title="Customer Location" />

                {routeCoords.length > 0 && (
                    <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="blue" />
                )}
            </MapView>

            <View className="flex-row items-center justify-around p-3 bg-white">
                <View className="flex-col items-center justify-center">
                    <View className="flex-row items-center">
                        {/* Walking Mode */}
                        <TouchableOpacity
                            onPress={() => setTravelMode('walking')}
                            accessibilityLabel="Walking Mode"
                            accessibilityHint="Select walking mode for directions"
                            style={{
                                borderWidth: travelMode === 'walking' ? 2 : 0,
                                borderColor: travelMode === 'walking' ? 'blue' : 'transparent',
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <FontAwesome5 name="walking" size={24} color={travelMode === 'walking' ? 'blue' : 'black'} />
                        </TouchableOpacity>

                        <Text className="px-2 py-2"> | </Text>

                        {/* Driving Mode */}
                        <TouchableOpacity
                            onPress={() => setTravelMode('driving')}
                            accessibilityLabel="Driving Mode"
                            accessibilityHint="Select driving mode for directions"
                            style={{
                                borderWidth: travelMode === 'driving' ? 2 : 0,
                                borderColor: travelMode === 'driving' ? 'blue' : 'transparent',
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <FontAwesome5 name="car" size={24} color={travelMode === 'driving' ? 'blue' : 'black'} />
                        </TouchableOpacity>
                    </View>
                    {/* Display Distance and Duration */}
                    {distance && duration && (
                        <View className="flex-row items-center justify-around p-4">
                            <View className="flex-col justify-center items-center">
                                <View className="flex-row items-center">
                                    <Icons.SimpleLineIcons size={20} name="clock" className="mr-2" />
                                    <Text className="text-lg text-black-700">
                                        {duration}
                                    </Text>
                                </View>
                                <Text> ({distance})</Text>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity className="bg-amber-500 py-2 px-10 rounded-lg" onPress={handleStatusChange} accessibilityLabel="Update Order Status">
                    <Text className="text-xl text-white text-center"> Delivered</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
