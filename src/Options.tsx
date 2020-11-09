import React from "react";
import { Button, View, ViewStyle } from "react-native";
import { ys } from "./certificate";
import colors from "./colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateToString } from "./utils";

const reasonsArray = Object.keys(ys);

const Options = ({
	reasons,
	onChangeReasons,
	creationDate,
	onChangeCreationDate,
}: {
	reasons: string;
	onChangeReasons: (reasons: string) => void;
	creationDate: Date;
	onChangeCreationDate: (creationDate: Date) => void;
}) => {
	const [showPicker, setShowPicker] = React.useState(false);
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
					title={`Créer à : ${formatDateToString(creationDate).heuresortie}`}
					color={colors.second}
					onPress={() => {
						setShowPicker(true);
					}}
				/>
				{showPicker && (
					<DateTimePicker
						testID="dateTimePicker"
						value={creationDate}
						mode={"time"}
						display="spinner"
						onChange={(e, date) => {
							setShowPicker(false);
							onChangeCreationDate(date || creationDate);
						}}
					/>
				)}
			</View>
		</View>
	);
};

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

export default Options;
