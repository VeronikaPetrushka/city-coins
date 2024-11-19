import { View } from "react-native"
import PlannedTrips from "../components/PlannedTrips"

const PlannedTripsScreen = () => {
    return (
        <View style={styles.container}>
            <PlannedTrips />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PlannedTripsScreen;