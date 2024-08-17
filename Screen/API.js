import { StyleSheet, Text, View, Alert, Image, Dimensions, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Location from 'expo-location';
import Constants from 'expo-constants'
import Icon from './Icon';

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')

const API = () => {
    const [location, setLocation] = useState(null);
    const [temp, setTemp] = useState('');
    const [des, setDesc] = useState('');
    const [feelsLike, setFeelsLike] = useState('');
    const [humidity, setHumidity] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [speed, setSpeed] = useState('');
    const [pressure, setPressure] = useState('');
    const [name, setName] = useState('');
    const [refreshing, setRefreshing] = useState(false); // State for refresh control

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var date = new Date().getDate();
    var month = new Date().getMonth();
    var year = new Date().getFullYear();
    const currentDayIndex = new Date().getDay();
    var time = new Date().getHours();
    var time2 = new Date().getMinutes();
    const currentDayName = daysOfWeek[currentDayIndex];

    const wetherfetch = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission denied");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;
            setLocation({ latitude, longitude });

            const openWeatherKey = '6d886a35d42408999b317003105bd364';
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherKey}`;

            const res = await axios.get(weatherUrl);
            setName(res.data.name);
            setTemp(res.data.main.temp);
            setFeelsLike(res.data.main.feels_like);
            setHumidity(res.data.main.humidity);
            setDesc(res.data.weather[0].main);
            setIconUrl(res.data.weather[0].icon);
            setSpeed(res.data.wind.speed);
            setPressure(res.data.main.pressure);
        } catch (err) {
            console.log(err);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        wetherfetch();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        wetherfetch();
    }

    let ImageURL;
    let ImageURL2;
    let ImageURL3;
    let back;

    if (des.toLowerCase() === 'clouds') {
        ImageURL = require('../assets/cloud.png')
        ImageURL2 = require('../assets/cloud.png')
        ImageURL3 = require('../assets/cloud.png')
    } else if (des.toLowerCase() === 'rain') {
        ImageURL = require('../assets/heavy-rain.png')
        ImageURL2 = require('../assets/storm.png')
        ImageURL3 = require('../assets/water.png')
        back = require('../assets/rainn.jpg')
    } else if (des.toLowerCase() === 'clear') {
        ImageURL2 = require('../assets/sun (1).png')
    } else {
        ImageURL2 = require('../assets/sun.png')
    }


    const coloring = () => {
        if (des === 'clouds') {
            return '#e5e8e8'
        }
        else if (des === 'rain') {
            return '#d4e6f1'
        }
        else if (des === 'clear') {
            return '#fdebd0'
        }
        else {
            return '#d5f5e3'
        }
    }

    return (
        <ScrollView
            style={{ flex: 1, width: '100%', paddingTop: Constants.statusBarHeight, backgroundColor: coloring() }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>{currentDayName}    </Text>
                <Text>{date}-</Text>
                <Text>{month + 1}-</Text>
                <Text>{year}</Text>
            </View>
            <View style={{ marginTop: 20, }}>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Now</Text>
                    <Text>{name}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 35 }}>
                        <Text style={{ fontSize: 18, marginTop: 25, fontWeight: 'bold' }}>{temp} °C</Text>
                        <Image source={{ uri: `https://openweathermap.org/img/wn/${iconUrl}@2x.png` }} style={{ width: 100, height: 100, marginTop: -20, }} />
                        <Text style={{ fontSize: 16, marginLeft: width * 0.2, fontWeight: 'bold' }}>{des}</Text>
                    </View>

                    <View style={{ marginTop: -50, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <Text style={{}}>{time}:</Text>
                            <Text>{time2}</Text>
                            {time > 12 ? <Text> PM</Text> : <Text> AM</Text>}
                        </View>
                        <View>
                            <Text style={{}}>Wind {speed} KM/h</Text>
                            <Text style={{ marginRight: 10 }}>Pressure {pressure}  </Text>
                        </View>

                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: width * 0.1, marginTop: height * 0.15, marginBottom: 20, position: 'static' }}>
                    <View style={{ backgroundColor: "tomato", width: width * 0.30, height: height * 0.18, borderRadius: 15, justifyContent: 'space-evenly', alignItems: 'center', elevation: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Feels Like</Text>
                        <Image source={require("../assets/temp.png")} style={{ width: 50, height: 50 }}></Image>
                        <Text>{feelsLike}</Text>
                    </View>
                    <View style={{ backgroundColor: "lightblue", width: width * 0.30, height: height * 0.18, borderRadius: 15, justifyContent: 'space-evenly', alignItems: 'center', elevation: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Humidity</Text>
                        <Image source={require("../assets/humidity.png")} style={{ width: 50, height: 50 }}></Image>
                        <Text>{humidity}%</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 10 }}>

                <View style={{ marginTop: '50%', flexDirection: 'row' }}>
                    <View style={{ position: 'absolute', }}>
                        <Icon src={ImageURL3} style={{ width: 40, height: 40 }} />
                    </View>
                    <Icon src={ImageURL2} />
                    <Icon src={ImageURL2} />

                </View>
                <View style={{ marginTop: '58%', }}>
                    <Icon src={ImageURL3} style={{ width: 40, height: 40 }} />
                </View>
                <View style={{ marginTop: '70%' }}>
                    <Icon src={ImageURL3} style={{ width: 40, height: 40 }} />
                </View>
                <View style={{ marginTop: '50%' }}>
                    <Icon src={ImageURL2} />
                </View>
            </View>
        </ScrollView>
    )
}

export default API


