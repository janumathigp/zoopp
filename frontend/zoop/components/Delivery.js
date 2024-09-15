import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useContext } from 'react';
import Icons from './Icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';

export default function Delivery({ order }) {
    const { orderDetails } = order;  // Destructure orderDetails from order
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    // Extract latitude, longitude, and phone number from orderDetails
    const { deliveryAddress, phone } = orderDetails;
    const { latitude, longitude } = deliveryAddress || {};

    // Handle navigation to the MapsScreen with the location
    const handleNavigateToMap = () => {
        if (latitude && longitude && user?.userID) {
            navigation.navigate('Maps', {
                customerLocation: { latitude, longitude },
                orderId: order.orderId,
                deliveryPersonId: user.userID
            });
        } else {
            console.warn('Navigation parameters are missing or invalid');
        }
    };

    // Handle calling the customer
    const handleCallCustomer = () => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            console.warn('Phone number is not available');
        }
    };

    return (
        <TouchableOpacity onPress={handleNavigateToMap} className="rounded-lg" accessibilityLabel="Order Details" accessibilityHint="View order details and navigate to map">
            <View className="bg-amber-100 p-6 rounded-lg mb-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-800">{orderDetails.customerName}</Text>
                    <TouchableOpacity 
                        onPress={handleCallCustomer} 
                        className="p-2 bg-amber-500 rounded-full" 
                        accessibilityLabel="Call Customer" 
                        accessibilityHint="Call the customer">
                        <Icons.SimpleLineIcons name="phone" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <Text className="text-lg text-gray-600 mb-2">
                    Order ID: <Text className="font-bold text-amber-500">#{order.orderId}</Text>
                </Text>

                {/* Delivery Address */}
                <View className="flex-row">
                    <Icons.SimpleLineIcons name='location-pin' size={20} color="gray" />
                    <View className="ml-3">
                        <Text className="text-md text-gray-700">{deliveryAddress?.firstLine}</Text>
                        {deliveryAddress?.secondLine && (
                            <Text className="text-md text-gray-700">{deliveryAddress.secondLine}</Text>
                        )}
                        <Text className="text-md text-gray-700">{deliveryAddress?.city}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
