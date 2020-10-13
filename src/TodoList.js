import React, { useState, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
SafeAreaView,
Keyboard,
BackHandler,
FlatList,
Alert,
ActivityIndicator,
Image,
TouchableOpacity
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';



const TodoListScreen = () => {
    const [isLoading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [isError, setError] = useState(false);

    const getDataFromAPi = () =>{
        setLoading(true);
        setError(false);
        const url = 'http://jsonplaceholder.typicode.com/todos';
            console.log("url ---> "+url);
            fetch(url)
              .then((response) => response.json())
              .then((json) => setTodos(json))
              .catch((error) => {setError(true);})
              .finally(() => setLoading(false));
    };

    useEffect(() => {
        getDataFromAPi()
    }, []);

    const onReloadClick = () => {
        getDataFromAPi()
    };

    const backAction = () => {
     Alert.alert("Hold on!", "Are you sure you want to go back?", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);

    const renderItem = ({item}) => (
        <Item
            id = {item.id}
            title = {item.title}
            completed = {item.completed}
        />
    );


    console.log("isError ---> "+ isError);
    return(
          <SafeAreaView style = {styles.container}>
              {isError ?
                  (
                      <View style = {styles.errorView}>
                          <Text style = {styles.errorMainTitle}>
                              Something went wrong
                          </Text>
                          <Text style = {styles.errorSubTitle}>
                              Give it another try
                          </Text>
                          <TouchableOpacity
                              style = {styles.reloadBtn}
                              onPress = {onReloadClick}>
                            <Text style={styles.reloadText}>RELOAD</Text>
                          </TouchableOpacity>
                      </View>
                  )
               : (isLoading ? <ActivityIndicator/> : (
                          <FlatList
                             data={todos}
                             keyExtractor={item => item.id.toString()}
                             renderItem={renderItem}
                           />
                   ))
               }
          </SafeAreaView>
    );
};

const Item = ({id, title, completed}) => (
    <View style = {styles.item}>
        <Text style = {styles.title}>
            {id}
        </Text>
        <Text style = {styles.title}>
            {title}
        </Text>
        <Image
            style = {styles.imageStyle}
            source = {completed ? require('./assets/completed_icon.png') : require('./assets/cross_icon.png')}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems : 'center',
        justifyContent : 'center',
        padding: 8
    },
    item : {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 10,
        backgroundColor : Colors.white,
        elevation: 3

    },
    title : {
        fontSize : 16,
        paddingBottom: 6,
        color : Colors.black
    },
    imageStyle : {
        width: 20,
        height: 20,
        resizeMode: 'stretch',
    },
    errorView : {
        alignItems : "center",
    },
    errorMainTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorSubTitle: {
        fontSize: 14,
        marginTop:5,
    },
    reloadText :{
        fontSize: 14,
        color: "#147EFB",
        fontWeight: 'bold'
    },
    reloadBtn:{
        marginTop: 5,
    },

});

export default TodoListScreen;