import { View } from "react-native"
import CheckIn from "../components/CheckIn"

const CheckInScreen = ({ route }) => {
    const { place } = route.params;

    return (
        <View style={styles.container}>
            <CheckIn place={place} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default CheckInScreen;