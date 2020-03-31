export interface Case {
	date: string;
	confirmed: number;
	deaths: number;
	recovered: number;
}

export interface Countries {
	[key:string]: Case[];
}