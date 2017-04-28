export class Facet {

    constructor(public title: string, public query: any = {}, public count?: number, public disabled: boolean = false) { }
}