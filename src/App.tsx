import React from "react";
import { View, Button, PermissionsAndroid, Image } from "react-native";
import { generatePdf, Profile } from "./certificate";
import Data from "./Data";
import Options from "./Options";
import colors from "./colors";
import {
	defaultProfile,
	getCreateNow,
	getProfile,
	getReasons,
	storeCreateNow,
	storeProfile,
	storeReasons,
} from "./storage";

const formatNumber = (value: number): string => {
	if (value < 10) {
		return "0" + value;
	}
	return "" + value;
};
const sortie = (createNow: boolean) => {
	const now = new Date();
	if (!createNow) {
		now.setTime(now.getTime() - 1000 * 60 * 30);
	}
	const hours = formatNumber(now.getHours());
	const minutes = formatNumber(now.getMinutes());
	const day = formatNumber(now.getDate());
	const month = formatNumber(now.getMonth() + 1);
	const year = formatNumber(now.getFullYear());

	return {
		datesortie: day + "/" + month + "/" + year,
		heuresortie: hours + ":" + minutes,
	};
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
	const [createNow, setCreateNow] = React.useState(true);
	getPermission();
	const onGenerate = async () => {
		setStatusGeneration("generating");

		try {
			generatePdf({ ...profile, ...sortie(createNow) }, reasons);
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
			setCreateNow(await getCreateNow());
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
	let buttonColor = colors.base;
	if (statusGenerating === "generating") {
		buttonTitle = "En cours de génération...";
		buttonColor = colors.disabled;
	} else if (statusGenerating === "generated") {
		buttonTitle = "Généré dans mes téléchargement !";
		buttonColor = colors.ok;
	} else if (statusGenerating === "failed") {
		buttonTitle = "Echec de la génération, vérifier les permission";
		buttonColor = colors.error;
	}
	if (isLoadingData) {
		return null;
	}
	if (isEditingData) {
		return (
			<View
				style={{
					display: "flex",
					flex: 1,
					backgroundColor: colors.background,
				}}>
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
		<View
			style={{ display: "flex", flex: 1, backgroundColor: colors.background }}>
			<View
				style={{
					marginBottom: 10,
					marginTop: 5,
					marginRight: "5%",
					alignItems: "flex-end",
				}}>
				<View style={{ flexWrap: "wrap" }}>
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
				createNow={createNow}
				onChangeReasons={(r) => {
					setReasons(r);
					storeReasons(r);
				}}
				onChangeCreateNow={(c) => {
					setCreateNow(c);
					storeCreateNow(c);
				}}
				reasons={reasons}
			/>
			<View style={{ marginVertical: 10 }}>
				<Button
					title={buttonTitle}
					color={buttonColor}
					disabled={statusGenerating === "generating"}
					onPress={onGenerate}
				/>
			</View>
		</View>
	);
};

export default App;
