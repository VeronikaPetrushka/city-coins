import { View } from "react-native"
import Store from "../components/Store"

const StoreScreen = () => {
    return (
        <View style={styles.container}>
            <Store />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default StoreScreen;