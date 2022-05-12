export abstract class MediaTypeModel {
	type: string;
	title: string;
	englishTitle: string;
	year: string;
	dataSource: string;
	url: string;
	id: string;

	abstract toMetaData(): string;

	abstract getFileName(): string;
}