import { View } from "react-native"
import Plan from "../components/Plan"

const PlanScreen = () => {
    return (
        <View style={styles.container}>
            <Plan />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PlanScreen;