

export async function validateImage(
	file: File
): Promise<{ isValid: boolean; error: string | null }> {
	const MAX_SIZE = 2 * 1024 * 1024;

	const MIN_WIDTH = 128;
	const MIN_HEIGHT = 128;

	const MAX_WIDTH = 512;
	const MAX_HEIGHT = 512;

	const ALLOWED_TYPES = [
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/svg+xml"
	];

	if (!ALLOWED_TYPES.includes(file.type)) {
		return {
			isValid: false,
			error: "Formato inválido. Utilize PNG, JPEG, WEBP ou SVG."
		};
	}

	if (file.size > MAX_SIZE) {
		return {
			isValid: false,
			error: "A imagem deve possuir no máximo 2 MB."
		};
	}

	if (file.type === "image/svg+xml") {
		return {
			isValid: true,
			error: null
		};
	}

	return new Promise(resolve => {
		const objectUrl = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);

			if (
				img.width < MIN_WIDTH ||
				img.height < MIN_HEIGHT
			) {
				resolve({
					isValid: false,
					error: `A imagem deve possuir no mínimo ${MIN_WIDTH}x${MIN_HEIGHT}px.`
				});
				return;
			}

			if (
				img.width > MAX_WIDTH ||
				img.height > MAX_HEIGHT
			) {
				resolve({
					isValid: false,
					error: `A imagem deve possuir no máximo ${MAX_WIDTH}x${MAX_HEIGHT}px.`
				});
				return;
			}

			resolve({
				isValid: true,
				error: null
			});
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);

			resolve({
				isValid: false,
				error: "Não foi possível processar a imagem."
			});
		};

		img.src = objectUrl;
	});
}


export async function compressImage( file: File): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			const canvas = document.createElement("canvas");

			const MAX_SIZE = 256;

			let { width, height } = img;

			if (width > height) {
				height = (height / width) * MAX_SIZE;
				width = MAX_SIZE;
			} else {
				width = (width / height) * MAX_SIZE;
				height = MAX_SIZE;
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");

			if (!ctx) {
				reject(new Error("Canvas não disponível"));
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("Falha ao gerar imagem"));
						return;
					}

					resolve(
						new File(
							[blob],
							file.name,
							{
								type: "image/jpeg",
								lastModified: Date.now()
							}
						)
					);
				},
				"image/jpeg",
				0.8 // qualidade: 0 a 1
			);
		};

		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}