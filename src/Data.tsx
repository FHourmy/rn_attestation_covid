import React from "react";
import {
	KeyboardAvoidingView,
	Button,
	Text,
	TextInput,
	View,
	ViewStyle,
	ScrollView,
} from "react-native";
import { Profile } from "./certificate";
import colors from "./colors";

export const checkProfile = (profile: Profile) => {
	if (
		profile.address &&
		profile.birthday &&
		profile.birthday.match(
			/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
		) &&
		profile.city &&
		profile.firstname &&
		profile.lastname &&
		profile.zipcode &&
		profile.city
	) {
		return true;
	}
	return false;
};
const styles = {
	view: { margin: 10 },
	container: {
		marginVertical: 5,
	} as ViewStyle,
	textStyle: { fontSize: 16 },
	inputStyle: {
		height: 40,
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: 3,
	},
	buttonView: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 10,
	} as ViewStyle,
	titleContainer: {
		alignItems: "center",
	} as ViewStyle,
	title: {
		fontSize: 20,
		fontWeight: "bold",
	} as ViewStyle,
	errorText: { color: colors.error, textAlign: "center" } as ViewStyle,
};

const parseBirthDay = (previousValue: string, value: string) => {
	if (
		value.split("/").length === 1 &&
		value.length === 2 &&
		previousValue.length === 1
	) {
		return value + "/";
	}
	if (
		value.split("/").length === 2 &&
		value.length === 5 &&
		previousValue.length === 4
	) {
		return value + "/";
	}
	return value;
};
const Data = ({
	profile,
	onClose,
}: {
	profile: Profile;
	onClose: (profile: Profile) => void;
}) => {
	const [lastname, setLastName] = React.useState(profile.lastname);
	const [firstname, setFirstname] = React.useState(profile.firstname);
	const [birthday, setBirthday] = React.useState(profile.birthday);
	const [placeofbirth, setPlaceofbirth] = React.useState(profile.placeofbirth);
	const [address, setAdress] = React.useState(profile.address);
	const [zipcode, setZipcode] = React.useState(profile.zipcode);
	const [city, setCity] = React.useState(profile.city);

	return (
		<View style={styles.view}>
			<ScrollView>
				<KeyboardAvoidingView enabled>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Données personelles</Text>
					</View>

					<View style={styles.container}>
						<Text style={styles.textStyle}>Prénom: </Text>
						<TextInput
							style={styles.inputStyle}
							value={firstname}
							onChangeText={setFirstname}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Nom: </Text>
						<TextInput
							style={styles.inputStyle}
							value={lastname}
							onChangeText={setLastName}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Date de naissance: </Text>
						<TextInput
							style={styles.inputStyle}
							value={birthday}
							onChangeText={(value) => {
								setBirthday(parseBirthDay(birthday, value));
							}}
							keyboardType={"numeric"}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Lieu de naissance: </Text>
						<TextInput
							style={styles.inputStyle}
							value={placeofbirth}
							onChangeText={setPlaceofbirth}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Adresse: </Text>
						<TextInput
							style={styles.inputStyle}
							value={address}
							onChangeText={setAdress}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Code postal: </Text>
						<TextInput
							style={styles.inputStyle}
							value={zipcode}
							onChangeText={setZipcode}
							keyboardType={"numeric"}
						/>
					</View>
					<View style={styles.container}>
						<Text style={styles.textStyle}>Ville: </Text>
						<TextInput
							style={styles.inputStyle}
							value={city}
							onChangeText={setCity}
						/>
					</View>
				</KeyboardAvoidingView>
				<View style={styles.buttonView}>
					<Button
						title={"Annuler"}
						color={colors.base}
						onPress={() => {
							onClose(profile);
						}}
						disabled={
							!checkProfile({
								...profile,
							})
						}
					/>

					<Button
						title={"Valider"}
						color={colors.base}
						disabled={
							!checkProfile({
								...profile,
								address,
								birthday,
								city,
								firstname,
								lastname,
								placeofbirth,
								zipcode,
							})
						}
						onPress={() => {
							onClose({
								...profile,
								address,
								birthday,
								city,
								firstname,
								lastname,
								placeofbirth,
								zipcode,
							});
						}}
					/>
				</View>
				{!checkProfile({
					...profile,
					address,
					birthday,
					city,
					firstname,
					lastname,
					placeofbirth,
					zipcode,
				}) && (
					<Text style={styles.errorText}>
						Pofil incomplet (vérifier le format de la date si tous les champs
						sont remplies)
					</Text>
				)}
			</ScrollView>
		</View>
	);
};

export default Data;
