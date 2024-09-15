import { View, Text, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from "../assets/logo.png";
import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icons from '../components/Icons';
import { UserContext } from '../context/UserContext';
import Feather from '@expo/vector-icons/Feather';

export default function SignIn() {
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();
    const { setUser } = useContext(UserContext);

    const handleLogin = async () => {
        if (userID.length < 6) {
            alert("User ID must be at least 6 characters long.");
            return;
        }
        if (password.length < 3) {
            alert("Password must be at least 3 characters long.");
            return;
        }

        try {
            const response = await fetch("http://192.168.29.143:3000/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID, password })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update context with the user data
                navigation.navigate("My Activity");
            } else {
                alert("User ID or password is incorrect");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-none justify-center items-center m-9 ">
                    <Image source={Logo} />
                </View>

                <View className="flex-none p-4 mt-12">
                    <Text className="text-4xl font-bold mb-2">Sign In</Text>
                    <Text className="text-xl mb-4">Welcome Back!</Text>

                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                        <Icons.SimpleLineIcons name="user" size={20} className="mr-2" />
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder="Enter User ID"
                            value={userID}
                            onChangeText={(text) => setUserID(text)}
                        />
                    </View>

                    {/* Password Input with Toggle Icon */}
                    <View className="flex-row items-center border-2 rounded-lg border-amber-200 bg-amber-100 mb-4 p-2">
                    <TouchableOpacity className = "mr-2" onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Feather
                                name={isPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 text-lg"
                            placeholder="Enter Password"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                       
                    </View>

                    <TouchableOpacity className="bg-amber-500 py-3 rounded-lg justify-center items-center mt-4" onPress={handleLogin}>
                        <Text className="text-lg text-white">Login</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-center mt-4">
                        <Text className="text-md px-1">Don't have an account?</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("SignUp") }}>
                            <Text className="text-amber-500 text-md">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
