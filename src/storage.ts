import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "./certificate";

export const defaultProfile: Profile = {
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

export const storeProfile = async (profile: Profile) => {
	try {
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
	} catch (e) {
		return;
	}
};

export const getProfile = async (): Promise<Profile> => {
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

export const storeReasons = async (reasons: string) => {
	try {
		await AsyncStorage.setItem("reasons", JSON.stringify(reasons));
	} catch (e) {
		return;
	}
};

export const getReasons = async () => {
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

export const storeLastAttestation = async (pathLastAttestion: string) => {
	try {
		await AsyncStorage.setItem(
			"lastAttestion",
			JSON.stringify(pathLastAttestion),
		);
	} catch (e) {
		return;
	}
};

export const getLastAttestation = async (): Promise<string> => {
	try {
		const createNow = await AsyncStorage.getItem("lastAttestion");
		if (createNow !== null) {
			return JSON.parse(createNow);
		}
		return "";
	} catch (e) {
		return "";
	}
};
