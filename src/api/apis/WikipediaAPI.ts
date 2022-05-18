import {APIModel} from '../APIModel';
import {MediaTypeModel} from '../../models/MediaTypeModel';
import MediaDbPlugin from '../../main';
import {WikiModel} from '../../models/WikiModel';

export class WikipediaAPI extends APIModel {
	plugin: MediaDbPlugin;

	constructor(plugin: MediaDbPlugin) {
		super();

		this.plugin = plugin;
		this.apiName = 'Wikipedia API';
		this.apiDescription = 'The API behind Wikipedia';
		this.apiUrl = 'https://www.wikipedia.com';
		this.types = ['wiki'];
	}

	async searchByTitle(title: string): Promise<MediaTypeModel[]> {
		console.log(`MDB | api "${this.apiName}" queried`);

		const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${title}&srlimit=20&utf8=&format=json&origin=*`;

		const fetchData = await fetch(searchUrl);
		console.log(fetchData);
		if (fetchData.status !== 200) {
			throw Error(`Received status code ${fetchData.status} from an API.`);
		}
		const data = await fetchData.json();

		console.log(data);

		let ret: MediaTypeModel[] = [];


		for (const result of data.query.search) {
			ret.push(new WikiModel({
				type: 'wiki',
				title: result.title,
				englishTitle: result.title,
				year: '',
				dataSource: this.apiName,
				id: result.pageid,
			} as WikiModel));
		}

		return ret;
	}

	async getById(item: MediaTypeModel): Promise<MediaTypeModel> {

		const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${item.id}&inprop=url&format=json&origin=*`;

		const fetchData = await fetch(searchUrl);
		if (fetchData.status !== 200) {
			throw Error(`Received status code ${fetchData.status} from an API.`);
		}

		const data = await fetchData.json();
		console.log(data);
		const result = Object.entries(data?.query?.pages)[0][1];

		const model = new WikiModel({
			type: 'wiki',
			title: result.title,
			englishTitle: result.title,
			year: '',
			dataSource: this.apiName,
			id: result.pageid,

			wikiUrl: result.fullurl,
			lastUpdated: (new Date(result.touched)).toLocaleDateString() ?? 'unknown',
			length: result.length,
		} as WikiModel);

		return model;
	}
}