import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Button } from "react-native";
import { generatePdf, Profile } from "./certificate";
import Data from "./Data";
import Options from "./Options";

const defaultProfile: Profile = {
	address: "",
	birthday: "",
	datesortie: "",
	heuresortie: "",
	firstname: "",
	lastname: "",
	placeofbirth: "",
	city: "",
	zipcode: "",
};

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
const storeProfile = async (profile: Profile) => {
	try {
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
	} catch (e) {
		return;
	}
};

const getProfile = async (): Promise<Profile> => {
	try {
		const profile = await AsyncStorage.getItem("profile");
		if (profile !== null) {
			return JSON.parse(profile);
		}
		return defaultProfile;
	} catch (e) {
		return defaultProfile;
	}
};

const storeReasons = async (reasons: string) => {
	try {
		await AsyncStorage.setItem("reasons", JSON.stringify(reasons));
	} catch (e) {
		return;
	}
};

const getReasons = async () => {
	try {
		const reasons = await AsyncStorage.getItem("reasons");
		if (reasons !== null) {
			return JSON.parse(reasons);
		}
		return "";
	} catch (e) {
		return "";
	}
};

const storeCreateNow = async (createNow: boolean) => {
	try {
		await AsyncStorage.setItem("createNow", JSON.stringify(createNow));
	} catch (e) {
		return;
	}
};

const getCreateNow = async () => {
	try {
		const createNow = await AsyncStorage.getItem("createNow");
		if (createNow !== null) {
			return JSON.parse(createNow);
		}
		return true;
	} catch (e) {
		return true;
	}
};
const App = () => {
	const [isLoadingData, setIsLoadingData] = React.useState(true);
	const [statusGenerating, setStatusGeneration] = React.useState<
		"waiting" | "generating" | "generated"
	>("waiting");
	const [isEditingData, setIsEditingData] = React.useState(true);
	const [profile, setProfile] = React.useState<Profile>(defaultProfile);
	const [reasons, setReasons] = React.useState("");
	const [createNow, setCreateNow] = React.useState(true);

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
	let buttonColor = undefined;
	if (statusGenerating === "generating") {
		buttonTitle = "En cours de génération...";
		buttonColor = "grey";
	} else if (statusGenerating === "generated") {
		buttonTitle = "Généré dans mes téléchargement !";
		buttonColor = "green";
	}
	if (isLoadingData) {
		return null;
	}
	if (isEditingData) {
		return (
			<Data
				onClose={async (newProfile) => {
					setProfile(newProfile);
					await storeProfile(newProfile);
					setIsEditingData(false);
				}}
				profile={profile}
			/>
		);
	}

	return (
		<View style={{ display: "flex", flex: 1 }}>
			<View style={{ marginBottom: 10 }}>
				<Button
					title={"Editer mes données"}
					onPress={() => {
						setIsEditingData(true);
					}}
				/>
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
					onPress={async () => {
						setStatusGeneration("generating");
						generatePdf({ ...profile, ...sortie(createNow) }, reasons);
						setTimeout(() => {
							setStatusGeneration("generated");
						}, 1000);

						setTimeout(() => {
							setStatusGeneration("waiting");
						}, 5000);
					}}
				/>
			</View>
		</View>
	);
};

export default App;
