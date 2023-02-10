import { FileUploader } from 'react-drag-drop-files';

export interface ImageType {
	base64: string;
	name: string;
}

export interface ImageUploadProps {
	onSelect: (image: ImageType) => void;
}

export function ImageUpload(props: ImageUploadProps) {
	const onSelect = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			const base64 = (reader.result as string).split('base64,')[1];
			props.onSelect({
				base64,
				name: file.name,
			});
		};
	};
	return (
		<FileUploader
			multiple={false}
			handleChange={onSelect}
			name="file"
			types={['PNG', 'JPG', 'JPEG', 'GIF']}
		/>
	);
}
