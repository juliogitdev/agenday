
export async function validateImage( file: File): Promise<{ isValid: boolean; error: string | null }> {
	const MAX_SIZE = 500 * 1024; // 500KB
	const MIN_WIDTH = 150;
	const MIN_HEIGHT = 150;
	const MAX_WIDTH = 1000;
	const MAX_HEIGHT = 1000;

	if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
		return {
			isValid: false,
			error: "Formato inválido"
		};
	}

	if (file.size > MAX_SIZE) {
		return {
			isValid: false,
			error: "Imagem acima de 500KB"
		};
	}

	return new Promise(resolve => {
		const img = new Image();

		img.onload = () => {
			const { width, height } = img;

			if (
				width < MIN_WIDTH ||
				height < MIN_HEIGHT
			) {
				resolve({
					isValid: false,
					error: "Imagem muito pequena"
				});
				return;
			}

			if (
				width > MAX_WIDTH ||
				height > MAX_HEIGHT
			) {
				resolve({
					isValid: false,
					error: "Resolução muito grande"
				});
				return;
			}

			resolve({
				isValid: true,
				error: null
			});

			URL.revokeObjectURL(img.src);
		};

		img.onerror = () =>
			resolve({
				isValid: false,
				error: "Imagem inválida"
			});

		img.src = URL.createObjectURL(file);
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