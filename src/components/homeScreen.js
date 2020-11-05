import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';

class Home extends Component {
    render() {
        return (
            <View>
                <Text>This is the homepage</Text>
                <Button
                    title="Go to Calendar"
                    onPress={() => this.props.navigation.navigate('Calendar')}
                />
            </View>
        )
    }
}
export default Home;