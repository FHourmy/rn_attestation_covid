import React from "react";
import { Button, ScrollView, View } from "react-native";
import { ys } from "./certificate";

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
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 0.8,
					flexDirection: "row",
					flexWrap: "wrap",
				}}>
				{reasonsArray.map((reason) => (
					<View
						key={reason}
						style={{
							width: "40%",
							marginHorizontal: "5%",
							marginVertical: 10,
						}}>
						<Button
							title={reason}
							color={reasons.includes(reason) ? "green" : "grey"}
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
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-evenly",
					marginTop: 10,
				}}>
				<Button
					title={"créer il y a 30 minute"}
					color={createNow ? "grey" : "green"}
					onPress={() => {
						onChangeCreateNow(false);
					}}
				/>
				<Button
					title={"créer maintenant"}
					color={createNow ? "green" : "grey"}
					onPress={() => {
						onChangeCreateNow(true);
					}}
				/>
			</View>
		</View>
	);
};

export default Options;
