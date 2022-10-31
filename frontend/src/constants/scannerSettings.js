const pixelFormatValues = [
	{
		value: `any`,
		description: `Any pixelFormat, at the discretion of the scanner. This includes custom pixelFormats not defined by the TWAIN Direct specification.`,
	},
	{
		value: `bw1`,
		description: `Black-and-white with a bit depth of 1, also called packed bitonal, since an 8-bit byte contains 8 of these pixelFormats.`,
	},
	{
		value: `gray8`,
		description: `Grayscale with a bit depth of 8, allowing for 256 shades of grey.`,
	},
	{
		value: `gray16`,
		description: `Grayscale with a bit depth of 16, allowing for 65536 shades of grey.`,
	},
	{
		value: `raw`,
		description: `Intended for use with uncalibratedImage. It tells the scanner to use the pixelFormat that carries the most information that the scanner can provide. Raw cannot be reported in the metadata, the scanner must report one of the other pixelFormats, such as rgb24.`,
	},
	{
		value: `rgb24`,
		description: `Color with a bit depth of 24 (8-bits per channel), allowing for 16.7 million colors.`,
	},
	{
		value: `rgb48`,
		description: `Color with a bit depth of 48 (16-bits per channel), allowing for 281 trillion colors.`,
	},
];

const resolutionValues = [
	{
		value: `int`,
		description: `An integer value. Typical values are 75, 100, 150, 200, 240, 250, 300, 400, 500, 600, 1200, 2400, 4800, 9600 and 19200. Some scanners support continuous ranges`,
	},
	{
		value: `closest`,
		description: `Selects the supported value closest to the previously requested value. If used alone, or if the previous value is not an integer, the scanner uses its power-on default. If the previous value requested is exactly between two choices, then the higher value is selected (ex: 100 and 200 are valid, and 150 is requested, then 200 is used). If the previous value is entirely out of range, the scanner's minimum or maximum value is used, whichever is closer. `,
	},
	{
		value: `closestGreaterThan`,
		description: `Selects the closest supported value greater than or equal to the previously requested value. If used alone, or if the previous value is not an integer, the scanner uses its power-on default. If there is no greater value, the scanner's maximum value is used.`,
	},
	{
		value: `closestLessThan`,
		description: `Selects the closest supported value less than or equal to the previously requested value. If used alone, or if the previous value is not an integer, the scanner uses its power-on default. If there is no lesser value, the scanner's minimum value is used.`,
	},
	{
		value: `maximum`,
		description: `Use the maximum value supported by this scanner.`,
	},
	{
		value: `minimum`,
		description: `Use the minimum value supported by this scanner.`,
	},
	{
		value: `optical`,
		description: `Use the optical resolution of the scanner. This produces the best image (least artifacts from scaling) that the scanner can produce, but the images can be large if the optical resolution is high, such as 1200dpi, which will result in a 404MB uncompressed color image for an 8.5 x 11 inch sheet of paper. If a scanner does not have an optical value it uses its power-on default.`,
	},
	{
		value: `preview`,
		description: `Use the minimum resolution of the scanner suitable for creating preview images.`,
	},
];

const numberOfSheetsValues = [
	{
		value: `int`,
		description: `The number of sheets.`,
	},
	{
		value: `maximum`,
		description: `Capture the maximum number of sheets supported by the scanner. This is the recommended default.`,
	},
];

export const scannerSettings = [
	{
		name: `pixelFormat`,
		label: `Color`,
		values: pixelFormatValues,
		defaultValue: `any`,
		hasInt: false
	},
	{
		name: `resolution`,
		label: `Resolution`,
		placeholder: `The resolution of the image in dpi`,
		values: resolutionValues,
		defaultValue: `int`,
		hasInt: true,
	},
	{
		name: `numberOfSheets`,
		label: `Number of Sheets`,
		placeholder: `The number of sheets.`,
		values: numberOfSheetsValues,
		defaultValue: `int`,
		hasInt: true,
	},
];
