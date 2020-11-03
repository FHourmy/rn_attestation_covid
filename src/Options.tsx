import React from "react";
import { Button, View, ViewStyle } from "react-native";
import { ys } from "./certificate";
import colors from "./colors";

const styles = {
	container: { flex: 1 },
	buttonsContainer: {
		flex: 0.8,
		flexDirection: "row",
		flexWrap: "wrap",
	} as ViewStyle,
	buttonContainer: {
		width: "40%",
		marginHorizontal: "5%",
		marginVertical: 10,
	} as ViewStyle,
	timeButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 10,
	} as ViewStyle,
};
const reasonsArray = Object.keys(ys);

const Options = ({
	reasons,
	onChangeReasons,
	createNow,
	onChangeCreateNow,
}: {
	reasons: string;
	onChangeReasons: (reasons: string) => void;
	createNow: boolean;
	onChangeCreateNow: (createNow: boolean) => void;
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.buttonsContainer}>
				{reasonsArray.map((reason) => (
					<View key={reason} style={styles.buttonContainer}>
						<Button
							title={reason}
							color={reasons.includes(reason) ? colors.second : colors.disabled}
							onPress={() => {
								if (reasons.includes(reason)) {
									onChangeReasons(reasons.replace(reason, "").trim());
								} else {
									onChangeReasons((reasons + " " + reason).trim());
								}
							}}
						/>
					</View>
				))}
			</View>
			<View style={styles.timeButtonContainer}>
				<Button
					title={"créer il y a 30 minute"}
					color={createNow ? colors.disabled : colors.second}
					onPress={() => {
						onChangeCreateNow(false);
					}}
				/>
				<Button
					title={"créer maintenant"}
					color={createNow ? colors.second : colors.disabled}
					onPress={() => {
						onChangeCreateNow(true);
					}}
				/>
			</View>
		</View>
	);
};

export default Options;
