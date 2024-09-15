import { View, Modal, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Delivery from './Delivery';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import No from '../assets/no.png';

export default function MyActivity() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("pending");
    const { user } = useContext(UserContext);
    const [addNewOrder, setAddNewOrder] = useState(false);
    const [orderId, setOrderId] = useState(null);
  

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            console.log('No user found');
        }
    }, [status, user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.29.143:3000/api/live-orders/${status}?deliveryPersonId=${user.userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                Alert.alert('Error', 'Failed to fetch orders');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus); // Triggers useEffect to re-fetch orders
    };

    const handleNewOrder = async () => {
        if (!orderId || isNaN(orderId)) {
            Alert.alert("Error", "Order ID is required and must be a number");
            return;
        }
        try {
            const response = await fetch("http://192.168.29.143:3000/api/live-orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    deliveryPersonId: user.userID,
                }),
            });

            if (response.ok) {
                console.log("Order added successfully");
                setAddNewOrder(false);
                setOrderId(null);
                fetchOrders(); // Re-fetch orders after adding a new one
            } else {
                Alert.alert("Error", "Failed to add new order");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "An unexpected error occurred");
        }
    };

    const handleCloseModal = () => {
        setAddNewOrder(false);
        setOrderId(null);
    };

    return (
        <SafeAreaView className="flex-1 p-4 bg-white">
            <Text className="text-xl text-center font-bold mb-4 p-4">
                Hello {user.name}!
            </Text>

            <View className="flex flex-row justify-around mb-4">
                <TouchableOpacity
                    onPress={() => handleStatusChange('pending')}
                    className={`py-2 px-4 rounded-lg ${status === 'pending' ? 'bg-amber-500' : 'bg-gray-200'}`}
                    accessibilityLabel="Pending Orders"
                    accessibilityHint="View orders that are pending delivery"
                >
                    <Text className={`text-lg ${status === 'pending' ? 'text-white' : 'text-black'}`}>To Be Delivered</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleStatusChange('delivered')}
                    className={`py-2 px-4 rounded-lg ${status === 'delivered' ? 'bg-amber-500' : 'bg-gray-200'}`}
                    accessibilityLabel="Delivered Orders"
                    accessibilityHint="View orders that have been delivered"
                >
                    <Text className={`text-lg ${status === 'delivered' ? 'text-white' : 'text-black'}`}>Delivered</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Delivery key={order._id} order={order} />
                        ))
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <Image source={No} style={{ width: 100, height: 100 }} />
                            <Text className="text-lg mt-4">No orders available</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                className="bg-amber-500 py-3 px-6 rounded-lg justify-center items-center mt-4"
                onPress={() => setAddNewOrder(true)}
                accessibilityLabel="Add New Order"
                accessibilityHint="Opens a modal to add a new order"
            >
                <Text className="text-white">Add New Order</Text>
            </TouchableOpacity>

            <Modal
                animationType='slide'
                visible={addNewOrder}
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white p-4 rounded-lg w-80">
                        <Text className="text-xl mb-4 font-bold">Enter Order ID</Text>

                        <TextInput
                            className="border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2"
                            placeholder="Order ID"
                            value={orderId ? orderId.toString() : ''}
                            onChangeText={(id) => setOrderId(Number(id))}
                            keyboardType="numeric"
                            accessibilityLabel="Order ID Input"
                            accessibilityHint="Enter the order ID here"
                        />

                        <View className="flex-row items-center justify-center">
                            <TouchableOpacity className="bg-amber-500 py-2 px-4 rounded-lg mr-2" onPress={handleNewOrder} accessibilityLabel="Add Order Button">
                                <Text className="text-white text-center">Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-amber-500 py-2 px-4 rounded-lg" onPress={handleCloseModal} accessibilityLabel="Close Modal Button">
                                <Text className="text-white text-center">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}
