import React from "react";
import {
	View,
	Button,
	PermissionsAndroid,
	ViewStyle,
	TouchableOpacity,
	Text,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import { generatePdf, Profile } from "./certificate";
import Data from "./Data";
import Options from "./Options";
import colors from "./colors";
import {
	defaultProfile,
	getLastAttestation,
	getProfile,
	getReasons,
	storeLastAttestation,
	storeProfile,
	storeReasons,
} from "./storage";
import { formatDateToString } from "./utils";
const styles = {
	container: {
		display: "flex",
		flex: 1,
		backgroundColor: colors.background,
	} as ViewStyle,
	editButtonContainer: {
		marginBottom: 10,
		marginTop: 5,
		marginRight: "5%",
		alignItems: "flex-end",
	} as ViewStyle,
	editButton: { flexWrap: "wrap" } as ViewStyle,
	bottomButtons: {
		marginVertical: 10,
		flexDirection: "row",
		justifyContent: "space-evenly",
	} as ViewStyle,
	bottomButton: {
		marginHorizontal: "2%",
		flex: 1,
		flexWrap: "nowrap",
	} as ViewStyle,
	bottomTouchableOpacity: {
		padding: 10,
		elevation: 4,
		borderRadius: 2,
		justifyContent: "center",
	} as ViewStyle,
};

const getPermission = async () => {
	const granted = await PermissionsAndroid.check(
		PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	);

	if (!granted) {
		await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			{
				title: "Save attestations COVID",
				message: "Autoriser l'application à enregistrer des fichiers",
				buttonNegative: "Cancel",
				buttonNeutral: "Ask Me Later",
				buttonPositive: "OK",
			},
		);
	}
};
const App = () => {
	const [isLoadingData, setIsLoadingData] = React.useState(true);
	const [statusGenerating, setStatusGeneration] = React.useState<
		"waiting" | "generating" | "generated" | "failed"
	>("waiting");
	const [isEditingData, setIsEditingData] = React.useState(true);
	const [profile, setProfile] = React.useState<Profile>(defaultProfile);
	const [reasons, setReasons] = React.useState("");
	const [creationDate, setCreationDate] = React.useState(new Date());
	const [lastAttestion, setLastAttestion] = React.useState("");
	getPermission();
	const onGenerate = async () => {
		setStatusGeneration("generating");

		try {
			const path = await generatePdf(
				{ ...profile, ...formatDateToString(creationDate) },
				reasons,
			);
			storeLastAttestation(path);
			setLastAttestion(path);
			setTimeout(() => {
				setStatusGeneration("generated");
			}, 1000);

			setTimeout(() => {
				setStatusGeneration("waiting");
			}, 5000);
		} catch (e) {
			setTimeout(() => {
				setStatusGeneration("failed");
			}, 1000);

			setTimeout(() => {
				setStatusGeneration("waiting");
			}, 5000);
		}
	};
	React.useEffect(() => {
		const getStored = async () => {
			const profileStored = await getProfile();
			setProfile(profileStored);
			setReasons(await getReasons());
			setLastAttestion(await getLastAttestation());
			if (
				profileStored.address &&
				profileStored.birthday &&
				profileStored.city &&
				profileStored.firstname &&
				profileStored.lastname &&
				profileStored.zipcode &&
				profileStored.city
			) {
				setIsEditingData(false);
			}
			setIsLoadingData(false);
		};
		getStored();
	}, []);

	let buttonTitle = "Générer mon attestation";
	let buttonGenerationColor = colors.base;
	let buttonlastAttestionColor = colors.base;
	if (statusGenerating === "generating") {
		buttonTitle = "En cours de génération...";
		buttonGenerationColor = colors.disabled;
		buttonlastAttestionColor = colors.disabled;
	} else if (statusGenerating === "generated") {
		buttonTitle = "Généré dans mes téléchargement !";
		buttonGenerationColor = colors.ok;
	} else if (statusGenerating === "failed") {
		buttonTitle = "Echec de la génération, vérifier les permission";
		buttonGenerationColor = colors.error;
	}
	if (!lastAttestion) {
		buttonlastAttestionColor = colors.disabled;
	}
	if (isLoadingData) {
		return null;
	}
	if (isEditingData) {
		return (
			<View style={styles.container}>
				<Data
					onClose={async (newProfile) => {
						setProfile(newProfile);
						await storeProfile(newProfile);
						setIsEditingData(false);
					}}
					profile={profile}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.editButtonContainer}>
				<View style={styles.editButton}>
					<Button
						title={"Editer mes données"}
						onPress={() => {
							setIsEditingData(true);
						}}
						color={colors.base}
					/>
				</View>
			</View>
			<Options
				creationDate={creationDate}
				onChangeReasons={(r) => {
					setReasons(r);
					storeReasons(r);
				}}
				onChangeCreationDate={(d) => {
					setCreationDate(d);
				}}
				reasons={reasons}
			/>
			<View style={styles.bottomButtons}>
				<View style={styles.bottomButton}>
					<TouchableOpacity
						style={{
							...styles.bottomTouchableOpacity,
							backgroundColor: buttonlastAttestionColor,
						}}
						disabled={statusGenerating === "generating" || !lastAttestion}
						onPress={() => {
							FileViewer.open(lastAttestion, { showOpenWithDialog: true });
						}}>
						<Text style={{ color: "white", textAlign: "center" }}>
							{"ouvrir la derniere attestation".toUpperCase()}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.bottomButton}>
					<TouchableOpacity
						style={{
							...styles.bottomTouchableOpacity,
							backgroundColor: buttonGenerationColor,
							flex: 1,
						}}
						disabled={statusGenerating === "generating"}
						onPress={onGenerate}>
						<Text
							style={{
								color: "white",
								textAlign: "center",
								justifyContent: "center",
							}}>
							{buttonTitle.toUpperCase()}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default App;
