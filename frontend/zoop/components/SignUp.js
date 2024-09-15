import { View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useContext } from 'react';
import Logo from '../assets/logo.png';
import Icons from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import Feather from '@expo/vector-icons/Feather';

export default function SignUp() {
    const [name, setName] = useState("");
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { setUser } = useContext(UserContext);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        if (!name || !userID || !password) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        if (password.length < 3) {
            Alert.alert("Error", "Password must be at least 3 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://192.168.29.143:3000/api/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, userID, password })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update context with the user data
                navigation.navigate("My Activity");
            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "An error occurred");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-none justify-center items-center m-9">
                    <Image source={Logo} />
                </View>
                <View className="flex-none p-4 mt-12">
                    <Text className="text-3xl mb-6">Register</Text>

                    {/* Name Input */}
                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                        <Icons.SimpleLineIcons name="info" className="mr-2" size={20} />
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder='Enter Name'
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>

                    {/* User ID Input */}
                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                        <Icons.SimpleLineIcons name="user" className="mr-2" size={20} />
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder='Enter User ID'
                            value={userID}
                            onChangeText={(text) => setUserID(text)}
                        />
                    </View>

                    {/* Password Input */}
                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                    <TouchableOpacity className = "mr-2" onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                            <Feather
                                name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder='Enter Password'
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                       
                    </View>

                    {/* Confirm Password Input */}
                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                    <TouchableOpacity className = "mr-2" onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                            <Feather
                                name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder='Confirm Password'
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                        />
                       
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity className="bg-amber-500 py-2 rounded-lg justify-center items-center" onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg">Register</Text>}
                    </TouchableOpacity>

                    {/* Navigation to Sign In */}
                    <View className="flex-row justify-center items-center mt-4">
                        <Text className="text-md px-1">Already have an account?</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("SignIn") }}>
                            <Text className="text-amber-500 text-md">Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
