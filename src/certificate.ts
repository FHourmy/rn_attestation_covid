import { PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import RNFetchBlob from "rn-fetch-blob";

export interface Profile {
	lastname: string;
	firstname: string;
	birthday: string;
	placeofbirth: string;
	address: string;
	zipcode: string;
	city: string;
	datesortie: string;
	heuresortie: string;
}
const generateQR = async (text: any) => {
	try {
		// return QRCode.toString(text, { errorCorrectionLevel: "M" });
		return QRCode.toString(text, {
			errorCorrectionLevel: "M",
			type: "svg",
			width: 100,
		});
	} catch (err) {
		console.error(err);
	}
};

function idealFontSize(
	font: PDFFont,
	text: string,
	maxWidth: number,
	minSize: number,
	defaultSize: number,
) {
	let currentSize = defaultSize;
	let textWidth = font.widthOfTextAtSize(text, defaultSize);

	while (textWidth > maxWidth && currentSize > minSize) {
		textWidth = font.widthOfTextAtSize(text, --currentSize);
	}

	return textWidth > maxWidth ? null : currentSize;
}

export const ys: any = {
	travail: 578,
	achats: 533,
	sante: 477,
	famille: 435,
	handicap: 396,
	sport_animaux: 358,
	convocation: 295,
	missions: 255,
	enfants: 211,
};

export async function generatePdf(profile: Profile, reasons: string) {
	const creationInstant = new Date();
	const creationDate = creationInstant.toLocaleDateString("fr-FR");
	const creationHour = creationInstant
		.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
		.replace(":", "h");

	const {
		lastname,
		firstname,
		birthday,
		placeofbirth,
		address,
		zipcode,
		city,
		datesortie,
		heuresortie,
	} = profile;

	const data = [
		`Cree le: ${creationDate} a ${creationHour}`,
		`Nom: ${lastname}`,
		`Prenom: ${firstname}`,
		`Naissance: ${birthday} a ${placeofbirth}`,
		`Adresse: ${address} ${zipcode} ${city}`,
		`Sortie: ${datesortie} a ${heuresortie}`,
		`Motifs: ${reasons.replace(/ /g, ", ")}`,
	].join(";\n ");

	const myPdf = await RNFetchBlob.fs.readFile(
		RNFetchBlob.fs.asset("certificate.pdf"),
		"base64",
	);
	const pdfDoc = await PDFDocument.load(myPdf);

	// set pdf metadata
	pdfDoc.setTitle("COVID-19 - Déclaration de déplacement");
	pdfDoc.setSubject("Attestation de déplacement dérogatoire");
	pdfDoc.setKeywords([
		"covid19",
		"covid-19",
		"attestation",
		"déclaration",
		"déplacement",
		"officielle",
		"gouvernement",
	]);
	pdfDoc.setProducer("DNUM/SDIT");
	pdfDoc.setCreator("");
	pdfDoc.setAuthor("Ministère de l'intérieur");

	const page1 = pdfDoc.getPages()[0];

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const drawText = (text: string, x: number, y: number, size = 11) => {
		page1.drawText(text, { x, y, size, font });
	};

	drawText(`${firstname} ${lastname}`, 119, 696);
	drawText(birthday, 119, 674);
	drawText(placeofbirth, 297, 674);
	drawText(`${address} ${zipcode} ${city}`, 133, 652);

	reasons.split(" ").forEach((reason) => {
		drawText("x", 78, ys[reason], 18);
	});

	let locationSize = idealFontSize(font, profile.city, 83, 7, 11);

	if (!locationSize) {
		locationSize = 7;
	}

	drawText(profile.city, 105, 177, locationSize);
	drawText(`${profile.datesortie}`, 91, 153, 11);
	drawText(`${profile.heuresortie}`, 264, 153, 11);

	const qrImage = (await generateQR(data)) || "";

	page1.drawSvgPath(qrImage.split("/><path ")[1].split("/>")[0], {
		x: page1.getWidth() - 156,
		y: 210,
		scale: 1.5,
		borderColor: rgb(0, 0, 0),
	});

	pdfDoc.addPage();
	const page2 = pdfDoc.getPages()[1];

	page2.drawSvgPath(qrImage.split("/><path ")[1].split("/>")[0], {
		x: 50,
		y: page2.getHeight() - 50,
		scale: 3,
		borderColor: rgb(0, 0, 0),
	});

	const pdfBytes = await pdfDoc.saveAsBase64();

	await RNFetchBlob.fs.createFile(
		RNFetchBlob.fs.dirs.DownloadDir + "/" + new Date().getTime() + ".pdf",
		pdfBytes,
		"base64",
	);
	console.log("done");
}
