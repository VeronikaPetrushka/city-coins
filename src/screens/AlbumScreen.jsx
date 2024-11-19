import { View } from "react-native"
import Album from "../components/Album"

const AlbumScreen = ({ route }) => {
    const { name, photos } = route.params;

    return (
        <View style={styles.container}>
            <Album name={name} photos={photos} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AlbumScreen;